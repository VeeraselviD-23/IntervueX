import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import {
  getAdminJobs,
  approveAdminJob,
  rejectAdminJob,
  closeAdminJob,
  updateAdminJob,
  deleteAdminJob
} from "../../services/adminService";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Modals state
  const [rejectModalJob, setRejectModalJob] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const [detailsModalJob, setDetailsModalJob] = useState(null);

  const [editModalJob, setEditModalJob] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
    experience: "",
    skills: "",
    description: "",
    requirements: "",
    deadline: ""
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getAdminJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load platform jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  // Admin approves job
  const handleApprove = async (job) => {
    try {
      await approveAdminJob(job._id);
      setActionSuccess(`"${job.title}" has been approved and is now live for jobseekers! Recruiter notified.`);
      setTimeout(() => setActionSuccess(""), 4500);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve job");
    }
  };

  // Open Reject Modal
  const handleOpenReject = (job) => {
    setRejectModalJob(job);
    setRejectReason("");
  };

  // Submit Rejection
  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }

    setRejecting(true);
    try {
      await rejectAdminJob(rejectModalJob._id, rejectReason.trim());
      setActionSuccess(`"${rejectModalJob.title}" was rejected. Recruiter has been notified with the reason.`);
      setTimeout(() => setActionSuccess(""), 4500);
      setRejectModalJob(null);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject job");
    } finally {
      setRejecting(false);
    }
  };

  // Close Job
  const handleClose = async (job) => {
    if (!window.confirm(`Are you sure you want to close "${job.title}"? Jobseekers will no longer be able to apply.`)) return;
    try {
      await closeAdminJob(job._id);
      setActionSuccess(`"${job.title}" is now closed.`);
      setTimeout(() => setActionSuccess(""), 3500);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to close job");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (job) => {
    setEditModalJob(job);
    setEditForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      jobType: job.jobType || job.type || "Full Time",
      salary: job.salary || "",
      experience: job.experience || "",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
      description: job.description || "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
      deadline: job.deadline ? new Date(job.deadline).toISOString().split("T")[0] : ""
    });
  };

  // Save Admin Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await updateAdminJob(editModalJob._id, {
        title: editForm.title.trim(),
        company: editForm.company.trim(),
        location: editForm.location.trim(),
        jobType: editForm.jobType,
        salary: editForm.salary.trim(),
        experience: editForm.experience.trim(),
        skills: editForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        description: editForm.description.trim(),
        requirements: editForm.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
        deadline: editForm.deadline || null
      });
      setActionSuccess(`Job "${editForm.title}" updated successfully.`);
      setTimeout(() => setActionSuccess(""), 3500);
      setEditModalJob(null);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save job changes");
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Job
  const handleDelete = async (job) => {
    if (!window.confirm(`Permanently remove "${job.title}" and all its candidate applications? This action cannot be undone.`)) return;
    try {
      await deleteAdminJob(job._id);
      setActionSuccess(`"${job.title}" deleted.`);
      setTimeout(() => setActionSuccess(""), 3500);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete job");
    }
  };

  // Metrics
  const totalCount = jobs.length;
  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const approvedCount = jobs.filter((j) => j.status === "approved" || j.status === "active").length;
  const rejectedCount = jobs.filter((j) => j.status === "rejected").length;
  const closedCount = jobs.filter((j) => j.status === "closed").length;

  // Filter & Search
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? job.status === "active" || job.status === "approved"
        : job.status === statusFilter;

    const recruiterName = job.recruiterId?.name || "";
    const recruiterEmail = job.recruiterId?.email || "";
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recruiterEmail.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
      case "active":
        return <span className="status status-success">Approved / Live</span>;
      case "pending":
        return (
          <span className="status status-warning" style={{ background: "#fef3c7", color: "#92400e", fontWeight: "bold" }}>
            ⏳ Pending Review
          </span>
        );
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
          <h1>Admin Job Management</h1>
          <p>Review recruiter job postings, approve or reject listings, edit details, and control platform vacancies</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {actionSuccess && <div className="success-message" style={{ marginBottom: "20px" }}>{actionSuccess}</div>}
          {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}

          {/* Admin KPI Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
            gap: "16px",
            marginBottom: "25px"
          }}>
            <div className="card" style={{ padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>Total Platform Jobs</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>{totalCount}</div>
            </div>

            <div
              className="card"
              style={{
                padding: "16px",
                textAlign: "center",
                borderLeft: "4px solid #f59e0b",
                background: pendingCount > 0 ? "#fffbeb" : "#fff",
                cursor: "pointer"
              }}
              onClick={() => setStatusFilter("pending")}
            >
              <div style={{ fontSize: "13px", color: "#b45309", fontWeight: "bold" }}>
                ⏳ Pending Review {pendingCount > 0 && "(!)"}
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "#b45309" }}>
                {pendingCount}
              </div>
            </div>

            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #10b981" }}>
              <div style={{ fontSize: "13px", color: "#047857" }}>Approved / Live</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "#047857" }}>
                {approvedCount}
              </div>
            </div>

            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #ef4444" }}>
              <div style={{ fontSize: "13px", color: "#b91c1c" }}>Rejected</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px", color: "#b91c1c" }}>
                {rejectedCount}
              </div>
            </div>

            <div className="card" style={{ padding: "16px", textAlign: "center", borderLeft: "4px solid #6b7280" }}>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>Closed</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", marginTop: "4px" }}>
                {closedCount}
              </div>
            </div>
          </div>

          {/* Search & Tabs */}
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
                { id: "pending", label: `Pending Review (${pendingCount})` },
                { id: "active", label: `Approved / Live (${approvedCount})` },
                { id: "rejected", label: `Rejected (${rejectedCount})` },
                { id: "closed", label: `Closed (${closedCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "20px",
                    border: "1px solid #d1d5db",
                    background: statusFilter === tab.id ? "#e53935" : "#fff",
                    color: statusFilter === tab.id ? "#fff" : "#374151",
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
              placeholder="Search title, company, recruiter..."
              className="form-control"
              style={{ width: "290px", padding: "8px 12px" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Jobs Table */}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Posting</th>
                  <th>Company & Location</th>
                  <th>Recruiter</th>
                  <th>Posted Date</th>
                  <th>Applicants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>Loading jobs for review...</td>
                  </tr>
                )}

                {!loading && filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "35px" }}>
                      No job postings found matching criteria.
                    </td>
                  </tr>
                )}

                {!loading && filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <strong>{job.title}</strong>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {job.jobType || job.type || "Full Time"} • {job.salary || "Not disclosed"}
                      </div>
                    </td>
                    <td>
                      <div><strong>{job.company}</strong></div>
                      <small style={{ color: "#6b7280" }}>{job.location}</small>
                    </td>
                    <td>
                      <div>{job.recruiterId?.name || "Recruiter"}</div>
                      <small style={{ color: "#6b7280" }}>{job.recruiterId?.email || "-"}</small>
                    </td>
                    <td>
                      <div>{new Date(job.createdAt).toLocaleDateString()}</div>
                      <small style={{ color: "#6b7280" }}>
                        Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : "None"}
                      </small>
                    </td>
                    <td>
                      <span style={{ fontWeight: "600", color: "#2563eb" }}>
                        {job.applicantsCount || 0}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-start" }}>
                        {getStatusBadge(job.status)}
                        {job.status === "rejected" && job.rejectionReason && (
                          <small style={{ color: "#b91c1c", maxWidth: "160px", wordBreak: "break-word" }}>
                            Reason: {job.rejectionReason}
                          </small>
                        )}
                        {job.approvedAt && (
                          <small style={{ color: "#047857", fontSize: "11px" }}>
                            Approved on {new Date(job.approvedAt).toLocaleDateString()}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        {/* Approval workflow buttons */}
                        {job.status === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(job)}
                              className="button"
                              style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                background: "#10b981",
                                color: "#fff",
                                border: "none",
                                fontWeight: "bold"
                              }}
                              title="Approve job and make live"
                            >
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenReject(job)}
                              className="button"
                              style={{
                                padding: "6px 10px",
                                fontSize: "12px",
                                background: "#ef4444",
                                color: "#fff",
                                border: "none",
                                fontWeight: "bold"
                              }}
                              title="Reject job with reason"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => setDetailsModalJob(job)}
                          className="button button-outline"
                          style={{ padding: "5px 9px", fontSize: "12px" }}
                          title="View complete job specifications"
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(job)}
                          className="button button-outline"
                          style={{ padding: "5px 9px", fontSize: "12px" }}
                          title="Edit job details"
                        >
                          Edit
                        </button>

                        {(job.status === "approved" || job.status === "active") && (
                          <button
                            type="button"
                            onClick={() => handleClose(job)}
                            className="button"
                            style={{
                              padding: "5px 8px",
                              fontSize: "12px",
                              background: "#f3f4f6",
                              color: "#4b5563",
                              border: "1px solid #d1d5db"
                            }}
                            title="Close vacancy"
                          >
                            Close
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(job)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#dc2626",
                            fontSize: "14px",
                            cursor: "pointer",
                            padding: "4px 6px"
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

      {/* Reject Modal */}
      {rejectModalJob && (
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
          <div className="card" style={{ maxWidth: "480px", width: "92%", padding: "24px" }}>
            <h3 style={{ color: "#b91c1c", marginBottom: "8px" }}>Reject Job Posting</h3>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "0 0 16px" }}>
              Please provide a clear reason why <strong>"{rejectModalJob.title}"</strong> is being rejected. The recruiter will receive this feedback so they can fix and re-submit it.
            </p>

            <form onSubmit={handleConfirmReject}>
              <div className="form-group">
                <label>Rejection Reason *</label>
                <textarea
                  required
                  rows="4"
                  className="form-control"
                  placeholder="e.g. Inappropriate job description, missing salary details, or requires more detailed requirements."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setRejectModalJob(null)}
                  disabled={rejecting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button"
                  style={{ background: "#dc2626", color: "#fff", border: "none", padding: "10px 18px", fontWeight: "bold" }}
                  disabled={rejecting}
                >
                  {rejecting ? "Rejecting..." : "Confirm & Send Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Job Details Modal */}
      {detailsModalJob && (
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
          <div className="card" style={{ maxWidth: "650px", width: "92%", padding: "24px", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span className="badge" style={{ marginBottom: "6px" }}>{detailsModalJob.jobType || detailsModalJob.type}</span>
                <h2 style={{ margin: 0 }}>{detailsModalJob.title}</h2>
                <h3 className="job-company" style={{ margin: "4px 0 0" }}>{detailsModalJob.company}</h3>
              </div>
              <div>{getStatusBadge(detailsModalJob.status)}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", background: "#f9fafb", padding: "14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
              <div><strong>Location:</strong> {detailsModalJob.location}</div>
              <div><strong>Salary:</strong> {detailsModalJob.salary || "Not disclosed"}</div>
              <div><strong>Experience:</strong> {detailsModalJob.experience || "Fresher / Any"}</div>
              <div><strong>Deadline:</strong> {detailsModalJob.deadline ? new Date(detailsModalJob.deadline).toLocaleDateString() : "None"}</div>
              <div><strong>Recruiter:</strong> {detailsModalJob.recruiterId?.name} ({detailsModalJob.recruiterId?.email})</div>
              <div><strong>Applicants:</strong> {detailsModalJob.applicantsCount || 0}</div>
            </div>

            <h4 style={{ marginBottom: "6px" }}>Job Description</h4>
            <p style={{ fontSize: "14px", whiteSpace: "pre-wrap", color: "#374151" }}>{detailsModalJob.description}</p>

            {detailsModalJob.requirements && detailsModalJob.requirements.length > 0 && (
              <>
                <h4 style={{ margin: "16px 0 6px" }}>Requirements</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#374151" }}>
                  {detailsModalJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </>
            )}

            {detailsModalJob.skills && detailsModalJob.skills.length > 0 && (
              <>
                <h4 style={{ margin: "16px 0 6px" }}>Skills</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {detailsModalJob.skills.map((skill, i) => (
                    <span key={i} className="badge" style={{ background: "#e5e7eb", color: "#1f2937" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}

            {detailsModalJob.status === "rejected" && (
              <div style={{ background: "#fef2f2", borderLeft: "4px solid #ef4444", padding: "12px", margin: "16px 0", borderRadius: "4px" }}>
                <strong style={{ color: "#991b1b" }}>Rejection Reason:</strong>
                <p style={{ margin: "4px 0 0", color: "#b91c1c", fontSize: "14px" }}>{detailsModalJob.rejectionReason}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
              {detailsModalJob.status === "pending" && (
                <button
                  type="button"
                  className="button"
                  style={{ background: "#10b981", color: "#fff", border: "none" }}
                  onClick={() => {
                    handleApprove(detailsModalJob);
                    setDetailsModalJob(null);
                  }}
                >
                  Approve Job
                </button>
              )}
              <button
                type="button"
                className="button button-outline"
                onClick={() => setDetailsModalJob(null)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Edit Modal */}
      {editModalJob && (
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
          <div className="card" style={{ maxWidth: "650px", width: "92%", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "16px" }}>Edit Job Posting (Admin)</h2>

            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  required
                  className="form-control"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    required
                    className="form-control"
                    value={editForm.company}
                    onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    required
                    className="form-control"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    className="form-control"
                    value={editForm.jobType}
                    onChange={(e) => setEditForm({ ...editForm, jobType: e.target.value })}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                    <option>Remote</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    className="form-control"
                    value={editForm.salary}
                    onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input
                    className="form-control"
                    value={editForm.experience}
                    onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Skills (comma separated)</label>
                <input
                  className="form-control"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Job Description *</label>
                <textarea
                  required
                  rows="4"
                  className="form-control"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Requirements (one per line)</label>
                <textarea
                  rows="3"
                  className="form-control"
                  value={editForm.requirements}
                  onChange={(e) => setEditForm({ ...editForm, requirements: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setEditModalJob(null)}
                  disabled={savingEdit}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={savingEdit}
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;
