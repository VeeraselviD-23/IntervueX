import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import { AuthContext } from "../context/AuthContext";

function RoleHome({ role, name }) {
  const content = {
    jobseeker: {
      badge: "YOUR CAREER WORKSPACE",
      title: `Welcome back, ${name || "Jobseeker"}`,
      description: "Complete your profile, find opportunities, and track every application in one place.",
      primary: ["Open Dashboard", "/user/dashboard", "bi-speedometer2"],
      secondary: ["Find Jobs", "/jobs", "bi-search"],
      cards: [["My Profile", "Keep your skills, education and resume ready for recruiters.", "/user/profile", "View Profile"], ["My Applications", "Follow each application from submission to final outcome.", "/user/applications", "Track Applications"], ["Interviews", "See your scheduled interviews and joining details.", "/user/interviews", "View Interviews"]]
    },
    recruiter: {
      badge: "RECRUITER WORKSPACE",
      title: `Welcome back, ${name || "Recruiter"}`,
      description: "Manage your hiring pipeline, publish roles and connect with qualified candidates.",
      primary: ["Open Dashboard", "/recruiter/dashboard", "bi-speedometer2"],
      secondary: ["Post a Job", "/recruiter/jobs/post", "bi-plus-circle"],
      cards: [["Company Profile", "Keep your company information complete and trustworthy.", "/recruiter/company", "Manage Company"], ["Manage Jobs", "Review active roles, edit job details and close filled positions.", "/recruiter/jobs", "Manage Jobs"], ["Applicants", "Review candidates and move the best applications forward.", "/recruiter/applicants", "View Applicants"]]
    },
    admin: {
      badge: "ADMIN CONTROL CENTRE",
      title: `Welcome back, ${name || "Administrator"}`,
      description: "Monitor the IntervueX platform, manage content and keep users, jobs and applications organized.",
      primary: ["Open Dashboard", "/admin/dashboard", "bi-speedometer2"],
      secondary: ["Manage Users", "/admin/users", "bi-people"],
      cards: [["Users & Recruiters", "Review registered accounts and keep role access organized.", "/admin/users", "Manage Users"], ["Jobs", "Approve, reject, edit, close or remove job listings.", "/admin/jobs", "Manage Jobs"], ["Applications", "Monitor the platform hiring pipeline.", "/admin/applications", "View Applications"]]
    }
  }[role];

  return <div className="page">
    <Navbar />
    <section className="hero">
      <div className="container hero-grid">
        <div><span className="badge"><i className="bi bi-stars me-2" aria-hidden="true"></i>{content.badge}</span><h1>{content.title}</h1><p>{content.description}</p><div className="hero-actions"><Link className="button button-primary" to={content.primary[1]}><i className={`bi ${content.primary[2]} me-2`} aria-hidden="true"></i>{content.primary[0]}</Link><Link className="button button-outline" to={content.secondary[1]}><i className={`bi ${content.secondary[2]} me-2`} aria-hidden="true"></i>{content.secondary[0]}</Link></div></div>
        <div className="hero-card"><h2>{role === "jobseeker" ? "Your next opportunity" : role === "recruiter" ? "Your hiring workspace" : "Platform overview"}</h2><p>{role === "jobseeker" ? "Profile • Jobs • Interviews • Coding" : role === "recruiter" ? "Company • Jobs • Applicants" : "Users • Jobs • Content • Reports"}</p><div className="stats-grid"><div className="stat-card"><h3><i className="bi bi-check2-circle" aria-hidden="true"></i></h3><p>Focused workflow</p></div><div className="stat-card"><h3><i className="bi bi-arrow-up-right" aria-hidden="true"></i></h3><p>Quick actions</p></div></div></div>
      </div>
    </section>
    <section className="section"><div className="container"><div className="section-title"><h2>Quick actions for your role</h2><p>Everything you need is one step away.</p></div><div className="card-grid">{content.cards.map(([title, description, path, action]) => <div className="card" key={title}><h3>{title}</h3><p>{description}</p><Link className="button button-outline" to={path}>{action}</Link></div>)}</div></div></section>
  </div>;
}

function Home() {
  const { user } = useContext(AuthContext);
  if (user?.role) return <RoleHome role={user.role} name={user.name} />;

  return (
    <div className="page">
      <Navbar />
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="badge"><i className="bi bi-stars me-2" aria-hidden="true"></i>YOUR CAREER STARTS HERE</span>
            <h1>Find Your Dream Job With <span>IntervueX</span></h1>
            <p>Find approved jobs, apply with confidence, and follow your hiring journey from application to interview result.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/jobs"><i className="bi bi-search me-2" aria-hidden="true"></i>Find Jobs</Link>
              <Link className="button button-outline" to="/register"><i className="bi bi-arrow-up-right me-2" aria-hidden="true"></i>Create Account</Link>
            </div>
          </div>
          <div className="hero-card">
            <h2>Build Your Future</h2>
            <p>Jobs • Interviews • Coding • Tests</p>
            <div className="stats-grid">
              <div className="stat-card"><h3>500+</h3><p>Jobs</p></div>
              <div className="stat-card"><h3>100+</h3><p>Companies</p></div>
              <div className="stat-card"><h3>1000+</h3><p>Candidates</p></div>
              <div className="stat-card"><h3>50+</h3><p>Practice Tests</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Search Your Next Opportunity</h2>
            <p>Find jobs based on your skills, role and preferred location.</p>
          </div>
          <div className="search-box">
            <input className="form-control" placeholder="Job title or keyword" />
            <input className="form-control" placeholder="Location" />
            <Link className="button button-primary" to="/jobs">Search Jobs</Link>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-title">
            <h2>Featured Jobs</h2>
            <p>Explore opportunities from growing companies.</p>
          </div>
          <div className="job-grid">
            <JobCard title="Frontend Developer" company="TechNova" />
            <JobCard title="MERN Stack Developer" company="CodeCraft" location="Bangalore" salary="₹6 - ₹10 LPA" />
            <JobCard title="Software Engineer" company="InnovateLabs" location="Hyderabad" salary="₹7 - ₹12 LPA" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Everything You Need For Your Career</h2>
            <p>One platform for your complete career journey.</p>
          </div>
          <div className="card-grid">
            <div className="card"><h3>Find Jobs</h3><p>Search jobs using role, location, experience and job type.</p><Link className="button button-outline" to="/jobs">Explore Jobs</Link></div>
            <div className="card"><h3>Track Applications</h3><p>Stay informed as recruiters review, shortlist, and schedule interviews.</p><Link className="button button-outline" to="/user/applications">View Applications</Link></div>
            <div className="card"><h3>Hire Great Candidates</h3><p>Recruiters can post roles, review applicants, and schedule interviews.</p><Link className="button button-outline" to="/register">Join as Recruiter</Link></div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <div className="section-title"><h2>How IntervueX Works</h2></div>
          <div className="card-grid">
            <div className="card"><h3>01. Create Account</h3><p>Build your professional profile and add your skills.</p></div>
            <div className="card"><h3>02. Find Jobs</h3><p>Explore suitable opportunities from different companies.</p></div>
            <div className="card"><h3>03. Interview</h3><p>Track your status and attend recruiter-scheduled interviews.</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container hero-card" style={{textAlign:"center"}}>
          <h2>Ready To Start Your Career?</h2>
          <p>Join IntervueX and take the next step towards your dream job.</p>
          <Link className="button button-primary" to="/register">Get Started</Link>
        </div>
      </section>
    </div>
  );
}
export default Home;
