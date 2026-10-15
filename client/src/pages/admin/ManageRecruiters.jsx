import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getAdminRecruiters } from "../../services/adminService";

function ManageRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminRecruiters()
      .then(({ data }) => {
        const uniqueRecruiters = (Array.isArray(data) ? data : []).filter((recruiter, index, list) => list.findIndex((item) => String(item._id) === String(recruiter._id) || item.email?.toLowerCase() === recruiter.email?.toLowerCase()) === index);
        setRecruiters(uniqueRecruiters);
      })
      .catch(() => setError("Unable to load recruiters"));
  }, []);

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Manage Recruiters</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="table-wrap">
<table className="data-table">
<thead><tr><th>Recruiter</th><th>Company</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
<tbody>
{error && <tr><td colSpan="5" className="error-message">{error}</td></tr>}
{!error && recruiters.length === 0 && <tr><td colSpan="5">No registered recruiters found.</td></tr>}
{recruiters.map((recruiter) => <tr key={recruiter._id}><td>{recruiter.name || "Unnamed recruiter"}</td><td>{recruiter.company?.name || recruiter.companyName || "Not provided"}</td><td>{recruiter.email || "No email"}</td><td><span className="status status-success">Active</span></td><td>—</td></tr>)}
</tbody>
</table>
</div>

        </div>
      </main>

    </div>
  );
}
export default ManageRecruiters;
