import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: String,
  coverLetter: String,
  status: {
    type: String,
    // "submitted" remains accepted for records created before the streamlined flow.
    enum: ["applied", "submitted", "review", "shortlisted", "interview", "rejected", "hired"],
    default: "applied"
  },
  interview: {
    scheduledAt: Date,
    interviewType: { type: String, default: "Online" },
    interviewLink: String,
    notes: String
  }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
