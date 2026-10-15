import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getQuestionById } from "../../services/interviewService";

function QuestionDetails() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getQuestionById(questionId)
      .then(({ data }) => setQuestion(data))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load this interview question"));
  }, [questionId]);

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Interview Question Details</h1>
          <p>Build an interview-ready answer from the question and guide.</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

{error && <p className="error-message">{error}</p>}
{!error && !question && <p>Loading question...</p>}
{question && <div className="card">
  <span className="badge">{question.category || "Interview"}{question.difficulty ? ` | ${question.difficulty}` : ""}</span>
  <h1>{question.question}</h1>
  <h3>Answer Guide</h3>
  <p>{question.answerGuide || "No answer guide has been added yet."}</p>
  {question.correctAnswer && <><h3>Suggested Answer</h3><p>{question.correctAnswer}</p></>}
  <Link className="button button-outline" to={`/interview/questions${question.category ? `?category=${encodeURIComponent(question.category)}` : ""}`}>Back to Questions</Link>
</div>}

        </div>
      </main>

    </div>
  );
}
export default QuestionDetails;
