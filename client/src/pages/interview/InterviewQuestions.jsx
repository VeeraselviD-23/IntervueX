import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getInterviewQuestions } from "../../services/interviewService";

function InterviewQuestions() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getInterviewQuestions(category ? { category } : {})
      .then(({ data }) => setQuestions(Array.isArray(data) ? data.filter((item) => item.category !== "HTML") : []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load interview questions"))
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>{category ? `${category} Interview Questions` : "Interview Questions"}</h1>
          <p>Review real questions and prepare answers by topic and difficulty.</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

{loading && <p>Loading questions...</p>}
{error && <p className="error-message">{error}</p>}
{!loading && !error && questions.length === 0 && <p>No questions are available for this category yet.</p>}
<div className="job-grid">
  {questions.map((item) => (
    <article className="question-card" key={item._id}>
      <span className="badge">{item.category || "Interview"} {item.difficulty ? `| ${item.difficulty}` : ""}</span>
      <h3>{item.question}</h3>
      <p>{item.answerGuide || "Review the answer guide to prepare a clear response."}</p>
      <Link className="button button-primary answer-guide-button" to={`/interview/questions/${item._id}`}><i className="bi bi-book-open" aria-hidden="true"></i> View Answer Guide <i className="bi bi-arrow-right" aria-hidden="true"></i></Link>
    </article>
  ))}
</div>

        </div>
      </main>

    </div>
  );
}
export default InterviewQuestions;
