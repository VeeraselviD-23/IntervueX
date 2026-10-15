import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  jobType: { type: String, default: "Full Time" },
  type: { type: String }, // maintained for backward compatibility
  salary: { type: String, default: "Not disclosed" },
  experience: { type: String, default: "Fresher / Any" },
  skills: [{ type: String, trim: true }],
  description: { type: String, required: true },
  requirements: [{ type: String, trim: true }],
  deadline: { type: Date },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // alias/synced
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "active", "rejected", "closed"],
    default: "pending"
  },
  rejectionReason: { type: String, default: "" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date }
}, { timestamps: true });

// Ensure type is synced with jobType and recruiter with recruiterId
jobSchema.pre("save", function (next) {
  if (this.jobType && !this.type) {
    this.type = this.jobType;
  } else if (this.type && !this.jobType) {
    this.jobType = this.type;
  }
  if (this.recruiterId && !this.recruiter) {
    this.recruiter = this.recruiterId;
  } else if (this.recruiter && !this.recruiterId) {
    this.recruiterId = this.recruiter;
  }
  next();
});

export default mongoose.model("Job", jobSchema);
