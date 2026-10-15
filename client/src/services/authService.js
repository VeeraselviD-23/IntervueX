import api from "./api";
export const registerUser=(data)=>api.post("/auth/register",data);
export const loginUser=(data)=>api.post("/auth/login",data);
export const getCurrentUser=()=>api.get("/auth/me");
export const forgotPassword=(data)=>api.post("/auth/forgot-password",data);
export const changePassword=(data)=>api.post("/auth/change-password",data);
