import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export async function dashboard(req, res, next) {
  try {
    const [applications, activeJobs, user] = await Promise.all([
      Application.find({ candidate: req.user.id }).populate("job", "title company location").sort({ createdAt: -1 }),
      Job.countDocuments({ status: { $in: ["active", "approved"] } }),
      User.findById(req.user.id).select("name email phone skills education bio")
    ]);
    const profileFields = [user?.name, user?.email, user?.phone, user?.skills?.length, user?.education, user?.bio];
    const profileCompletion = Math.round(profileFields.filter(Boolean).length / profileFields.length * 100);
    res.json({
      profileCompletion,
      applicationsCount: applications.length,
      activeJobs,
      shortlistedCount: applications.filter((item) => item.status === "shortlisted").length,
      recentApplications: applications.slice(0, 4)
    });
  } catch (e) {
    next(e);
  }
}

export async function listApplications(req, res, next) {
  try {
    const filter = req.user?.role === "jobseeker" ? { candidate: req.user.id } : req.query.candidate ? { candidate: req.query.candidate } : {};
    const items = await Application.find(filter).populate("job").populate("candidate", "name email phone skills").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
}

export async function myApplications(req, res, next) {
  req.query.candidate = req.user.id;
  return listApplications(req, res, next);
}

export async function getApplication(req, res, next) {
  try {
    const item = await Application.findById(req.params.id).populate("job").populate("candidate", "name email phone skills education bio resumeUrl");
    if (!item) return res.status(404).json({ message: "Application not found" });
    if (req.user?.role === "jobseeker" && String(item.candidate._id) !== String(req.user.id)) return res.status(403).json({ message: "Access denied" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function createApplication(req, res, next) {
  try {
    const exists = await Application.findOne({ job: req.body.job, candidate: req.user.id });
    if (exists) return res.status(409).json({ message: "Already applied for this job" });
    const item = await Application.create({ ...req.body, candidate: req.user.id });
    const populated = await item.populate("job");

    // Notify recruiter about the new application
    const job = await Job.findById(req.body.job);
    if (job) {
      const recruiterRecipient = job.recruiterId || job.recruiter;
      if (recruiterRecipient) {
        await Notification.create({
          user: recruiterRecipient,
          title: "New Job Applicant",
          message: `${req.user?.name || "A candidate"} applied for "${job.title}". Check your applicants list.`
        });
      }
    }

    res.status(201).json(populated);
  } catch (e) {
    next(e);
  }
}

export async function updateApplication(req, res, next) {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.role === "jobseeker") filter.candidate = req.user.id;
    const item = await Application.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Application not found" });
    res.json(item);
  } catch (e) {
    next(e);
  }
}

export async function deleteApplication(req, res, next) {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.role === "jobseeker") filter.candidate = req.user.id;
    const item = await Application.findOneAndDelete(filter);
    if (!item) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application withdrawn" });
  } catch (e) {
    next(e);
  }
}

export async function jobApplicants(req, res, next) {
  try {
    const job = await Job.findOne({
      _id: req.params.jobId,
      $or: [{ recruiterId: req.user.id }, { recruiter: req.user.id }]
    }).select("_id");
    if (!job) return res.status(403).json({ message: "Access denied" });
    const items = await Application.find({ job: job._id }).populate("candidate", "name email phone skills education bio resumeUrl").populate("job", "title company location").sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    next(e);
  }
}

