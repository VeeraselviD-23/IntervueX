import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import BackButton from "../../components/BackButton";
import { Link } from "react-router-dom";
import { getSavedJobs, unsaveJob } from "../../services/userService";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadSaved = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getSavedJobs();
      setSavedJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleUnsave = async (jobId, title) => {
    try {
      await unsaveJob(jobId);
      setActionMessage(`"${title}" removed from saved jobs.`);
      setTimeout(() => setActionMessage(""), 3000);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove job");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Saved Jobs</h1>
            <p>Review and apply to vacancies you have bookmarked for later.</p>
          </div>
          <Link to="/jobs" className="button button-primary">
            Explore Jobs
          </Link>
        </div>

        {actionMessage && <div className="success-message" style={{ marginBottom: "20px" }}>{actionMessage}</div>}
        {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}

        {loading && <p>Loading your saved jobs...</p>}

        {!loading && savedJobs.length === 0 && (
          <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
            <i className="bi bi-bookmark" style={{ fontSize: "40px", display: "block", marginBottom: "12px" }} aria-hidden="true"></i>
            <h3>No Saved Jobs Yet</h3>
            <p style={{ color: "#6b7280", maxWidth: "450px", margin: "8px auto 20px" }}>
              While browsing jobs, click the "Save Job" button to bookmark open roles you want to apply to later.
            </p>
            <Link to="/jobs" className="button button-primary">
              Find Jobs Now
            </Link>
          </div>
        )}

        <div className="job-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
          {!loading && savedJobs.map((job) => (
            <article className="card job-card" key={job._id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <span className="badge" style={{ fontSize: "11px", marginBottom: "6px" }}>
                    {job.jobType || job.type || "Full Time"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUnsave(job._id, job.title)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#e53935",
                      padding: 0
                    }}
                    title="Remove from saved"
                  >
                    Saved
                  </button>
                </div>

                <h3 style={{ margin: "4px 0" }}>{job.title}</h3>
                <div className="job-company">{job.company}</div>

                <div className="job-meta" style={{ margin: "12px 0", fontSize: "13px", display: "grid", gap: "4px" }}>
                  <div>{job.location}</div>
                  <div>{job.salary || "Not disclosed"}</div>
                  <div>{job.experience || "Fresher / Any"}</div>
                  {job.deadline && (
                    <div style={{ color: "#d97706" }}>
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="job-skills" style={{ fontSize: "12px", color: "#4b5563", marginBottom: "14px" }}>
                    Skills: {job.skills.slice(0, 4).join(", ")}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                <Link
                  className="button button-primary"
                  to={`/jobs/${job._id}/apply`}
                  style={{ flex: 1, textAlign: "center", padding: "8px 12px", fontSize: "13px" }}
                >
                  Apply Now
                </Link>
                <Link
                  className="button button-outline"
                  to={`/jobs/${job._id}`}
                  style={{ flex: 1, textAlign: "center", padding: "8px 12px", fontSize: "13px" }}
                >
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

export default SavedJobs;
