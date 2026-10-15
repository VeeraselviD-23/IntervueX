import api from "./api";
export const getInterviewCategories=()=>api.get("/interview/categories");
export const getInterviewQuestions=(params={})=>api.get("/interview/questions",{params});
export const getQuestionById=(id)=>api.get(`/interview/questions/${id}`);
export const createInterviewQuestion=(data)=>api.post("/interview",data);
export const updateInterviewQuestion=(id,data)=>api.put(`/interview/${id}`,data);
export const deleteInterviewQuestion=(id)=>api.delete(`/interview/${id}`);
