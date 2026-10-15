import api from "./api";
export const getApplications=(params={})=>api.get("/applications",{params});
export const getMyApplications=()=>api.get("/applications/my");
export const getUserDashboard=()=>api.get("/applications/dashboard");
export const getApplicationById=(id)=>api.get(`/applications/${id}`);
export const applyJob=(data)=>api.post("/applications",data);
export const updateApplication=(id,data)=>api.put(`/applications/${id}`,data);
export const withdrawApplication=(id)=>api.delete(`/applications/${id}`);
export const getApplicants=(jobId)=>api.get(`/applications/job/${jobId}`);
