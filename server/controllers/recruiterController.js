import User from "../models/User.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

export async function listUsers(req, res, next) {
  try {
    res.json(await User.find({ role: "recruiter" }).select("-password").sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
}

export async function getUser(req, res, next) {
  try {
    const item = await User.findOne({ _id: req.params.id, role: "recruiter" }).select("-password");
    if (!item) return res.status(404).json({ message: "Recruiter not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createUser(req, res, next) {
  try {
    const item = await User.create({ ...req.body, role: "recruiter" });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
}

export async function updateUser(req, res, next) {
  try {
    const item = await User.findOneAndUpdate(
      { _id: req.params.id, role: "recruiter" },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await User.findOneAndDelete({ _id: req.params.id, role: "recruiter" });
    res.json({ message: "Recruiter deleted" });
  } catch (e) {
    next(e);
  }
}

export async function profile(req, res, next) {
  try {
    res.json({ user: await User.findById(req.user.id).select("-password") });
  } catch (e) {
    next(e);
  }
}

export async function updateProfile(req, res, next) {
  try {
    res.json({ user: await User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true }).select("-password") });
  } catch (e) {
    next(e);
  }
}

export async function dashboard(req, res, next) {
  try {
    const jobs = await Job.find({
      $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }]
    }).sort({ createdAt: -1 });

    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("job", "title company location")
      .populate("candidate", "name email phone skills")
      .sort({ createdAt: -1 });

    res.json({
      activeJobs: jobs.filter((job) => job.status === "approved" || job.status === "active").length,
      pendingJobs: jobs.filter((job) => job.status === "pending").length,
      rejectedJobs: jobs.filter((job) => job.status === "rejected").length,
      closedJobs: jobs.filter((job) => job.status === "closed").length,
      totalJobs: jobs.length,
      totalApplicants: applications.length,
      shortlisted: applications.filter((item) => item.status === "shortlisted").length,
      interviews: applications.filter((item) => item.status === "interview").length,
      inReview: applications.filter((item) => item.status === "review").length,
      recentJobs: jobs.slice(0, 5),
      recentApplicants: applications.slice(0, 5)
    });
  } catch (e) {
    next(e);
  }
}

// Recruiter fetches applicants (can filter by jobId query param or fetch all applicants for recruiter)
export async function applicants(req, res, next) {
  try {
    const recruiterJobs = await Job.find({
      $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }]
    }).select("_id title company");

    const jobIds = recruiterJobs.map((j) => j._id);

    const filter = { job: { $in: jobIds } };

    const targetJobId = req.params.jobId || req.query.jobId;
    if (targetJobId) {
      if (!jobIds.some((id) => String(id) === String(targetJobId))) {
        return res.status(403).json({ message: "Access denied: Not your job posting" });
      }
      filter.job = targetJobId;
    }

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const items = await Application.find(filter)
      .populate("job", "title company location status")
      .populate("candidate", "name email phone skills education bio resumeUrl")
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (e) {
    next(e);
  }
}

// Get specific applicant details for recruiter
export async function getApplicant(req, res, next) {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("candidate", "name email phone skills education bio resumeUrl");

    if (!application) return res.status(404).json({ message: "Application not found" });

    const jobRecruiter = application.job?.recruiterId || application.job?.recruiter;
    if (String(jobRecruiter) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(application);
  } catch (e) {
    next(e);
  }
}

// Recruiter updates applicant status (shortlist, reject, review, hire)
export async function updateApplicant(req, res, next) {
  try {
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const jobRecruiter = application.job?.recruiterId || application.job?.recruiter;
    if (String(jobRecruiter) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const previousStatus = application.status;
    if (req.body.status) application.status = req.body.status;
    if (req.body.interview) application.interview = { ...application.interview, ...req.body.interview };

    await application.save();

    // Send notification if status changed
    if (req.body.status && req.body.status !== previousStatus) {
      let title = "Application Status Update";
      let msg = `Your application for "${application.job?.title}" status has changed to ${req.body.status}.`;

      if (req.body.status === "shortlisted") {
        title = "Congratulations! Shortlisted";
        msg = `You have been shortlisted for "${application.job?.title}" at ${application.job?.company}!`;
      } else if (req.body.status === "rejected") {
        title = "Application Update";
        msg = `Thank you for your interest in "${application.job?.title}". Your application was not selected at this time.`;
      } else if (req.body.status === "hired") {
        title = "Job Offer / Hired!";
        msg = `Congratulations! You have been selected for the position of "${application.job?.title}" at ${application.job?.company}!`;
      }

      await Notification.create({
        user: application.candidate,
        title,
        message: msg
      });
    }

    res.json(application);
  } catch (e) {
    next(e);
  }
}

// Recruiter schedules an interview for an applicant
export async function scheduleInterview(req, res, next) {
  try {
    const { scheduledAt, interviewType, interviewLink, notes } = req.body;

    if (!scheduledAt) {
      return res.status(400).json({ message: "Scheduled date & time is required" });
    }

    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const jobRecruiter = application.job?.recruiterId || application.job?.recruiter;
    if (String(jobRecruiter) !== String(req.user.id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = "interview";
    application.interview = {
      scheduledAt: new Date(scheduledAt),
      interviewType: interviewType || "Online",
      interviewLink: interviewLink || "",
      notes: notes || ""
    };

    await application.save();

    // Send high-priority notification to the candidate
    const formattedDate = new Date(scheduledAt).toLocaleString();
    let notificationMsg = `An interview has been scheduled for "${application.job?.title}" at ${application.job?.company} on ${formattedDate} (${interviewType || "Online"}).`;
    if (interviewLink) {
      notificationMsg += ` Meeting Link: ${interviewLink}`;
    }
    if (notes) {
      notificationMsg += ` Note: ${notes}`;
    }

    await Notification.create({
      user: application.candidate,
      title: "Interview Scheduled!",
      message: notificationMsg
    });

    res.json({
      message: "Interview scheduled successfully and candidate notified",
      application
    });
  } catch (e) {
    next(e);
  }
}

