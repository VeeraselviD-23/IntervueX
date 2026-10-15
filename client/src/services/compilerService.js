import api from "./api";
export const getCodingQuestions=(params={})=>api.get("/compiler/questions",{params});
export const getCodingQuestionById=(id)=>api.get(`/compiler/questions/${id}`);
export const createCodingQuestion=(data)=>api.post("/compiler",data);
export const updateCodingQuestion=(id,data)=>api.put(`/compiler/${id}`,data);
export const deleteCodingQuestion=(id)=>api.delete(`/compiler/${id}`);
export const runCode=(data)=>api.post("/compiler/run",data);
export const submitCode=(data)=>api.post("/compiler/submit",data);
export const getSubmissionHistory=()=>api.get("/compiler/submissions");
