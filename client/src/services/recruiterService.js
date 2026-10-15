import api from "./api";

export const getRecruiters = () => api.get("/recruiter");
export const getRecruiterById = (id) => api.get(`/recruiter/${id}`);
export const createRecruiter = (data) => api.post("/recruiter", data);
export const updateRecruiter = (id, data) => api.put(`/recruiter/${id}`, data);
export const deleteRecruiter = (id) => api.delete(`/recruiter/${id}`);
export const getRecruiterProfile = () => api.get("/recruiter/profile");
export const getRecruiterDashboard = () => api.get("/recruiter/dashboard");
export const updateRecruiterProfile = (data) => api.put("/recruiter/profile", data);
export const getRecruiterApplicants = (jobId) => api.get(`/recruiter/jobs/${jobId}/applicants`);
export const getAllApplicants = (params = {}) => api.get("/recruiter/applicants", { params });
export const getApplicantById = (id) => api.get(`/recruiter/applicants/${id}`);
export const updateApplicantStatus = (id, data) => api.put(`/recruiter/applicants/${id}`, data);
export const scheduleInterview = (id, data) => api.put(`/recruiter/applicants/${id}/interview`, data);

