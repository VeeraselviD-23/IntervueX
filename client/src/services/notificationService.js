import api from "./api";
export const getNotifications=()=>api.get("/notifications");
export const getNotificationById=(id)=>api.get(`/notifications/${id}`);
export const createNotification=(data)=>api.post("/notifications",data);
export const markNotificationRead=(id)=>api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead=()=>api.put("/notifications/read-all");
export const deleteNotification=(id)=>api.delete(`/notifications/${id}`);
