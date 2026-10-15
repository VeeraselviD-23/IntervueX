import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { getMyJobs, closeJob, deleteJob } from "../../services/jobService";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRejection, setSelectedRejection] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const loadJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMyJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your posted jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleCloseJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to close "${title}"? Jobseekers will no longer be able to apply.`)) return;
    try {
      await closeJob(jobId);
      setActionMessage(`"${title}" has been closed.`);
      setTimeout(() => setActionMessage(""), 3000);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to close job");
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? All applicant records for this job will also be removed.`)) return;
    try {
      await deleteJob(jobId);
      setActionMessage(`"${title}" was deleted.`);
      setTimeout(() => setActionMessage(""), 3000);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  // Compute metrics
  const totalCount = jobs.length;
  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const activeCount = jobs.filter((j) => j.status === "approved" || j.status === "active").length;
  const rejectedCount = jobs.filter((j) => j.status === "rejected").length;
  const closedCount = jobs.filter((j) => j.status === "closed").length;
  const draftCount = jobs.filter((j) => j.status === "draft").length;

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "active"
        ? job.status === "active" || job.status === "approved"
        : job.status === filterStatus;

    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return <span className="status status-success">Live / Approved</span>;
      case "pending":
        return <span className="status status-warning" style={{ background: "#fef3c7", color: "#92400e" }}>Pending Approval</span>;
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
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1>Manage My Jobs</h1>
              <p>Track your posted vacancies, review admin approval status, and manage applicants</p>
            </div>
            <Link to="/recruiter/jobs/post" className="button button-primary" style={{ padding: "10px 20px" }}>
              + Post New Job
            </Link>
          </div>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {actionMessage && <div className="success-message" style={{ marginBottom: "20px" }}>{actionMessage}</div>}
          {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}

          {/* KPI Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "16px",
            marginBottom: "25px"
          }}>
            <div className="card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>Total Jobs</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{totalCount}</div>
            </div>
            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #f59e0b" }}>
              <div style={{ fontSize: "13px", color: "#b45309" }}>Pending Approval</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "#b45309" }}>{pendingCount}</div>
            </div>
            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #10b981" }}>
              <div style={{ fontSize: "13px", color: "#047857" }}>Active / Live</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "#047857" }}>{activeCount}</div>
            </div>
            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontSize: "13px", color: "#b91c1c" }}>Rejected</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "#b91c1c" }}>{rejectedCount}</div>
            </div>
            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #6b7280" }}>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>Closed / Draft</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{closedCount + draftCount}</div>
            </div>
          </div>

          {/* Search & Filter bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "14px",
            marginBottom: "20px"
          }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "all", label: `All (${totalCount})` },
                { id: "pending", label: `Pending (${pendingCount})` },
                { id: "active", label: `Live (${activeCount})` },
                { id: "rejected", label: `Rejected (${rejectedCount})` },
                { id: "closed", label: `Closed (${closedCount})` },
                { id: "draft", label: `Draft (${draftCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "20px",
                    border: "1px solid #d1d5db",
                    background: filterStatus === tab.id ? "#111827" : "#fff",
                    color: filterStatus === tab.id ? "#fff" : "#374151",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search by title or location..."
              className="form-control"
              style={{ width: "260px", padding: "8px 12px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Jobs Table */}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company & Location</th>
                  <th>Type & Salary</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>Loading your jobs...</td>
                  </tr>
                )}

                {!loading && filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "35px" }}>
                      <p style={{ margin: "0 0 10px" }}>No jobs found in this category.</p>
                      <Link to="/recruiter/jobs/post" className="button button-outline">Post your first job</Link>
                    </td>
                  </tr>
                )}

                {!loading && filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <strong>{job.title}</strong>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div>{job.company}</div>
                      <small style={{ color: "#6b7280" }}>{job.location}</small>
                    </td>
                    <td>
                      <div>{job.jobType || job.type || "Full Time"}</div>
                      <small style={{ color: "#059669", fontWeight: "600" }}>{job.salary || "Not disclosed"}</small>
                    </td>
                    <td>
                      <Link
                        to={`/recruiter/applicants?jobId=${job._id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: "bold",
                          color: "#2563eb",
                          textDecoration: "underline"
                        }}
                      >
                        {job.applicantsCount || 0} Applicants
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                        {getStatusBadge(job.status)}
                        {job.status === "rejected" && (
                          <button
                            type="button"
                            onClick={() => setSelectedRejection(job)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              fontSize: "12px",
                              cursor: "pointer",
                              textDecoration: "underline",
                              padding: 0
                            }}
                          >
                            View Reason
                          </button>
                        )}
                      </div>
                    </td>
                    <td>
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : "Open"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="button button-outline"
                          style={{ padding: "5px 10px", fontSize: "12px" }}
                        >
                          Edit
                        </Link>

                        {(job.status === "approved" || job.status === "active") && (
                          <button
                            type="button"
                            onClick={() => handleCloseJob(job._id, job.title)}
                            className="button"
                            style={{ padding: "5px 10px", fontSize: "12px", background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }}
                            title="Close this job when positions are filled"
                          >
                            Close
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "4px 8px"
                          }}
                          title="Delete Job"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Rejection Reason Modal */}
      {selectedRejection && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: "480px", width: "90%", padding: "24px" }}>
            <h3 style={{ color: "#b91c1c", marginBottom: "12px" }}>Admin Rejection Notice</h3>
            <p>Your job posting <strong>"{selectedRejection.title}"</strong> was not approved by the admin team.</p>
            <div style={{
              background: "#fef2f2",
              borderLeft: "4px solid #ef4444",
              padding: "12px 16px",
              margin: "16px 0",
              borderRadius: "4px",
              color: "#991b1b"
            }}>
              <strong>Reason Provided:</strong>
              <p style={{ margin: "6px 0 0" }}>{selectedRejection.rejectionReason || "No specific reason provided."}</p>
            </div>
            <p style={{ fontSize: "13px", color: "#6b7280" }}>
              You can click <strong>Edit</strong> to update the job details and re-submit it for admin approval.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
              <button
                className="button button-outline"
                onClick={() => setSelectedRejection(null)}
              >
                Close
              </button>
              <Link
                to={`/recruiter/jobs/${selectedRejection._id}/edit`}
                className="button button-primary"
              >
                Edit & Re-submit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;
