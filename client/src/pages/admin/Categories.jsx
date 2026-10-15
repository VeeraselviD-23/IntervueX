import React from "react";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";

function Categories() {
  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Categories</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="card-grid">
  <div className="card"><h3>Job Categories</h3><p>Software Development</p><p>Design</p><p>Data & Analytics</p><Link className="button button-outline" to="/admin/jobs">Manage</Link></div>
  <div className="card"><h3>Interview Categories</h3><p>HR</p><p>Technical</p><p>Frontend</p><p>Backend</p><Link className="button button-outline" to="/admin/interview-questions">Manage</Link></div>
  <div className="card"><h3>Coding Categories</h3><p>Arrays</p><p>Strings</p><p>Algorithms</p><p>Databases</p><Link className="button button-outline" to="/admin/compiler-questions">Manage</Link></div>
</div>

        </div>
      </main>

    </div>
  );
}
export default Categories;
