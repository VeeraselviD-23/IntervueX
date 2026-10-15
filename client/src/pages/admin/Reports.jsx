import React from "react";
import BackButton from "../../components/BackButton";

function Reports() {
  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Reports</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="dashboard-cards">
  <div className="dashboard-card"><span>Applications This Month</span><strong>420</strong></div>
  <div className="dashboard-card"><span>New Users</span><strong>185</strong></div>
  <div className="dashboard-card"><span>New Jobs</span><strong>76</strong></div>
  <div className="dashboard-card"><span>Successful Hires</span><strong>31</strong></div>
</div>
<div className="card"><h3>Platform Activity</h3><p>Use the backend reporting APIs to replace these sample values with real analytics.</p></div>

        </div>
      </main>

    </div>
  );
}
export default Reports;
