import api from "./api";
export const getPracticeTests=()=>api.get("/tests");
export const getTestById=(id)=>api.get(`/tests/${id}`);
export const createTest=(data)=>api.post("/tests",data);
export const updateTest=(id,data)=>api.put(`/tests/${id}`,data);
export const deleteTest=(id)=>api.delete(`/tests/${id}`);
export const startTest=(id)=>api.post(`/tests/${id}/start`);
export const submitTest=(id,data)=>api.post(`/tests/${id}/submit`,data);
export const getTestResult=(id)=>api.get(`/tests/results/${id}`);
