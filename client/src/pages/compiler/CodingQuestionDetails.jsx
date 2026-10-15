import React from "react";
import Navbar from "../../components/Navbar";

function CodingQuestionDetails() {
  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Coding Question Details</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="card">
  <span className="badge">Easy</span>
  <h1>Two Sum</h1>
  <h3>Problem</h3>
  <p>Given an array of integers and a target value, return the indices of two numbers whose sum equals the target.</p>
  <h3>Example</h3>
  <p><strong>Input:</strong> nums = [2, 7, 11, 15], target = 9</p>
  <p><strong>Output:</strong> [0, 1]</p>
  <h3>Constraints</h3>
  <ul className="list"><li>Use the given target value.</li><li>Return the indices of the matching pair.</li><li>Assume a valid answer exists.</li></ul>
  <a className="button button-primary" href="/compiler">Open Compiler</a>
</div>

        </div>
      </main>

    </div>
  );
}
export default CodingQuestionDetails;
