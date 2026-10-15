import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getSubmissionHistory } from "../../services/compilerService";

function SubmissionHistory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { getSubmissionHistory().then(({ data }) => setItems(data)).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load submission history")); }, []);
  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Submission History</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="table-wrap">
<table className="data-table">
<thead><tr><th>Question</th><th>Language</th><th>Submitted</th><th>Status</th></tr></thead>
<tbody>
{error && <tr><td colSpan="4" className="error-message">{error}</td></tr>}
{!error && items.length === 0 && <tr><td colSpan="4">No submissions yet. Save code from the compiler to see it here.</td></tr>}
{items.map((item) => <tr key={item._id}><td>{item.question?.title || item.questionTitle || "Code practice"}</td><td>{item.language}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td><td><span className={`status ${item.status === "accepted" ? "status-success" : item.status === "failed" ? "status-danger" : "status-warning"}`}>{item.status}</span></td></tr>)}
</tbody>
</table>
</div>

        </div>
      </main>

    </div>
  );
}
export default SubmissionHistory;
