import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  difficulty: String,
  examples: [{ input: String, output: String }],
  status: { type: String, default: "published" }
}, { timestamps: true });

export default mongoose.model("CodingQuestion", schema);
