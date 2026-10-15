import React from "react";
import Navbar from "../../components/Navbar";

function CodingQuestions() {
  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Coding Questions</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="job-grid">
  <div className="question-card"><h3>Two Sum</h3><p>Find two numbers in an array that add up to a target.</p><span className="status status-success">Easy</span></div>
  <div className="question-card"><h3>Reverse a String</h3><p>Return the reverse of a given string.</p><span className="status status-success">Easy</span></div>
  <div className="question-card"><h3>Valid Parentheses</h3><p>Check whether brackets are correctly balanced.</p><span className="status status-warning">Medium</span></div>
  <div className="question-card"><h3>Maximum Subarray</h3><p>Find the contiguous subarray with the largest sum.</p><span className="status status-warning">Medium</span></div>
  <div className="question-card"><h3>Binary Search</h3><p>Search for a target value in a sorted array.</p><span className="status status-success">Easy</span></div>
  <div className="question-card"><h3>Merge Intervals</h3><p>Merge overlapping intervals efficiently.</p><span className="status status-danger">Hard</span></div>
</div>

        </div>
      </main>

    </div>
  );
}
export default CodingQuestions;
