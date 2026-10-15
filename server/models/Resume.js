import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: String,
  fileName: String
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
