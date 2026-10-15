import React,{useEffect,useState} from "react";
import Sidebar from "../../components/Sidebar";
import {getAdminDashboard} from "../../services/adminService";

function AdminDashboard(){
 const [stats,setStats]=useState(null); const [error,setError]=useState("");
 useEffect(()=>{getAdminDashboard().then(r=>setStats(r.data)).catch(e=>setError(e.response?.data?.message||"Unable to load dashboard"));},[]);
 const cards=[
   ['Total Users',stats?.users,'bi-people'],
   ['Job Seekers',stats?.jobseekers,'bi-person-check'],
   ['Recruiters',stats?.recruiters,'bi-person-badge'],
   ['Total Jobs',stats?.jobs,'bi-briefcase'],
   ['Pending Approval',stats?.pendingJobs,'bi-hourglass-split'],
   ['Companies',stats?.companies,'bi-building'],
   ['Applications',stats?.applications,'bi-file-earmark-text'],
   ['Practice Tests',stats?.tests,'bi-card-checklist']
 ];
 return <div className="dashboard-layout"><Sidebar type="admin"/><main className="dashboard-main"><div className="dashboard-header"><div><span className="eyebrow">Control centre</span><h1>Admin Dashboard</h1><p>Manage and monitor the complete IntervueX platform.</p></div></div>{error&&<div className="error-message">{error}</div>}<div className="dashboard-cards">{cards.map(([label,value,icon])=><div className="dashboard-card" key={label} style={label === 'Pending Approval' && value > 0 ? {borderLeft: '4px solid #f59e0b', background: '#fffbeb'} : {}}><span><i className={`bi ${icon}`} aria-hidden="true"></i> {label}</span><strong style={label === 'Pending Approval' && value > 0 ? {color: '#d97706'} : {}}>{value??"—"}</strong></div>)}</div><div className="dashboard-content-grid"><div className="dashboard-panel card"><div className="panel-heading"><div><span className="eyebrow">Latest activity</span><h3>Recent applications</h3></div><a href="/admin/applications">Manage</a></div>{stats?.recentApplications?.map((application)=><div className="activity-row" key={application._id}><span className="activity-icon"><i className="bi bi-file-earmark-text" aria-hidden="true"></i></span><div><strong>{application.candidate?.name || "Candidate"}</strong><small>{application.job?.title || "Application"}</small></div><span className="status status-warning">{application.status}</span></div>)}</div><div className="dashboard-panel card"><div className="panel-heading"><div><span className="eyebrow">Platform health</span><h3>Content library</h3></div></div><div className="health-row"><span>Practice tests</span><strong>{stats?.tests ?? "—"}</strong></div><div className="health-row"><span>Interview questions</span><strong>{stats?.interviews ?? "—"}</strong></div><div className="health-row"><span>Coding questions</span><strong>{stats?.codingQuestions ?? "—"}</strong></div></div></div><div className="dashboard-section-heading"><div><span className="eyebrow">Platform activity</span><h2>Recent job posts</h2></div><a href="/admin/jobs">View all jobs</a></div><div className="mini-grid">{stats?.recentJobs?.map((job)=><div className="mini-card" key={job._id}><span className={`status status-${job.status === "active" || job.status === "approved" ? "success" : job.status === "rejected" ? "danger" : "warning"}`}>{job.status}</span><strong>{job.title}</strong><small>{job.company?.name || job.company || "Company not specified"}</small></div>)}</div></main></div>;

}
export default AdminDashboard;
