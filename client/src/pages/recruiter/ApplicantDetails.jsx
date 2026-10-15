import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { getApplicantById, updateApplicantStatus, scheduleInterview } from "../../services/recruiterService";

function ApplicantDetails() {
  const { applicantId } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("applied");

  // Interview Form state
  const [interviewForm, setInterviewForm] = useState({
    scheduledAt: "",
    interviewType: "Online Technical",
    interviewLink: "",
    notes: ""
  });
  const [scheduling, setScheduling] = useState(false);

  const loadApplicant = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getApplicantById(applicantId);
      setApplication(data);
      setSelectedStatus(data.status || "applied");

      if (data.interview?.scheduledAt) {
        const dt = new Date(data.interview.scheduledAt);
        const tzOffset = dt.getTimezoneOffset() * 60000;
        const localISOTime = new Date(dt.getTime() - tzOffset).toISOString().slice(0, 16);
        setInterviewForm({
          scheduledAt: localISOTime,
          interviewType: data.interview.interviewType || "Online Technical",
          interviewLink: data.interview.interviewLink || "",
          notes: data.interview.notes || ""
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load applicant details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicant();
  }, [applicantId]);

  const handleStatusChange = async () => {
    setUpdatingStatus(true);
    setStatusMessage("");
    try {
      await updateApplicantStatus(applicantId, { status: selectedStatus });
      setStatusMessage(`Status updated to ${selectedStatus}. Candidate was notified.`);
      setTimeout(() => setStatusMessage(""), 4000);
      loadApplicant();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!interviewForm.scheduledAt) {
      alert("Please specify interview date and time");
      return;
    }

    setScheduling(true);
    setStatusMessage("");
    try {
      await scheduleInterview(applicantId, interviewForm);
      setStatusMessage("Interview scheduled successfully! An in-app notification has been sent to the candidate.");
      setTimeout(() => setStatusMessage(""), 4000);
      loadApplicant();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to schedule interview");
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <BackButton variant="page" />
        <main className="section"><div className="container"><p>Loading candidate details...</p></div></main>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="page">
        <BackButton variant="page" />
        <main className="section"><div className="container"><p className="error-message">{error || "Application not found"}</p></div></main>
      </div>
    );
  }

  const candidate = application.candidate || {};
  const job = application.job || {};
  const resumeUrl = application.resumeUrl || candidate.resumeUrl;

  const initials = candidate.name
    ? candidate.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "AP";

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Applicant Details</h1>
          <p>Application for <strong>{job.title}</strong> at {job.company}</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {statusMessage && <div className="success-message" style={{ marginBottom: "20px" }}>{statusMessage}</div>}

          <div className="profile-grid" style={{ alignItems: "start" }}>
            {/* Candidate Card */}
            <div className="card" style={{ textAlign: "center", padding: "24px" }}>
              <div
                className="avatar"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#fee2e2",
                  color: "#e53935",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                  margin: "0 auto 16px"
                }}
              >
                {initials}
              </div>
              <h2 style={{ marginBottom: "4px" }}>{candidate.name || "Candidate Name"}</h2>
              <p style={{ color: "#e53935", fontWeight: "600", margin: "0 0 12px" }}>
                Applied for {job.title}
              </p>

              <div style={{ textAlign: "left", margin: "20px 0", fontSize: "14px", display: "grid", gap: "10px" }}>
                <div><strong>Email:</strong> {candidate.email || "Not provided"}</div>
                <div><strong>Phone:</strong> {candidate.phone || "Not provided"}</div>
                <div><strong>Location:</strong> {candidate.location || "Not provided"}</div>
                <div><strong>Applied On:</strong> {new Date(application.createdAt).toLocaleDateString()}</div>
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={`status status-${application.status === "shortlisted" || application.status === "hired" ? "success" : application.status === "rejected" ? "danger" : "warning"}`}>
                    {application.status}
                  </span>
                </div>
              </div>

              {resumeUrl ? (
                <a
                  className="button button-primary"
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ width: "100%", display: "inline-block", textAlign: "center" }}
                >
                  View Attached Resume
                </a>
              ) : (
                <div style={{ color: "#9ca3af", fontSize: "13px" }}>No resume file attached</div>
              )}
            </div>

            {/* Application Information & Interview Workflow */}
            <div style={{ display: "grid", gap: "20px" }}>
              {/* Skills & Education Card */}
              <div className="card">
                <h3>Candidate Qualifications</h3>
                <div style={{ marginTop: "14px" }}>
                  <h4 style={{ fontSize: "14px", color: "#4b5563", marginBottom: "6px" }}>Skills</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {candidate.skills && candidate.skills.length > 0 ? (
                      candidate.skills.map((s, idx) => (
                        <span key={idx} className="badge" style={{ background: "#f3f4f6", color: "#1f2937" }}>
                          {s}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "#9ca3af" }}>No skills listed.</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ fontSize: "14px", color: "#4b5563", marginBottom: "6px" }}>Education</h4>
                  <p style={{ margin: 0 }}>{candidate.education || "No education information provided."}</p>
                </div>

                {application.coverLetter && (
                  <div style={{ marginTop: "16px" }}>
                    <h4 style={{ fontSize: "14px", color: "#4b5563", marginBottom: "6px" }}>Cover Letter</h4>
                    <p style={{ background: "#f9fafb", padding: "12px", borderRadius: "8px", fontSize: "14px", whiteSpace: "pre-wrap" }}>
                      {application.coverLetter}
                    </p>
                  </div>
                )}
              </div>

              {/* Status Updater Card */}
              <div className="card">
                <h3>Update Application Status</h3>
                <p style={{ fontSize: "13px", color: "#6b7280" }}>
                  Changing status sends an automatic notification to {candidate.name}.
                </p>

                <div style={{ display: "flex", gap: "10px", marginTop: "12px", alignItems: "center" }}>
                  <select
                    className="form-control"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{ maxWidth: "220px" }}
                  >
                    <option value="applied">Applied</option>
                    <option value="review">Under Review</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Move to Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="hired">Hired</option>
                  </select>

                  <button
                    className="button button-primary"
                    type="button"
                    onClick={handleStatusChange}
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? "Saving..." : "Update Status"}
                  </button>
                </div>
              </div>

              {/* Interview Scheduling Card */}
              <div className="card" style={{ borderTop: "4px solid #e53935" }}>
                <h3>Interview Management</h3>

                {application.interview?.scheduledAt ? (
                  <div style={{
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    borderRadius: "8px",
                    padding: "16px",
                    margin: "12px 0 20px"
                  }}>
                    <strong style={{ color: "#065f46", display: "block", marginBottom: "8px" }}>
                      Interview Currently Scheduled
                    </strong>
                    <div style={{ fontSize: "14px", display: "grid", gap: "6px", color: "#047857" }}>
                      <div><strong>Date & Time:</strong> {new Date(application.interview.scheduledAt).toLocaleString()}</div>
                      <div><strong>Interview Type:</strong> {application.interview.interviewType}</div>
                      {application.interview.interviewLink && (
                        <div>
                          <strong>Link:</strong>{" "}
                          <a
                            href={application.interview.interviewLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#2563eb", textDecoration: "underline" }}
                          >
                            {application.interview.interviewLink}
                          </a>
                        </div>
                      )}
                      {application.interview.notes && (
                        <div><strong>Notes:</strong> {application.interview.notes}</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: "14px", color: "#6b7280", margin: "6px 0 16px" }}>
                    Schedule a technical or HR interview with meeting details. The candidate will receive a notification and see the meeting link in their portal.
                  </p>
                )}

                <form onSubmit={handleScheduleInterview}>
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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                      <label>Meeting Link</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://meet.google.com/..."
                        value={interviewForm.interviewLink}
                        onChange={(e) => setInterviewForm({ ...interviewForm, interviewLink: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Interview Notes / Instructions</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="e.g. Please join 5 minutes early with working webcam and microphone."
                      value={interviewForm.notes}
                      onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="button button-primary"
                    disabled={scheduling}
                    style={{ marginTop: "8px" }}
                  >
                    {scheduling
                      ? "Scheduling..."
                      : application.interview?.scheduledAt
                      ? "Reschedule & Update Candidate"
                      : "Schedule Interview & Send Invite"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicantDetails;
