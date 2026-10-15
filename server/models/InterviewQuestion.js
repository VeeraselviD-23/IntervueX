import mongoose from "mongoose";

const schema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [String],
  answerGuide: String,
  category: String,
  difficulty: String,
  correctAnswer: String,
  status: { type: String, default: "published" }
}, { timestamps: true });

export default mongoose.model("InterviewQuestion", schema);
