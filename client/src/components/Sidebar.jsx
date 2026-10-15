import React from "react";
import { Link } from "react-router-dom";
import BackButton from "./BackButton";

function Sidebar({ type = "user" }) {
  const userLinks = [
    ["/user/dashboard", "Dashboard"],
    ["/user/profile", "Profile"],
    ["/user/resume", "Resume"],
    ["/jobs", "Find Jobs"],
    ["/user/saved-jobs", "Saved Jobs"],
    ["/user/applications", "My Applications"],
    ["/user/interviews", "Interviews"],
    ["/interview", "Interview Preparation"],
    ["/compiler", "Coding Practice"],
    ["/tests", "Tests & Assessments"],
    ["/user/notifications", "Notifications"]
  ];

  const recruiterLinks = [
    ["/recruiter/dashboard", "Overview"],
    ["/recruiter/company", "Company Profile"],
    ["/recruiter/jobs/post", "Post Job"],
    ["/recruiter/jobs", "My Jobs"],
    ["/recruiter/applicants", "Applicants & Interviews"],
    ["/recruiter/notifications", "Notifications"]
  ];

  const adminLinks = [
    ["/admin/dashboard", "Overview"],
    ["/admin/users", "Manage Users"],
    ["/admin/recruiters", "Manage Recruiters"],
    ["/admin/jobs", "Manage Jobs"],
    ["/admin/applications", "Applications"],
    ["/admin/interview-questions", "Interview Questions"],
    ["/admin/compiler-questions", "Coding Questions"],
    ["/admin/tests", "Manage Tests"],
    ["/admin/categories", "Categories"],
    ["/admin/reports", "Reports"],
    ["/admin/settings", "Settings"]
  ];

  const links = type === "recruiter" ? recruiterLinks : type === "admin" ? adminLinks : userLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><BackButton variant="sidebar" /><img src="/images/intervuex logo.png" alt="IntervueX logo" /><span>IntervueX</span></div>
      <nav className="sidebar-links">
        {links.map(([path, label]) => (
          <Link key={path} to={path}>{label}</Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
