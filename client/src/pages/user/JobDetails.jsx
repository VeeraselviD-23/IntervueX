import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import BackButton from "../../components/BackButton";
import { getJobById } from "../../services/jobService";
import { getSavedJobs, saveJob, unsaveJob } from "../../services/userService";

function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getJobById(jobId)
      .then(({ data }) => setJob(data))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load this job"));

    // Check if job is already saved by user
    getSavedJobs()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          const found = data.some((saved) => (saved._id || saved) === jobId);
          setIsSaved(found);
        }
      })
      .catch(() => {
        // User may be guest or unauthorized; ignore
      });
  }, [jobId]);

  const handleToggleSave = async () => {
    setSaveLoading(true);
    setActionMessage("");
    try {
      if (isSaved) {
        await unsaveJob(jobId);
        setIsSaved(false);
        setActionMessage("Job removed from saved list.");
      } else {
        await saveJob(jobId);
        setIsSaved(true);
        setActionMessage("Job saved successfully! Find it in Saved Jobs.");
      }
      setTimeout(() => setActionMessage(""), 3500);
    } catch (err) {
      setActionMessage(err.response?.data?.message || "Failed to update saved job");
      setTimeout(() => setActionMessage(""), 3500);
    } finally {
      setSaveLoading(false);
    }
  };

  if (error) return <div className="page"><Navbar /><main className="section"><div className="container"><p className="error-message">{error}</p></div></main></div>;
  if (!job) return <div className="page"><Navbar /><main className="section"><div className="container"><p>Loading job details...</p></div></main></div>;

  return (
    <div className="page">
      <Navbar />
      <main className="section">
        <div className="container">
          <div style={{ marginBottom: "16px" }}>
            <Link to="/jobs" style={{ textDecoration: "none", color: "#4f46e5", fontWeight: "600", fontSize: "14px" }}>
              ← Back to Job Search
            </Link>
          </div>

          <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
              <span className="badge" style={{ fontSize: "13px" }}>{job.jobType || job.type || "Full Time"}</span>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "recently"}
              </span>
            </div>

            <h1 style={{ marginTop: "12px", marginBottom: "6px" }}>{job.title}</h1>
            <h3 className="job-company" style={{ fontSize: "18px", color: "#4f46e5", margin: "0 0 14px" }}>
              {job.company?.name || job.company || "Company not specified"}
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#4b5563", fontSize: "14px", marginBottom: "14px" }}>
              <span><i className="bi bi-geo-alt me-2" aria-hidden="true"></i><strong>Location:</strong> {job.location || "Not specified"}</span>
              <span><i className="bi bi-briefcase me-2" aria-hidden="true"></i><strong>Experience:</strong> {job.experience || "Not specified"}</span>
              <span><i className="bi bi-cash-stack me-2" aria-hidden="true"></i><strong>Salary:</strong> {job.salary || "Not specified"}</span>
            </div>

            {job.deadline && (
              <p style={{ color: "#d97706", fontSize: "14px", fontWeight: "600", background: "#fffbeb", padding: "8px 12px", borderRadius: "6px" }}>
                ⏳ <strong>Application Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}
              </p>
            )}

            {actionMessage && (
              <div className="success-message" style={{ margin: "14px 0", padding: "10px" }}>
                {actionMessage}
              </div>
            )}

            {/* Action buttons: Apply Now & Save Job */}
            <div style={{ display: "flex", gap: "12px", margin: "20px 0 24px" }}>
              <Link className="button button-primary" to={`/jobs/${job._id}/apply`} style={{ flex: 1, textAlign: "center" }}>
                Apply Now
              </Link>
              <button
                type="button"
                className="button button-outline"
                onClick={handleToggleSave}
                disabled={saveLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  borderColor: isSaved ? "#e53935" : "#d1d5db",
                  color: isSaved ? "#e53935" : "#374151"
                }}
              >
                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>

            <hr />

            <h3>Job Description</h3>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#374151" }}>
              {job.description || "No detailed description provided."}
            </p>

            {job.requirements && job.requirements.length > 0 && (
              <>
                <h3 style={{ marginTop: "24px" }}>Requirements & Qualifications</h3>
                <ul className="list">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </>
            )}

            <h3 style={{ marginTop: "24px" }}>Required Skills</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
              {(job.skills || []).map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#f3f4f6",
                    color: "#374151",
                    padding: "4px 10px",
                    borderRadius: "16px",
                    fontSize: "13px",
                    fontWeight: "500"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;
