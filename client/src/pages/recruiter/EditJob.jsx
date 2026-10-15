import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { getJobById, updateJob } from "../../services/jobService";

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    experience: "",
    salary: "",
    skills: "",
    description: "",
    requirements: "",
    deadline: "",
    status: ""
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getJobById(jobId)
      .then(({ data }) => {
        setForm({
          title: data.title || "",
          company: data.company || "",
          location: data.location || "",
          jobType: data.jobType || data.type || "Full Time",
          experience: data.experience || "",
          salary: data.salary || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          description: data.description || "",
          requirements: Array.isArray(data.requirements) ? data.requirements.join("\n") : "",
          deadline: data.deadline ? new Date(data.deadline).toISOString().split("T")[0] : "",
          status: data.status || ""
        });
        setRejectionReason(data.rejectionReason || "");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load job details.");
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e, forceStatus = null) => {
    if (e) e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        jobType: form.jobType,
        experience: form.experience.trim(),
        salary: form.salary.trim(),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        description: form.description.trim(),
        requirements: form.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
        deadline: form.deadline || null
      };

      if (forceStatus) {
        payload.status = forceStatus;
      } else if (form.status === "rejected") {
        // Re-submit rejected job for approval
        payload.resubmitForApproval = true;
      }

      await updateJob(jobId, payload);
      setMessage("Job updated successfully!");
      setTimeout(() => navigate("/recruiter/jobs"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <BackButton variant="page" />
        <main className="section"><div className="container"><p>Loading job details...</p></div></main>
      </div>
    );
  }

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Edit Job Listing</h1>
          <p>Update job details or re-submit for admin review</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          {/* Rejection Alert Banner if previously rejected */}
          {form.status === "rejected" && (
            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "flex-start",
              gap: "14px"
            }}>
              <i className="bi bi-exclamation-triangle" style={{ fontSize: "24px", lineHeight: "1" }} aria-hidden="true"></i>
              <div>
                <strong style={{ color: "#b91c1c", fontSize: "16px", display: "block", marginBottom: "4px" }}>
                  This posting was rejected by Admin
                </strong>
                <p style={{ margin: "0 0 8px", fontSize: "14px", color: "#991b1b" }}>
                  <strong>Admin Feedback:</strong> {rejectionReason || "No specific feedback provided."}
                </p>
                <small style={{ color: "#7f1d1d" }}>
                  Please address the feedback below and click <strong>"Save & Re-submit for Approval"</strong> to have an admin review your changes.
                </small>
              </div>
            </div>
          )}

          <form className="form-card" onSubmit={(e) => handleSubmit(e)}>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Job Title *</label>
              <input
                required
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  required
                  name="company"
                  className="form-control"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  required
                  name="location"
                  className="form-control"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Job Type</label>
                <select name="jobType" className="form-control" value={form.jobType} onChange={handleChange}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <input
                  name="experience"
                  className="form-control"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Salary</label>
                <input
                  name="salary"
                  className="form-control"
                  value={form.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="deadline"
                className="form-control"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Required Skills (comma separated)</label>
              <input
                name="skills"
                className="form-control"
                value={form.skills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                required
                name="description"
                className="form-control"
                rows="6"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Requirements & Qualifications (one per line)</label>
              <textarea
                name="requirements"
                className="form-control"
                rows="4"
                value={form.requirements}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
              <button
                className="button button-primary"
                type="submit"
                disabled={saving}
                style={{ padding: "12px 24px", fontWeight: "bold" }}
              >
                {saving
                  ? "Saving..."
                  : form.status === "rejected"
                  ? "Save & Re-submit for Approval"
                  : "Save Changes"}
              </button>

              <button
                type="button"
                className="button button-outline"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "draft")}
                style={{ padding: "12px 20px" }}
              >
                Save as Draft
              </button>

              <button
                type="button"
                className="button"
                style={{ background: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" }}
                onClick={() => navigate("/recruiter/jobs")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditJob;
