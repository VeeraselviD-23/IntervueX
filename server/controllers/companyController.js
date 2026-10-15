import Company from "../models/Company.js";

export async function listCompanys(req, res, next) {
  try {
    const items = await Company.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { next(error); }
}

export async function getCompany(req, res, next) {
  try {
    const item = await Company.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Company not found" });
    res.json(item);
  } catch (error) { next(error); }
}

export async function createCompany(req, res, next) {
  try {
    const item = await Company.create(req.body);
    res.status(201).json(item);
  } catch (error) { next(error); }
}

export async function updateCompany(req, res, next) {
  try {
    const item = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(item);
  } catch (error) { next(error); }
}

export async function deleteCompany(req, res, next) {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company deleted" });
  } catch (error) { next(error); }
}

export async function myCompany(req, res, next) {
  try {
    res.json(await Company.findOne({ recruiter: req.user.id }));
  } catch (error) { next(error); }
}

export async function saveMyCompany(req, res, next) {
  try {
    const item = await Company.findOneAndUpdate(
      { recruiter: req.user.id },
      { ...req.body, recruiter: req.user.id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(item);
  } catch (error) { next(error); }
}
