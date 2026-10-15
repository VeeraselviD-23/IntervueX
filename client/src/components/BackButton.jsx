import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BackButton({ variant = "global" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const navbarPage = location.pathname === "/"
    || ["/about", "/contact", "/jobs", "/interview", "/compiler", "/tests", "/user/notifications"].some((path) => location.pathname.startsWith(path));
  const sidebarPage = ["/user/", "/recruiter/", "/admin/"].some((path) => location.pathname.startsWith(path));

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  if (variant === "global" && (navbarPage || sidebarPage)) return null;

  return (
    <button
      className={variant === "navbar" ? "navbar-back-button" : variant === "sidebar" ? "sidebar-back-button" : "global-back-button"}
      type="button"
      onClick={handleBack}
      aria-label={`Go back from ${location.pathname}`}
      title="Go back"
    >
      <i className="bi bi-arrow-left" aria-hidden="true"></i>
    </button>
  );
}

export default BackButton;
