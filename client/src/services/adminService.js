import api from "./api";

export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminUsers = () => api.get("/admin/users");
export const getAdminRecruiters = () => api.get("/admin/recruiters");

// Admin Job Management APIs
export const getAdminJobs = (params = {}) => api.get("/admin/jobs", { params });
export const approveAdminJob = (id) => api.put(`/admin/jobs/${id}/approve`);
export const rejectAdminJob = (id, reason) => api.put(`/admin/jobs/${id}/reject`, { reason });
export const closeAdminJob = (id) => api.put(`/admin/jobs/${id}/close`);
export const updateAdminJob = (id, data) => api.put(`/admin/jobs/${id}`, data);
export const deleteAdminJob = (id) => api.delete(`/admin/jobs/${id}`);

export const getAdminApplications = () => api.get("/admin/applications");
export const getAdminProfile = () => api.get("/admin/profile");
export const updateAdminProfile = (data) => api.put("/admin/profile", data);
export const changeAdminPassword = (data) => api.put("/admin/change-password", data);
export const createHtmlFundamentalsTest = () => api.post("/admin/tests/html-fundamentals");
