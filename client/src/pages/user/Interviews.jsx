import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { getMyApplications } from "../../services/applicationService";

function Interviews() {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications((Array.isArray(data) ? data : []).filter((application) => application.interview?.scheduledAt || application.status === "interview")))
      .catch(() => setError("Unable to load scheduled interviews."));
  }, []);

  return (
    <div className="page">
      <BackButton variant="page" />
      <section className="page-heading"><div className="container"><h1>My Interviews</h1><p>View recruiter-scheduled interviews and joining details.</p></div></section>
      <main className="section"><div className="container"><div className="card-grid">
        {error && <p className="error-message">{error}</p>}
        {!error && applications.length === 0 && <div className="card"><i className="bi bi-calendar2-week" aria-hidden="true"></i><h3>No interviews scheduled</h3><p>When a recruiter schedules an interview, its date, format, and joining link will appear here.</p><Link className="button button-primary" to="/jobs">Find Jobs</Link></div>}
        {applications.map((application) => <article className="card" key={application._id}>
          <span className="badge"><i className="bi bi-camera-video me-2" aria-hidden="true"></i>Interview scheduled</span>
          <h3>{application.job?.title || "Interview"}</h3>
          <p>{application.job?.company?.name || application.job?.company || "Company"}</p>
          <p><i className="bi bi-calendar-event me-2" aria-hidden="true"></i>{application.interview?.scheduledAt ? new Date(application.interview.scheduledAt).toLocaleString() : "Date to be confirmed"}</p>
          <p><i className="bi bi-display me-2" aria-hidden="true"></i>{application.interview?.interviewType || "Online interview"}</p>
          {application.interview?.interviewLink && <a className="button button-primary" href={application.interview.interviewLink} target="_blank" rel="noreferrer"><i className="bi bi-box-arrow-up-right me-2" aria-hidden="true"></i>Join Interview</a>}
          <Link className="button button-outline" to={`/user/applications/${application._id}`}>View application</Link>
        </article>)}
      </div></div></main>
    </div>
  );
}

export default Interviews;
