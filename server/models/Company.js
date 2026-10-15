import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  industry: String,
  email: String,
  website: String,
  location: String,
  description: String,
  logo: String,
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, sparse: true }
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
