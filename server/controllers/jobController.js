import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// List jobs (Public / Jobseeker sees only approved/active jobs by default)
export async function listJobs(req, res, next) {
  try {
    const conditions = [];

    // By default, only show approved/active jobs to public and jobseekers
    if (req.query.status) {
      if (req.query.status !== "all") {
        conditions.push({ status: req.query.status });
      }
    } else {
      conditions.push({ status: { $in: ["approved", "active"] } });
    }

    if (req.query.keyword) {
      const k = req.query.keyword.trim();
      conditions.push({
        $or: [
          { title: { $regex: k, $options: "i" } },
          { company: { $regex: k, $options: "i" } },
          { location: { $regex: k, $options: "i" } },
          { jobType: { $regex: k, $options: "i" } },
          { type: { $regex: k, $options: "i" } },
          { experience: { $regex: k, $options: "i" } },
          { skills: { $elemMatch: { $regex: k, $options: "i" } } }
        ]
      });
    }

    if (req.query.company) {
      conditions.push({ company: { $regex: req.query.company.trim(), $options: "i" } });
    }

    if (req.query.location) {
      conditions.push({ location: { $regex: req.query.location.trim(), $options: "i" } });
    }

    if (req.query.jobType && req.query.jobType !== "All Types") {
      conditions.push({
        $or: [
          { jobType: { $regex: req.query.jobType.trim(), $options: "i" } },
          { type: { $regex: req.query.jobType.trim(), $options: "i" } }
        ]
      });
    }

    if (req.query.experience && req.query.experience !== "Any Experience") {
      conditions.push({ experience: { $regex: req.query.experience.trim(), $options: "i" } });
    }

    if (req.query.salary && req.query.salary !== "Any Salary") {
      conditions.push({ salary: { $regex: req.query.salary.trim(), $options: "i" } });
    }

    const queryFilter = conditions.length > 0 ? { $and: conditions } : {};
    const sortOrder = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const items = await Job.find(queryFilter)
      .populate("recruiterId", "name email")
      .sort(sortOrder);

    res.json(items);
  } catch (e) {
    next(e);
  }
}

// Get single job details
export async function getJob(req, res, next) {
  try {
    const item = await Job.findById(req.params.id)
      .populate("recruiterId", "name email")
      .populate("approvedBy", "name email");

    if (!item) return res.status(404).json({ message: "Job not found" });

    // Count applicants for this job
    const applicantsCount = await Application.countDocuments({ job: item._id });

    res.json({
      ...item.toObject(),
      applicantsCount
    });
  } catch (e) {
    next(e);
  }
}

// Recruiter / Admin creates a job
export async function createJob(req, res, next) {
  try {
    const recruiterId = req.user?.id || req.body.recruiterId || req.body.recruiter;

    // Process skills and requirements
    let skills = req.body.skills || [];
    if (typeof skills === "string") {
      skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    }

    let requirements = req.body.requirements || [];
    if (typeof requirements === "string") {
      requirements = requirements.split("\n").map((r) => r.trim()).filter(Boolean);
    }

    // Default status:
    // If admin posts: "approved" or given status
    // If recruiter posts: "pending" by default, or "draft" if explicitly specified
    let status = "pending";
    if (req.user?.role === "admin") {
      status = req.body.status || "approved";
    } else if (req.body.status === "draft") {
      status = "draft";
    }

    const jobData = {
      title: req.body.title,
      company: req.body.company,
      location: req.body.location,
      jobType: req.body.jobType || req.body.type || "Full Time",
      type: req.body.jobType || req.body.type || "Full Time",
      salary: req.body.salary || "Not disclosed",
      experience: req.body.experience || "Fresher / Any",
      skills,
      description: req.body.description,
      requirements,
      deadline: req.body.deadline || null,
      recruiterId,
      recruiter: recruiterId,
      status
    };

    if (status === "approved") {
      jobData.approvedBy = req.user?.id;
      jobData.approvedAt = new Date();
    }

    const job = await Job.create(jobData);

    // If job was created as pending, notify admins
    if (status === "pending") {
      const admins = await User.find({ role: "admin" }).select("_id");
      if (admins.length) {
        await Notification.insertMany(
          admins.map((admin) => ({
            user: admin._id,
            title: "New Job Pending Approval",
            message: `${job.company} posted "${job.title}". Review and approve this job in Job Management.`
          }))
        );
      }
    } else if (status === "approved" || status === "active") {
      // If immediately approved, notify jobseekers
      const jobseekers = await User.find({ role: "jobseeker" }).select("_id");
      if (jobseekers.length) {
        await Notification.insertMany(
          jobseekers.map((user) => ({
            user: user._id,
            title: "New Job Opening",
            message: `${job.company} is hiring for ${job.title} in ${job.location}. Apply now!`
          }))
        );
      }
    }

    res.status(201).json(job);
  } catch (e) {
    next(e);
  }
}

