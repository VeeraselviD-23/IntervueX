import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { getRecruiterDashboard } from "../../services/recruiterService";
import { Link } from "react-router-dom";

function RecruiterDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getRecruiterDashboard()
      .then(({ data }) => setSummary(data))
      .catch(() => setSummary(null));
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return <span className="status status-success">Live</span>;
      case "pending":
        return <span className="status status-warning" style={{ background: "#fef3c7", color: "#92400e" }}>Pending</span>;
      case "rejected":
        return <span className="status status-danger">Rejected</span>;
      case "closed":
        return <span className="status" style={{ background: "#e5e7eb", color: "#4b5563" }}>Closed</span>;
      case "draft":
        return <span className="status" style={{ background: "#e0f2fe", color: "#0369a1" }}>Draft</span>;
      default:
        return <span className="status">{status}</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar type="recruiter" />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Recruiter Dashboard</h1>
            <p>Manage jobs, review candidates, schedule interviews, and track recruitment progress.</p>
          </div>
          <Link to="/recruiter/jobs/post" className="button button-primary">
            + Post Job
          </Link>
        </div>

        <div className="dashboard-cards" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))" }}>
          <div className="dashboard-card">
            <span>Live Jobs</span>
            <strong>{summary?.activeJobs ?? "—"}</strong>
          </div>
          <div className="dashboard-card">
            <span>Pending Review</span>
            <strong style={{ color: "#d97706" }}>{summary?.pendingJobs ?? "—"}</strong>
          </div>
          <div className="dashboard-card">
            <span>Total Applicants</span>
            <strong>{summary?.totalApplicants ?? "—"}</strong>
          </div>
          <div className="dashboard-card">
            <span>Shortlisted</span>
            <strong style={{ color: "#059669" }}>{summary?.shortlisted ?? "—"}</strong>
          </div>
          <div className="dashboard-card">
            <span>Interviews</span>
            <strong style={{ color: "#2563eb" }}>{summary?.interviews ?? "—"}</strong>
          </div>
        </div>

        <div className="dashboard-section-heading">
          <div>
            <span className="eyebrow">Hiring pipeline</span>
            <h2>Recent applicants</h2>
          </div>
          <Link to="/recruiter/applicants">View all applicants</Link>
        </div>

        <div className="activity-list dashboard-panel card">
          {(summary?.recentApplicants || []).length === 0 && (
            <p style={{ color: "#6b7280", margin: "10px 0" }}>No applicants have arrived yet.</p>
          )}
          {summary?.recentApplicants?.map((application) => (
            <div className="activity-row" key={application._id}>
              <span className="avatar avatar-small">
                {application.candidate?.name?.charAt(0) || "?"}
              </span>
              <div>
                <strong>{application.candidate?.name || "Candidate"}</strong>
                <small>{application.job?.title || "Application"}</small>
              </div>
              <span className={`status status-${application.status === "shortlisted" || application.status === "hired" ? "success" : application.status === "rejected" ? "danger" : application.status === "interview" ? "info" : "warning"}`}>
                {application.status}
              </span>
            </div>
          ))}
        </div>

        <div className="dashboard-section-heading">
          <div>
            <span className="eyebrow">Your workspace</span>
            <h2>Recent job posts</h2>
          </div>
          <Link to="/recruiter/jobs">Manage jobs</Link>
        </div>

        <div className="mini-grid">
          {(summary?.recentJobs || []).length === 0 && (
            <p style={{ color: "#6b7280" }}>No jobs created yet.</p>
          )}
          {summary?.recentJobs?.map((job) => (
            <div className="mini-card" key={job._id}>
              {getStatusBadge(job.status)}
              <strong style={{ marginTop: "6px", display: "block" }}>{job.title}</strong>
              <small>Posted {new Date(job.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;
