import Notification from "../models/Notification.js";

export async function createNotification({ user, title, message }) {
  return Notification.create({ user, title, message });
}
