import User from "../models/User.js";
import Job from "../models/Job.js";

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) { next(error); }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, phone, skills, location, education, bio, resumeUrl } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, skills, location, education, bio, resumeUrl }, { new: true, runValidators: true }).select("-password");
    res.json(user);
  } catch (error) { next(error); }
}

// Get user saved jobs
export async function getSavedJobs(req, res, next) {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedJobs",
      match: { status: { $in: ["approved", "active"] } }
    });
    res.json(user?.savedJobs || []);
  } catch (error) { next(error); }
}

// Save job
export async function saveJob(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const jobId = req.params.jobId;
    if (!user.savedJobs.some((id) => String(id) === String(jobId))) {
      user.savedJobs.push(jobId);
      await user.save();
    }
    res.json({ message: "Job saved successfully", savedJobs: user.savedJobs });
  } catch (error) { next(error); }
}

// Unsave job
export async function unsaveJob(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.savedJobs = user.savedJobs.filter((id) => String(id) !== String(req.params.jobId));
    await user.save();
    res.json({ message: "Job removed from saved list", savedJobs: user.savedJobs });
  } catch (error) { next(error); }
}

