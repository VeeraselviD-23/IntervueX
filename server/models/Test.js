import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  durationMinutes: Number,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "InterviewQuestion" }],
  status: { type: String, default: "published" }
}, { timestamps: true });

export default mongoose.model("Test", schema);
