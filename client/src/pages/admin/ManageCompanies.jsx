import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getAdminRecruiters } from "../../services/adminService";

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminRecruiters()
      .then(({ data }) => {
        const uniqueCompanies = (Array.isArray(data) ? data : []).reduce((result, recruiter) => {
          const company = recruiter.company;
          const name = company?.name || recruiter.companyName;
          const key = String(company?._id || name || "").trim().toLowerCase();
          if (name && !result.some((item) => item.key === key)) result.push({ key, name, recruiter });
          return result;
        }, []);
        setCompanies(uniqueCompanies);
      })
      .catch(() => setError("Unable to load companies."));
  }, []);

  return (
    <div className="page">
      <BackButton variant="page" />
      <section className="page-heading"><div className="container"><h1>Manage Companies</h1><p>Companies are listed from registered recruiter profiles.</p></div></section>
      <main className="section"><div className="container"><div className="table-wrap"><table className="data-table">
        <thead><tr><th>Company</th><th>Primary Recruiter</th><th>Email</th><th>Status</th></tr></thead>
        <tbody>
          {error && <tr><td colSpan="4" className="error-message">{error}</td></tr>}
          {!error && companies.length === 0 && <tr><td colSpan="4">No companies found.</td></tr>}
          {companies.map(({ key, name, recruiter }) => <tr key={key}><td>{name}</td><td>{recruiter.name || "—"}</td><td>{recruiter.email || "—"}</td><td><span className="status status-success">Active</span></td></tr>)}
        </tbody>
      </table></div></div></main>
    </div>
  );
}

export default ManageCompanies;
