import React from "react";
import Navbar from "../components/Navbar";

function About() {
  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>About IntervueX</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="card-grid">
  <div className="card">
    <h3>Who We Are</h3>
    <p>IntervueX is a career platform designed to connect job seekers with opportunities while providing interview and coding preparation tools.</p>
  </div>
  <div className="card">
    <h3>Our Mission</h3>
    <p>Help candidates discover suitable jobs, improve their skills and approach interviews with confidence.</p>
  </div>
  <div className="card">
    <h3>Our Vision</h3>
    <p>Create a simple ecosystem where candidates, recruiters and companies can connect efficiently.</p>
  </div>
</div>
<section className="section">
  <div className="section-title"><h2>Why Choose IntervueX?</h2></div>
  <div className="card-grid">
    <div className="card"><h3>Job Discovery</h3><p>Search and compare career opportunities in one place.</p></div>
    <div className="card"><h3>Interview Ready</h3><p>Practice technical and HR questions before your interview.</p></div>
    <div className="card"><h3>Skill Building</h3><p>Improve coding and assessment performance through practice.</p></div>
  </div>
</section>

        </div>
      </main>

    </div>
  );
}
export default About;
