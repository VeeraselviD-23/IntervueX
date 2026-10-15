import React from "react";
import { Link } from "react-router-dom";

function JobCard({
  id,
  title = "Frontend Developer",
  company = "TechNova",
  location = "Chennai",
  type,
  jobType,
  salary = "Not disclosed",
  skills = []
}) {
  const companyName = typeof company === "object" ? company?.name || "Company" : company;
  const displayType = jobType || type || "Full Time";

  return (
    <article className="card job-card">
      <h3>{title}</h3>
      <div className="job-company">{companyName}</div>
      <div className="job-meta">
        <div>Location: {location}</div>
        <div>Type: {displayType}</div>
        <div>Salary: {salary}</div>
      </div>
      {skills.length > 0 && <div className="job-skills">Skills: {skills.join(", ")}</div>}
      <Link className="button button-outline" to={id ? `/jobs/${id}` : "/jobs"}>
        View Details
      </Link>
    </article>
  );
}

export default JobCard;