// Recruiter / Admin updates a job
export async function updateJob(req, res, next) {
  try {
    const filter = req.user?.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }] };

    const existingJob = await Job.findOne(filter);
    if (!existingJob) return res.status(404).json({ message: "Job not found or access denied" });

    const updateData = { ...req.body };

    // Format skills
    if (typeof updateData.skills === "string") {
      updateData.skills = updateData.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    // Format requirements
    if (typeof updateData.requirements === "string") {
      updateData.requirements = updateData.requirements.split("\n").map((r) => r.trim()).filter(Boolean);
    }
    if (updateData.jobType) {
      updateData.type = updateData.jobType;
    }

    // If recruiter updates a rejected job, re-submit it for approval as pending
    if (req.user?.role === "recruiter") {
      if (existingJob.status === "rejected" || req.body.resubmitForApproval) {
        updateData.status = "pending";
        updateData.rejectionReason = "";
      }
    }

    const updated = await Job.findByIdAndUpdate(existingJob._id, updateData, {
      new: true,
      runValidators: true
    }).populate("recruiterId", "name email");

    // If resubmitted as pending, notify admins
    if (updateData.status === "pending" && existingJob.status !== "pending") {
      const admins = await User.find({ role: "admin" }).select("_id");
      if (admins.length) {
        await Notification.insertMany(
          admins.map((admin) => ({
            user: admin._id,
            title: "Job Resubmitted for Approval",
            message: `${updated.company} resubmitted "${updated.title}" for approval.`
          }))
        );
      }
    }

    res.json(updated);
  } catch (e) {
    next(e);
  }
}

// Recruiter / Admin closes a job
export async function closeJob(req, res, next) {
  try {
    const filter = req.user?.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }] };

    const job = await Job.findOneAndUpdate(
      filter,
      { status: "closed" },
      { new: true }
    );

    if (!job) return res.status(404).json({ message: "Job not found or access denied" });

    res.json({ message: "Job closed successfully", job });
  } catch (e) {
    next(e);
  }
}

// Recruiter / Admin deletes a job
export async function deleteJob(req, res, next) {
  try {
    const filter = req.user?.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }] };

    const item = await Job.findOneAndDelete(filter);
    if (!item) return res.status(404).json({ message: "Job not found or access denied" });

    // Also delete associated applications
    await Application.deleteMany({ job: item._id });

    res.json({ message: "Job deleted successfully" });
  } catch (e) {
    next(e);
  }
}

// Recruiter views their own posted jobs with applicant counts
export async function myJobs(req, res, next) {
  try {
    const jobs = await Job.find({
      $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }]
    }).sort({ createdAt: -1 });

    // Aggregate applicant counts
    const jobIds = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[String(c._id)] = c.count;
    });

    const results = jobs.map((j) => ({
      ...j.toObject(),
      applicantsCount: countMap[String(j._id)] || 0
    }));

    res.json(results);
  } catch (e) {
    next(e);
  }
}

