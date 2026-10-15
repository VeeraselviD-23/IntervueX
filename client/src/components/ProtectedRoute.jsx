import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const normalizeRole = (role) => (role === "user" ? "jobseeker" : role);

const getDashboardPath = (role) => {
  const normalizedRole = normalizeRole(role);
  if (normalizedRole === "admin") return "/admin/dashboard";
  if (normalizedRole === "recruiter") return "/recruiter/dashboard";
  return "/user/dashboard";
};

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="page"><main className="section"><div className="container"><h2>Loading...</h2></div></main></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = normalizeRole(user.role);

  if (roles && !roles.includes(currentRole)) {
    return <Navigate to={getDashboardPath(currentRole)} replace />;
  }

  return children;
}
