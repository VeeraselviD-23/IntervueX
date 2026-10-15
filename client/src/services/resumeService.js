import api from "./api";
export const getResume=()=>api.get("/resume");
export const getResumeById=(id)=>api.get(`/resume/${id}`);
export const uploadResume=(data)=>api.post("/resume",data);
export const updateResume=(id,data)=>api.put(`/resume/${id}`,data);
export const deleteResume=(id)=>api.delete(`/resume/${id}`);
