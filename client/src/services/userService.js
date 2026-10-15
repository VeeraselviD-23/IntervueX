import api from "./api";

export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);
export const getSavedJobs = () => api.get("/users/saved-jobs");
export const saveJob = (jobId) => api.post(`/users/saved-jobs/${jobId}`);
export const unsaveJob = (jobId) => api.delete(`/users/saved-jobs/${jobId}`);

