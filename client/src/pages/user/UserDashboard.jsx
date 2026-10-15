import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import JobCard from "../../components/JobCard";
import { getJobs } from "../../services/jobService";
import { getNotifications } from "../../services/notificationService";
import { getUserDashboard } from "../../services/applicationService";

function UserDashboard() {
  const [jobs, setJobs] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    getJobs({ status: "active" }).then(({ data }) => setJobs(Array.isArray(data) ? data.slice(0, 3) : [])).catch(() => setJobs([]));
    getNotifications().then(({ data }) => setUnreadNotifications(Array.isArray(data) ? data.filter((notification) => !notification.read).length : 0)).catch(() => setUnreadNotifications(0));
    getUserDashboard().then(({ data }) => setSummary(data)).catch(() => setSummary(null));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header"><div><h1>Welcome to IntervueX</h1><p>Track your career progress and applications.</p></div></div>
        <div className="dashboard-cards">
          <div className="dashboard-card"><span>Profile Completion</span><strong>{summary?.profileCompletion ?? "—"}%</strong></div>
          <div className="dashboard-card"><span>Applications</span><strong>{summary?.applicationsCount ?? "—"}</strong></div>
          <div className="dashboard-card"><span>Active Jobs</span><strong>{summary?.activeJobs ?? "—"}</strong></div>
          <div className="dashboard-card"><span><i className="bi bi-bell-fill" aria-hidden="true"></i> Notifications</span><strong>{unreadNotifications}</strong></div>
        </div>
        <div className="dashboard-content-grid">
          <div className="card dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">Your next step</span><h3>Complete your profile</h3></div><strong>{summary?.profileCompletion ?? 0}%</strong></div><div className="progress"><span style={{width:`${summary?.profileCompletion ?? 0}%`}}></span></div><p>Add your skills, education and resume to improve your match quality.</p></div>
          <div className="card dashboard-panel dashboard-tip"><span className="tip-icon"><i className="bi bi-lightbulb" aria-hidden="true"></i></span><div><span className="eyebrow">Career tip</span><h3>Keep your profile current</h3><p>A complete profile and up-to-date resume help recruiters review your application faster.</p></div></div>
        </div>
        <div className="dashboard-section-heading"><div><span className="eyebrow">Your activity</span><h2>Recent applications</h2></div><a href="/user/applications">View all</a></div>
        <div className="activity-list dashboard-panel card">
          {(summary?.recentApplications || []).length === 0 && <p>No applications yet. Your next opportunity is waiting.</p>}
          {summary?.recentApplications?.map((application) => <div className="activity-row" key={application._id}><span className="activity-icon"><i className="bi bi-briefcase" aria-hidden="true"></i></span><div><strong>{application.job?.title || "Job application"}</strong><small>{application.job?.location || "Application submitted"}</small></div><span className={`status status-${application.status === "rejected" ? "danger" : application.status === "shortlisted" ? "success" : "warning"}`}>{application.status}</span></div>)}
        </div>
        <div className="dashboard-section-heading"><div><span className="eyebrow">Recommended for you</span><h2>Recent jobs</h2></div><a href="/jobs">Browse jobs</a></div>
        <div className="job-grid">
          {jobs.length === 0 && <p>No active jobs are available yet.</p>}
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              id={job._id}
              title={job.title}
              company={job.company}
              location={job.location}
              jobType={job.jobType || job.type}
              salary={job.salary}
              skills={job.skills}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
export default UserDashboard;
