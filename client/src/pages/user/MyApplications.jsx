import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getMyApplications } from "../../services/applicationService";
import { Link } from "react-router-dom";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { getMyApplications().then(({ data }) => setApplications(Array.isArray(data) ? data : [])).catch(() => setError("Unable to load applications")); }, []);
  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>My Applications</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="table-wrap">
<table className="data-table">
<thead><tr><th>Job</th><th>Company</th><th>Applied On</th><th>Status</th><th>Action</th></tr></thead>
<tbody>
  {error && <tr><td colSpan="5" className="error-message">{error}</td></tr>}
  {!error && applications.length === 0 && <tr><td colSpan="5" style={{ textAlign: "center", padding: "24px" }}>No applications found.</td></tr>}
  {applications.map((application) => (
    <tr key={application._id}>
      <td><strong>{application.job?.title || "Job"}</strong></td>
      <td>{application.job?.company?.name || application.job?.company || "Company"}</td>
      <td>{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "-"}</td>
      <td>
        <span className={`status status-${application.status === "shortlisted" || application.status === "hired" ? "success" : application.status === "rejected" ? "danger" : application.status === "interview" ? "info" : "warning"}`}>
          {application.status === "interview" ? "Interview Scheduled" : application.status}
        </span>
      </td>
      <td>
        <Link to={`/user/applications/${application._id}`} className="button button-outline" style={{ padding: "4px 10px", fontSize: "12px" }}>
          View Details
        </Link>
      </td>
    </tr>
  ))}
</tbody>
</table>
</div>

        </div>
      </main>

    </div>
  );
}
export default MyApplications;
