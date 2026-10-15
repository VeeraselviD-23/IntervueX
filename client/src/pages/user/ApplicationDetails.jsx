import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getApplicationById } from "../../services/applicationService";
import { useParams, Link } from "react-router-dom";

function ApplicationDetails() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getApplicationById(applicationId)
      .then(({ data }) => setApplication(data))
      .catch(() => setError("Unable to load application details"));
  }, [applicationId]);

  const getStepStatus = (stepKey) => {
    if (!application) return "pending";
    const s = application.status === "submitted" ? "applied" : application.status;

    if (stepKey === "applied") return "completed";

    if (stepKey === "review") {
      if (s === "applied") return "pending";
      if (s === "review") return "current";
      return "completed";
    }

    if (stepKey === "shortlisted") {
      if (s === "applied" || s === "review") return "pending";
      if (s === "shortlisted") return "current";
      if (s === "rejected") return "rejected";
      return "completed";
    }

    if (stepKey === "interview") {
      if (s === "applied" || s === "review" || s === "shortlisted") return "pending";
      if (s === "interview") return "current";
      if (s === "rejected") return "rejected";
      return "completed";
    }

    if (stepKey === "final") {
      if (s === "hired") return "hired";
      if (s === "rejected") return "rejected";
      return "pending";
    }

    return "pending";
  };

  const steps = [
    { key: "applied", label: "Applied", desc: "Application submitted" },
    { key: "review", label: "Under Review", desc: "Recruiter reviewing profile" },
    { key: "shortlisted", label: "Shortlisted", desc: "Profile shortlisted" },
    { key: "interview", label: "Interview Scheduled", desc: "Meeting details arranged" },
    {
      key: "final",
      label: application?.status === "rejected" ? "Decision: Rejected" : "Selected / Hired",
      desc: application?.status === "rejected" ? "Not moving forward" : application?.status === "hired" ? "Congratulations on offer!" : "Final decision pending"
    }
  ];

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Application Details</h1>
          <p>Track recruitment progress for your submission</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          {error && <div className="error-message">{error}</div>}
          {!error && !application && <p>Loading application details...</p>}

          {application && (
            <div className="card" style={{ maxWidth: "850px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px" }}>{application.job?.title || "Job Application"}</h2>
                  <p className="job-company" style={{ fontSize: "16px", color: "#4f46e5", margin: 0 }}>
                    {application.job?.company?.name || application.job?.company || "Company"} • {application.job?.location || "Location"}
                  </p>
                </div>
                <span className={`status status-${application.status === "shortlisted" || application.status === "hired" ? "success" : application.status === "rejected" ? "danger" : application.status === "interview" ? "info" : "warning"}`} style={{ fontSize: "14px", padding: "6px 14px" }}>
                  {application.status === "interview" ? "Interview Scheduled" : application.status}
                </span>
              </div>

              {/* Progress Timeline Stepper */}
              <div style={{ margin: "32px 0 28px", background: "#f8fafc", padding: "20px 16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 16px", color: "#334155", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Application Status Tracker
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", position: "relative" }}>
                  {steps.map((step, index) => {
                    const statusState = getStepStatus(step.key);
                    const isCompleted = statusState === "completed";
                    const isCurrent = statusState === "current";
                    const isHired = statusState === "hired";
                    const isRejected = statusState === "rejected";

                    let bg = "#e2e8f0";
                    let textCol = "#64748b";
                    let badge = `${index + 1}`;

                    if (isCompleted) {
                      bg = "#10b981";
                      textCol = "#065f46";
                      badge = "Done";
                    } else if (isCurrent) {
                      bg = "#3b82f6";
                      textCol = "#1e40af";
                    } else if (isHired) {
                      bg = "#10b981";
                      textCol = "#065f46";
                      badge = "Selected";
                    } else if (isRejected) {
                      bg = "#ef4444";
                      textCol = "#991b1b";
                      badge = "Rejected";
                    }

                    return (
                      <div
                        key={step.key}
                        style={{
                          textAlign: "center",
                          padding: "10px 8px",
                          borderRadius: "8px",
                          background: isCurrent ? "#eff6ff" : "transparent",
                          border: isCurrent ? "1px solid #bfdbfe" : "1px solid transparent"
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: bg,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            fontSize: "14px",
                            margin: "0 auto 8px"
                          }}
                        >
                          {badge}
                        </div>
                        <div style={{ fontWeight: isCurrent ? "700" : "600", fontSize: "13px", color: textCol }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>
                          {step.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scheduled Interview Card for Job Seeker */}
              {application.interview?.scheduledAt && (
                <div
                  style={{
                    background: "#eff6ff",
                    border: "1px solid #bfdbfe",
                    borderRadius: "10px",
                    padding: "18px 20px",
                    margin: "20px 0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <i className="bi bi-calendar-event" style={{ fontSize: "20px" }} aria-hidden="true"></i>
                    <h3 style={{ color: "#1e40af", margin: 0 }}>Interview Scheduled</h3>
                  </div>
                  <p style={{ margin: "6px 0" }}>
                    <strong>Date & Time:</strong> {new Date(application.interview.scheduledAt).toLocaleString()}
                  </p>
                  <p style={{ margin: "6px 0" }}>
                    <strong>Round:</strong> {application.interview.interviewType || "Online"}
                  </p>
                  {application.interview.interviewLink && (
                    <div style={{ marginTop: "12px" }}>
                      <a
                        href={application.interview.interviewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-primary"
                        style={{ display: "inline-block" }}
                      >
                        Join Interview Link
                      </a>
                    </div>
                  )}
                  {application.interview.notes && (
                    <p style={{ marginTop: "10px", fontSize: "14px", color: "#1e3a8a", background: "#dbeafe", padding: "8px 12px", borderRadius: "6px" }}>
                      <strong>Notes from Recruiter:</strong> {application.interview.notes}
                    </p>
                  )}
                </div>
              )}

              <hr />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "16px 0" }}>
                <div>
                  <strong style={{ color: "#6b7280", fontSize: "13px" }}>Application ID</strong>
                  <p style={{ margin: "2px 0", fontSize: "14px", fontFamily: "monospace" }}>{application._id}</p>
                </div>
                <div>
                  <strong style={{ color: "#6b7280", fontSize: "13px" }}>Applied On</strong>
                  <p style={{ margin: "2px 0", fontSize: "14px" }}>
                    {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>

              {application.resumeUrl && (
                <div style={{ margin: "16px 0" }}>
                  <strong style={{ color: "#6b7280", fontSize: "13px", display: "block", marginBottom: "6px" }}>Submitted Resume</strong>
                  <a
                    href={application.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="button button-outline"
                    style={{ fontSize: "13px", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    View Submitted Resume
                  </a>
                </div>
              )}

              <div style={{ marginTop: "20px" }}>
                <h3>Cover Letter / Pitch</h3>
                <p style={{ whiteSpace: "pre-wrap", color: "#374151", background: "#f9fafb", padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  {application.coverLetter || "No cover letter was included with this application."}
                </p>
              </div>

              <div style={{ marginTop: "24px" }}>
                <Link to="/user/applications" className="button button-outline">
                  ← Back to My Applications
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ApplicationDetails;
