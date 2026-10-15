import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getJobById } from "../../services/jobService";
import { getResume, uploadResume } from "../../services/resumeService";
import { applyJob } from "../../services/applicationService";

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([getJobById(jobId), getResume()])
      .then(([jobResponse, resumeResponse]) => {
        setJob(jobResponse.data);
        const items = Array.isArray(resumeResponse.data) ? resumeResponse.data : [];
        setResumes(items);
        if (items.length > 0 && items[0]?.fileUrl) {
          setResumeUrl(items[0].fileUrl);
        }
      })
      .catch(() => setError("Unable to load job or profile details"));
  }, [jobId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const { data } = await uploadResume(formData);
      setResumes((prev) => [data, ...prev]);
      setResumeUrl(data.fileUrl);
      setUploadSuccess(`Successfully uploaded and selected: ${data.fileName || file.name}`);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || "Failed to upload resume file");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!resumeUrl) {
      setError("Please select or upload a resume before submitting your application.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await applyJob({ job: jobId, resumeUrl, coverLetter });
      navigate(`/user/applications/${data._id}`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Apply For Job</h1>
          <p>IntervueX Career Application Portal</p>
        </div>
      </section>

      <main className="section">
        <div className="container">
          <form className="form-card" onSubmit={handleSubmit} style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <span className="badge">{job?.jobType || job?.type || "Full Time"}</span>
              <h2 style={{ margin: "8px 0 4px" }}>{job ? job.title : "Loading job..."}</h2>
              <p className="job-company" style={{ fontSize: "16px", color: "#4f46e5", margin: 0 }}>
                {job?.company?.name || job?.company || "Company"} • {job?.location || "Location not specified"}
              </p>
            </div>

            {error && <div className="error-message" style={{ marginBottom: "16px" }}>{error}</div>}
            {uploadSuccess && <div className="success-message" style={{ marginBottom: "16px" }}>{uploadSuccess}</div>}

            {/* Resume Selection / Upload Section */}
            <div className="form-group">
              <label>Select / Upload Resume *</label>

              {resumes.length > 0 && (
                <select
                  className="form-control"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  style={{ marginBottom: "10px" }}
                >
                  <option value="">-- Select an existing resume --</option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume.fileUrl}>
                      {resume.fileName || "Uploaded Resume"} ({new Date(resume.createdAt || Date.now()).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}

              <div
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: "8px",
                  padding: "16px",
                  background: "#f9fafb",
                  textAlign: "center",
                  marginTop: "6px"
                }}
              >
                <p style={{ margin: "0 0 8px", fontSize: "13px", color: "#4b5563" }}>
                  {resumes.length > 0 ? "Or upload a newer resume version:" : "Upload your resume (PDF, DOC, DOCX):"}
                </p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  style={{ fontSize: "13px" }}
                />
                {uploading && <p style={{ fontSize: "12px", color: "#4f46e5", marginTop: "6px" }}>Uploading resume...</p>}
              </div>

              {resumeUrl && (
                <p style={{ fontSize: "13px", color: "#059669", marginTop: "8px" }}>
                  Resume selected and ready for application.
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Cover Letter / Pitch (Optional)</label>
              <textarea
                className="form-control"
                rows="6"
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                placeholder="Share why you're a great fit for this position, relevant achievements, or availability..."
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button
                className="button button-primary"
                type="submit"
                disabled={loading || uploading || !job}
                style={{ flex: 1 }}
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
              <Link to={`/jobs/${jobId}`} className="button button-outline">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ApplyJob;
