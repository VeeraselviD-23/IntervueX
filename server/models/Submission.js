import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: "CodingQuestion" },
  questionTitle: { type: String, default: "Code practice" },
  language: { type: String, required: true, trim: true },
  code: { type: String, required: true },
  status: { type: String, enum: ["submitted", "accepted", "failed"], default: "submitted" },
  output: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
