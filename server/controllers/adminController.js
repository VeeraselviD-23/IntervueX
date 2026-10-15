import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Application from "../models/Application.js";
import InterviewQuestion from "../models/InterviewQuestion.js";
import CodingQuestion from "../models/CodingQuestion.js";
import Test from "../models/Test.js";
import Notification from "../models/Notification.js";

export async function dashboard(req, res, next) {
  try {
    const [
      users,
      jobseekers,
      recruiters,
      jobs,
      pendingJobs,
      companies,
      applications,
      interviews,
      codingQuestions,
      tests,
      recentJobs,
      recentApplications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Job.countDocuments({ status: "pending" }),
      Company.countDocuments(),
      Application.countDocuments(),
      InterviewQuestion.countDocuments(),
      CodingQuestion.countDocuments(),
      Test.countDocuments(),
      Job.find().populate("recruiterId", "name email").select("title status company location recruiterId createdAt").sort({ createdAt: -1 }).limit(5),
      Application.find().populate("job", "title").populate("candidate", "name email").select("status job candidate createdAt").sort({ createdAt: -1 }).limit(5)
    ]);
    res.json({
      users,
      jobseekers,
      recruiters,
      jobs,
      pendingJobs,
      companies,
      applications,
      interviews,
      codingQuestions,
      tests,
      recentJobs,
      recentApplications
    });
  } catch (e) {
    next(e);
  }
}

export const users = async (req, res, next) => {
  try {
    res.json(await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
};

export const recruiters = async (req, res, next) => {
  try {
    res.json(await User.find({ role: "recruiter" }).select("-password").sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
};

// Admin lists all jobs with filters and applicant counts
export const jobs = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const s = req.query.search.trim();
      filter.$or = [
        { title: { $regex: s, $options: "i" } },
        { company: { $regex: s, $options: "i" } },
        { location: { $regex: s, $options: "i" } }
      ];
    }

    const allJobs = await Job.find(filter)
      .populate("recruiterId", "name email phone")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    const jobIds = allJobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: "$job", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[String(c._id)] = c.count;
    });

    const result = allJobs.map((j) => ({
      ...j.toObject(),
      applicantsCount: countMap[String(j._id)] || 0
    }));

    res.json(result);
  } catch (e) {
    next(e);
  }
};

// Admin approves a job
export const approveJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = "approved";
    job.approvedBy = req.user.id;
    job.approvedAt = new Date();
    job.rejectionReason = "";
    await job.save();

    // Notify recruiter
    const recruiterRecipient = job.recruiterId?._id || job.recruiterId || job.recruiter;
    if (recruiterRecipient) {
      await Notification.create({
        user: recruiterRecipient,
        title: "Job Approved by Admin",
        message: `Your job posting "${job.title}" at ${job.company} has been approved and is now live for job seekers!`
      });
    }

    // Notify all jobseekers
    const jobseekers = await User.find({ role: "jobseeker" }).select("_id");
    if (jobseekers.length) {
      await Notification.insertMany(
        jobseekers.map((u) => ({
          user: u._id,
          title: "New Job Opening",
          message: `${job.company} posted ${job.title} in ${job.location}. Apply now if it fits your profile!`
        }))
      );
    }

    res.json({ message: "Job approved successfully", job });
  } catch (e) {
    next(e);
  }
};

// Admin rejects a job
export const rejectJob = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = "rejected";
    job.rejectionReason = reason.trim();
    await job.save();

    // Notify recruiter
    const recruiterRecipient = job.recruiterId?._id || job.recruiterId || job.recruiter;
    if (recruiterRecipient) {
      await Notification.create({
        user: recruiterRecipient,
        title: "Job Posting Rejected",
        message: `Your job posting "${job.title}" was rejected by Admin. Reason: ${reason.trim()}`
      });
    }

    res.json({ message: "Job rejected", job });
  } catch (e) {
    next(e);
  }
};

// Admin closes a job
export const closeJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job closed successfully", job });
  } catch (e) {
    next(e);
  }
};

// Admin edits a job
export const updateJob = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.skills === "string") {
      updateData.skills = updateData.skills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof updateData.requirements === "string") {
      updateData.requirements = updateData.requirements.split("\n").map((r) => r.trim()).filter(Boolean);
    }
    if (updateData.jobType) {
      updateData.type = updateData.jobType;
    }

    const job = await Job.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate("recruiterId", "name email");

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job updated successfully", job });
  } catch (e) {
    next(e);
  }
};

// Admin deletes a job
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job removed permanently" });
  } catch (e) {
    next(e);
  }
};

