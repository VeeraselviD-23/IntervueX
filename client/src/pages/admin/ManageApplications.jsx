import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getAdminApplications } from "../../services/adminService";

function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminApplications()
      .then(({ data }) => setApplications(Array.isArray(data) ? data : data.applications || []))
      .catch(() => setError("Unable to load applications."));
  }, []);

  return (
    <div className="page">
      <BackButton variant="page" />
      <section className="page-heading"><div className="container"><h1>Manage Applications</h1><p>Review activity across the hiring pipeline.</p></div></section>
      <main className="section"><div className="container"><div className="table-wrap"><table className="data-table">
        <thead><tr><th>Candidate</th><th>Job</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead>
        <tbody>
          {error && <tr><td colSpan="5" className="error-message">{error}</td></tr>}
          {!error && applications.length === 0 && <tr><td colSpan="5">No applications found.</td></tr>}
          {applications.map((application) => <tr key={application._id}>
            <td>{application.candidate?.name || application.user?.name || "Unknown candidate"}</td>
            <td>{application.job?.title || "Job unavailable"}</td>
            <td>{application.job?.company?.name || application.company?.name || "—"}</td>
            <td><span className="status status-warning">{application.status || "Submitted"}</span></td>
            <td>{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : "—"}</td>
          </tr>)}
        </tbody>
      </table></div></div></main>
    </div>
  );
}

export default ManageApplications;
