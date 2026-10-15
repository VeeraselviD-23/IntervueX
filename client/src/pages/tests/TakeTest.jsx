import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getTestById, submitTest } from "../../services/testService";

function TakeTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submittedRef = useRef(false);

  useEffect(() => {
    getTestById(testId)
      .then(({ data }) => {
        setTest(data);
        setSecondsLeft((data.durationMinutes || 30) * 60);
      })
      .catch((requestError) => setError(requestError.response?.data?.message || "Unable to load this test"))
      .finally(() => setLoading(false));
  }, [testId]);

  const finishTest = async () => {
    if (submittedRef.current || !test) return;
    submittedRef.current = true;
    setSubmitting(true);
    try {
      const { data } = await submitTest(testId, { answers });
      navigate(`/tests/${data.result._id}/result`, { replace: true });
    } catch (requestError) {
      submittedRef.current = false;
      setError(requestError.response?.data?.message || "Unable to submit test");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!test || submittedRef.current || secondsLeft <= 0) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(value - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, [test, secondsLeft]);

  useEffect(() => {
    if (test && secondsLeft === 0 && !submittedRef.current) finishTest();
  }, [test, secondsLeft]);

  const currentQuestion = test?.questions?.[currentIndex];
  const formattedTime = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;
  const updateAnswer = (value) => setAnswers((previous) => ({ ...previous, [currentQuestion._id]: value }));

  if (loading) return <div className="page"><Navbar /><main className="section"><div className="container"><p>Loading test...</p></div></main></div>;
  if (error) return <div className="page"><Navbar /><main className="section"><div className="container"><p className="error-message">{error}</p></div></main></div>;
  if (!test?.questions?.length) return <div className="page"><Navbar /><main className="section"><div className="container"><p>This test does not have any questions yet.</p></div></main></div>;

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>{test.title}</h1>
          <p>{test.description || "Answer each question before the timer ends."}</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="card">
  <div style={{display:"flex",justifyContent:"space-between",gap:"20px"}}><h2>{test.title}</h2><strong>Time: {formattedTime}</strong></div>
  <hr />
  <h3>Question {currentIndex + 1} of {test.questions.length}</h3>
  <p>{currentQuestion.question}</p>
  <div className="option-list">
    {(currentQuestion.options || []).map((option) => <label className="option" key={option}><input type="radio" name={currentQuestion._id} value={option} checked={answers[currentQuestion._id] === option} onChange={(event) => updateAnswer(event.target.value)} /> {option}</label>)}
    {(!currentQuestion.options || currentQuestion.options.length === 0) && <input className="form-control" value={answers[currentQuestion._id] || ""} onChange={(event) => updateAnswer(event.target.value)} placeholder="Type your answer" />}
  </div>
  <button className="button button-primary" type="button" style={{marginTop:"20px"}} onClick={() => currentIndex === test.questions.length - 1 ? finishTest() : setCurrentIndex((index) => index + 1)} disabled={submitting}>{submitting ? "Submitting..." : currentIndex === test.questions.length - 1 ? "Submit Test" : "Next Question"}</button>
</div>

        </div>
      </main>

    </div>
  );
}
export default TakeTest;
