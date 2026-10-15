import mongoose from "mongoose";

const schema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  score: Number,
  total: Number,
  percentage: Number
}, { timestamps: true });

export default mongoose.model("TestResult", schema);
