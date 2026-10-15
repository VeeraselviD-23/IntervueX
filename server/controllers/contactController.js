import ContactMessage from "../models/ContactMessage.js";

export async function createContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;
    if (![name, email, subject, message].every((value) => typeof value === "string" && value.trim())) {
      return res.status(400).json({ message: "Name, email, subject, and message are required" });
    }
    const item = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json({ message: "Your message has been sent successfully", id: item._id });
  } catch (error) {
    next(error);
  }
}
