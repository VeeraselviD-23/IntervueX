import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getInterviewCategories } from "../../services/interviewService";

const categoryDescriptions = {
  HR: "Common HR questions, self-introduction and behavioral questions.",
  Technical: "Programming, web development, databases and software engineering questions.",
  Frontend: "HTML, CSS, JavaScript and React interview preparation.",
  Backend: "Node.js, APIs, databases and server-side development questions.",
  SQL: "Queries, joins, normalization and database concepts.",
};

function InterviewCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getInterviewCategories()
      .then(({ data }) => setCategories(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load interview categories"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Interview Categories</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

{loading && <p>Loading interview categories...</p>}
{error && <p className="error-message">{error}</p>}
{!loading && !error && categories.length === 0 && <p>No interview categories are available yet.</p>}
<div className="card-grid">
  {categories.map((category) => (
    <div className="card" key={category}>
      <h3>{category} Interview</h3>
      <p>{categoryDescriptions[category] || `Practice ${category} interview questions and review answer guides.`}</p>
      <Link className="button button-outline" to={`/interview/questions?category=${encodeURIComponent(category)}`}>Practice</Link>
    </div>
  ))}
</div>

        </div>
      </main>

    </div>
  );
}
export default InterviewCategories;
