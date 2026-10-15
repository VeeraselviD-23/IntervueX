import api from "./api";

export const getJobs = (params = {}) => api.get("/jobs", { params });
export const getJobById = (id) => api.get(`/jobs/${id}`);
export const searchJobs = (keyword, filters = {}) => api.get("/jobs/search", { params: { keyword, ...filters } });
export const createJob = (data) => api.post("/jobs", data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const closeJob = (id) => api.put(`/jobs/${id}/close`);
export const getMyJobs = () => api.get("/jobs/recruiter/my-jobs");

