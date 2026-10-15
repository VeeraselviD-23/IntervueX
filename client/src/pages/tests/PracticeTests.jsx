import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getPracticeTests } from "../../services/testService";

function PracticeTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPracticeTests()
      .then(({ data }) => setTests(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load practice tests"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Practice Tests</h1>
          <p>Choose a timed assessment and track your score.</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

{loading && <p>Loading practice tests...</p>}
{error && <p className="error-message">{error}</p>}
{!loading && !error && tests.length === 0 && <p>No published tests are available yet.</p>}
<div className="card-grid">
  {tests.map((test) => <div className="card" key={test._id}><h3>{test.title}</h3><p>{test.questions?.length || 0} questions | {test.durationMinutes || 30} minutes</p><p>{test.description || "Practice your skills with this timed assessment."}</p><Link className="button button-primary" to={`/tests/${test._id}`}>Start Test</Link></div>)}
</div>

        </div>
      </main>

    </div>
  );
}
export default PracticeTests;
