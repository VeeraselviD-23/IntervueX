import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getTestResult } from "../../services/testService";

function TestResult() {
  const { testId: resultId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getTestResult(resultId).then(({ data }) => setResult(data)).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load test result"));
  }, [resultId]);

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Test Result</h1>
          <p>Review your score and keep practicing.</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

{error && <p className="error-message">{error}</p>}
{!error && !result && <p>Loading result...</p>}
{result && <div className="card" style={{textAlign:"center"}}>
  <h2>{result.test?.title || "Practice Test"}</h2>
  <h1 style={{fontSize:"60px",color:"#b51224"}}>{result.percentage}%</h1>
  <p>{result.percentage >= 80 ? "Excellent work. Keep practicing to improve your score." : "Keep practicing and review the topics you missed."}</p>
  <div className="stats-grid">
    <div className="stat-card"><h3>{result.score}</h3><p>Correct</p></div>
    <div className="stat-card"><h3>{result.total - result.score}</h3><p>Wrong</p></div>
    <div className="stat-card"><h3>{result.total}</h3><p>Questions</p></div>
    <div className="stat-card"><h3>{result.percentage}%</h3><p>Score</p></div>
  </div>
  <Link className="button button-primary" to="/tests">Back To Tests</Link>
</div>}

        </div>
      </main>

    </div>
  );
}
export default TestResult;