export const applications = async (req, res, next) => {
  try {
    res.json(await Application.find().populate("job", "title company").populate("candidate", "name email").sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
};

export const profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user || user.role !== "admin") return res.status(404).json({ message: "Admin not found" });
    res.json({ user });
  } catch (e) {
    next(e);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, bio } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
    const duplicate = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user.id } });
    if (duplicate) return res.status(409).json({ message: "Email already in use" });
    const user = await User.findByIdAndUpdate(req.user.id, { name, email: email.toLowerCase(), phone, bio }, { new: true, runValidators: true }).select("-password");
    res.json({ message: "Profile updated successfully", user });
  } catch (e) {
    next(e);
  }
};

export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) return res.status(400).json({ message: "Enter current password and a new password of at least 6 characters" });
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") return res.status(404).json({ message: "Admin not found" });
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (e) {
    next(e);
  }
};

const htmlMcqs = [
  ["What does HTML stand for?", ["A) Hyper Text Markup Language", "B) High Text Machine Language", "C) Hyperlink Text Management Language", "D) Home Tool Markup Language"]],
  ["Which tag is used to create a paragraph?", ["A) <para>", "B) <p>", "C) <paragraph>", "D) <text>"]],
  ["Which tag is used for the largest heading?", ["A) <h6>", "B) <head>", "C) <h1>", "D) <heading>"]],
  ["Which tag is used to create a hyperlink?", ["A) <link>", "B) <a>", "C) <href>", "D) <url>"]],
  ["Which attribute specifies the destination of a hyperlink?", ["A) src", "B) link", "C) href", "D) url"]],
  ["Which tag is used to insert an image?", ["A) <image>", "B) <img>", "C) <picture>", "D) <src>"]],
  ["Which attribute is used to specify the image path?", ["A) href", "B) src", "C) path", "D) link"]],
  ["Which tag is used to create an unordered list?", ["A) <ol>", "B) <list>", "C) <ul>", "D) <li>"]],
  ["Which tag represents a list item?", ["A) <item>", "B) <li>", "C) <list>", "D) <ul>"]],
  ["Which tag creates an ordered list?", ["A) <ul>", "B) <ol>", "C) <li>", "D) <order>"]],
  ["Which tag is used to create a table row?", ["A) <td>", "B) <th>", "C) <tr>", "D) <row>"]],
  ["Which tag is used for a table data cell?", ["A) <data>", "B) <td>", "C) <cell>", "D) <tr>"]],
  ["Which tag is used to create a form?", ["A) <input>", "B) <form>", "C) <fieldset>", "D) <submit>"]],
  ["Which HTML element is used to accept user input?", ["A) <input>", "B) <form>", "C) <data>", "D) <user>"]],
  ["Which attribute provides alternative text for an image?", ["A) title", "B) alt", "C) text", "D) description"]],
  ["Which tag is used to create a line break?", ["A) <break>", "B) <lb>", "C) <br>", "D) <newline>"]],
  ["Which tag defines the title shown in the browser tab?", ["A) <head>", "B) <title>", "C) <header>", "D) <name>"]],
  ["Which tag contains the visible content of an HTML page?", ["A) <head>", "B) <html>", "C) <body>", "D) <main>"]],
  ["Which declaration defines an HTML5 document?", ["A) <html5>", "B) <!DOCTYPE html>", "C) <DOCTYPE5>", "D) <!HTML5>"]],
  ["Which tag is used to make text bold/strong in HTML?", ["A) <bold>", "B) <b>", "C) <strong>", "D) Both B and C"]]
];

const htmlAnswers = ["A", "B", "C", "B", "C", "B", "B", "C", "B", "B", "C", "B", "B", "A", "B", "C", "B", "C", "B", "D"];

export const createHtmlFundamentalsTest = async (req, res, next) => {
  try {
    const existing = await Test.findOne({ title: "HTML Fundamentals MCQ Test" });
    if (existing) return res.json({ message: "HTML Fundamentals MCQ Test already exists", test: existing, created: false });

    const questions = await InterviewQuestion.insertMany(htmlMcqs.map(([question, options], index) => ({
      question,
      options,
      correctAnswer: options.find((option) => option.startsWith(`${htmlAnswers[index]})`)),
      answerGuide: `Correct answer: ${htmlAnswers[index]}`,
      category: "HTML",
      difficulty: "Easy",
      status: "published"
    })));
    const test = await Test.create({
      title: "HTML Fundamentals MCQ Test",
      description: "A 20-question multiple-choice assessment covering core HTML fundamentals.",
      durationMinutes: 20,
      questions: questions.map((question) => question._id),
      status: "published"
    });
    res.status(201).json({ message: "HTML Fundamentals MCQ Test created with 20 questions", test, created: true });
  } catch (error) {
    next(error);
  }
};
