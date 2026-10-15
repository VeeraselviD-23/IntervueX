import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { getAllApplicants, updateApplicantStatus, scheduleInterview } from "../../services/recruiterService";
import { getMyJobs } from "../../services/jobService";

function Applicants() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "all";

  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(initialJobId);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  // Interview scheduling modal state
  const [interviewModalData, setInterviewModalData] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    interviewType: "Online Technical",
    interviewLink: "",
    notes: ""
  });
  const [scheduling, setScheduling] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [jobsRes, applicantsRes] = await Promise.all([
        getMyJobs(),
        getAllApplicants(selectedJob !== "all" ? { jobId: selectedJob } : {})
      ]);

      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setApplicants(Array.isArray(applicantsRes.data) ? applicantsRes.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedJob]);

  const handleJobFilterChange = (jobId) => {
    setSelectedJob(jobId);
    if (jobId === "all") {
      searchParams.delete("jobId");
    } else {
      searchParams.set("jobId", jobId);
    }
    setSearchParams(searchParams);
  };

  const handleUpdateStatus = async (applicationId, newStatus, candidateName) => {
    try {
      await updateApplicantStatus(applicationId, { status: newStatus });
      setActionSuccess(`Updated ${candidateName}'s status to ${newStatus}. Candidate has been notified.`);
      setTimeout(() => setActionSuccess(""), 4000);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleOpenInterviewModal = (applicant) => {
    setInterviewModalData(applicant);
    // Prepopulate existing schedule if any
    if (applicant.interview?.scheduledAt) {
      const dt = new Date(applicant.interview.scheduledAt);
      const tzOffset = dt.getTimezoneOffset() * 60000;
      const localISOTime = new Date(dt.getTime() - tzOffset).toISOString().slice(0, 16);
      setInterviewForm({
        scheduledAt: localISOTime,
        interviewType: applicant.interview.interviewType || "Online Technical",
        interviewLink: applicant.interview.interviewLink || "",
        notes: applicant.interview.notes || ""
      });
    } else {
      setInterviewForm({
        scheduledAt: "",
        interviewType: "Online Technical",
        interviewLink: "",
        notes: ""
      });
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!interviewForm.scheduledAt) {
      alert("Please select interview date and time");
      return;
    }

    setScheduling(true);
    try {
      await scheduleInterview(interviewModalData._id, interviewForm);
      setActionSuccess(`Interview scheduled for ${interviewModalData.candidate?.name}! Notification sent to candidate.`);
      setTimeout(() => setActionSuccess(""), 4000);
      setInterviewModalData(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setScheduling(false);
    }
  };

  const filteredApplicants = applicants.filter((app) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "applied") return app.status === "applied" || app.status === "submitted";
    return app.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "shortlisted":
        return <span className="status status-success">Shortlisted</span>;
      case "interview":
        return <span className="status" style={{ background: "#dbeafe", color: "#1e40af", fontWeight: "bold" }}><i className="bi bi-calendar-event me-2" aria-hidden="true"></i>Interview</span>;
      case "rejected":
        return <span className="status status-danger">Rejected</span>;
      case "hired":
        return <span className="status" style={{ background: "#d1fae5", color: "#065f46", fontWeight: "bold" }}><i className="bi bi-check-circle me-2" aria-hidden="true"></i>Selected</span>;
      case "review":
        return <span className="status status-warning">Under Review</span>;
      case "applied":
      case "submitted":
      default:
        return <span className="status" style={{ background: "#f3f4f6", color: "#374151" }}>Applied</span>;
    }
  };

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Job Applicants</h1>
          <p>Review candidate profiles, shortlist, schedule interviews, and track applications</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {actionSuccess && <div className="success-message" style={{ marginBottom: "20px" }}>{actionSuccess}</div>}
          {error && <div className="error-message" style={{ marginBottom: "20px" }}>{error}</div>}

          {/* Filters Bar */}
          <div className="card" style={{ padding: "16px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontWeight: "600", fontSize: "14px", margin: 0 }}>Filter by Job:</label>
                <select
                  className="form-control"
                  style={{ width: "auto", minWidth: "220px" }}
                  value={selectedJob}
                  onChange={(e) => handleJobFilterChange(e.target.value)}
                >
                  <option value="all">All Jobs ({jobs.length})</option>
                  {jobs.map((j) => (
                    <option key={j._id} value={j._id}>
                      {j.title} ({j.applicantsCount || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Status pill filters */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {[
                  { id: "all", label: `All (${applicants.length})` },
                  { id: "applied", label: "Applied" },
                  { id: "shortlisted", label: "Shortlisted" },
                  { id: "interview", label: "Interview" },
                  { id: "rejected", label: "Rejected" },
                  { id: "hired", label: "Hired" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "16px",
                      border: "1px solid #d1d5db",
                      background: statusFilter === tab.id ? "#111827" : "#fff",
                      color: statusFilter === tab.id ? "#fff" : "#374151",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applicants Table */}
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job Title</th>
                  <th>Skills / Education</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "30px" }}>Loading applicants...</td>
                  </tr>
                )}

                {!loading && filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center", padding: "35px" }}>
                      No applicants found matching this criteria.
                    </td>
                  </tr>
                )}

                {!loading && filteredApplicants.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.candidate?.name || "Candidate"}</strong>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{app.candidate?.email || "No email"}</div>
                      {app.candidate?.phone && (
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>{app.candidate.phone}</div>
                      )}
                    </td>
                    <td>
                      <strong>{app.job?.title || "Job Posting"}</strong>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>{app.job?.location}</div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "220px", fontSize: "12px" }}>
                        {app.candidate?.skills && app.candidate.skills.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                            {app.candidate.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>
                                {s}
                              </span>
                            ))}
                            {app.candidate.skills.length > 3 && <span>+{app.candidate.skills.length - 3}</span>}
                          </div>
                        ) : (
                          <span>{app.candidate?.education || "Not specified"}</span>
                        )}
                      </div>
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      {app.resumeUrl || app.candidate?.resumeUrl ? (
                        <a
                          href={app.resumeUrl || app.candidate?.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="button button-outline"
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                        >
                          Resume
                        </a>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#9ca3af" }}>No file</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        {app.status !== "shortlisted" && app.status !== "interview" && app.status !== "hired" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(app._id, "shortlisted", app.candidate?.name)}
                            className="button"
                            style={{ padding: "5px 9px", fontSize: "12px", background: "#10b981", color: "#fff", border: "none" }}
                            title="Shortlist Candidate"
                          >
                            Shortlist
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenInterviewModal(app)}
                          className="button button-primary"
                          style={{ padding: "5px 9px", fontSize: "12px" }}
                          title="Schedule Interview"
                        >
                          Interview
                        </button>

                        {app.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(app._id, "rejected", app.candidate?.name)}
                            className="button"
                            style={{ padding: "5px 9px", fontSize: "12px", background: "#fee2e2", color: "#b91c1c", border: "1px solid #fecaca" }}
                            title="Reject Candidate"
                          >
                            Reject
                          </button>
                        )}

                        <Link
                          to={`/recruiter/applicants/${app._id}`}
                          className="button button-outline"
                          style={{ padding: "5px 9px", fontSize: "12px" }}
                        >
                          Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Schedule Interview Modal */}
      {interviewModalData && (
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
          <div className="card" style={{ maxWidth: "520px", width: "92%", padding: "24px", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ marginBottom: "6px", fontSize: "20px" }}>Schedule Interview</h2>
            <p style={{ color: "#4b5563", fontSize: "14px", marginBottom: "16px" }}>
              For <strong>{interviewModalData.candidate?.name}</strong> applying for <strong>{interviewModalData.job?.title}</strong>
            </p>

            <form onSubmit={handleScheduleSubmit}>
              <div className="form-group">
                <label>Interview Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  className="form-control"
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Interview Type</label>
                <select
                  className="form-control"
                  value={interviewForm.interviewType}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                >
                  <option value="Online Technical">Online Technical Round</option>
                  <option value="HR Discussion">HR Discussion</option>
                  <option value="Managerial Interview">Managerial Interview</option>
                  <option value="Coding Assessment Review">Coding Assessment Review</option>
                  <option value="In-person Meeting">In-person Meeting</option>
                </select>
              </div>

              <div className="form-group">
                <label>Meeting / Video Link</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="e.g. https://meet.google.com/xyz-abcd-efg"
                  value={interviewForm.interviewLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewLink: e.target.value })}
                />
                <small style={{ color: "#6b7280" }}>Google Meet, Zoom, Microsoft Teams, or IntervueX link.</small>
              </div>

              <div className="form-group">
                <label>Notes / Instructions for Candidate</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. Please be prepared to walk through your previous projects and write code in the IntervueX IDE."
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="button button-outline"
                  onClick={() => setInterviewModalData(null)}
                  disabled={scheduling}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={scheduling}
                >
                  {scheduling ? "Scheduling..." : "Send Interview Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Applicants;
