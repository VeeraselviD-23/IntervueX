import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getResume, uploadResume } from "../../services/resumeService";
import { assetUrl } from "../../services/api";

function Resume() {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getResume().then(({ data }) => setResumes(Array.isArray(data) ? data : [])).catch(() => setError("Unable to load resumes")); }, []);
  const handleUpload = async (event) => { event.preventDefault(); if (!file) { setError("Choose a resume file first"); return; } const formData = new FormData(); formData.append("resume", file); try { const { data } = await uploadResume(formData); setResumes((items) => [data, ...items]); setFile(null); setMessage("Resume uploaded successfully"); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to upload resume"); } };
  const latestResume = resumes[0];
  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>My Resume</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="profile-grid">
  <div className="card">
    <h3>Resume Summary</h3>
    {latestResume ? <><p><strong>File:</strong> {latestResume.fileName || "Uploaded resume"}</p><a className="button button-primary" href={assetUrl(latestResume.fileUrl)} target="_blank" rel="noreferrer">Download Resume</a></> : <p>No resume uploaded yet.</p>}
  </div>
  <form className="form-card" onSubmit={handleUpload}>
    <h3>Upload Updated Resume</h3>
    {message && <div className="success-message">{message}</div>}{error && <div className="error-message">{error}</div>}
    <div className="form-group"><label>Resume File</label><input className="form-control" type="file" accept=".pdf,.doc,.docx" onChange={(event) => { setFile(event.target.files?.[0] || null); setError(""); }} /></div>
    <button className="button button-primary" type="submit">Upload Resume</button>
  </form>
</div>

        </div>
      </main>

    </div>
  );
}
export default Resume;
