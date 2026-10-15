import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import { getCompanies, getMyCompany } from "../../services/companyService";
import { createJob, getMyJobs } from "../../services/jobService";

const sampleJobs = [
  { title: "Frontend Developer", location: "Bangalore, India", jobType: "Full Time", experience: "1 - 3 Years", salary: "₹6 - ₹10 LPA", skills: ["React", "JavaScript", "CSS", "REST APIs"], description: "Build responsive web experiences and collaborate with product, design, and backend teams.", requirements: ["Experience with React and modern JavaScript", "Strong HTML and CSS fundamentals", "Good problem-solving skills"] },
  { title: "Backend Node.js Developer", location: "Chennai, India", jobType: "Full Time", experience: "2 - 4 Years", salary: "₹8 - ₹14 LPA", skills: ["Node.js", "Express", "MongoDB", "REST APIs"], description: "Develop secure, scalable APIs and maintain database-backed platform services.", requirements: ["Experience with Node.js and Express", "Working knowledge of MongoDB", "Understanding of API security"] },
  { title: "UI/UX Design Intern", location: "Remote", jobType: "Internship", experience: "Fresher", salary: "₹15,000 per month", skills: ["Figma", "Wireframing", "Prototyping", "User Research"], description: "Support the design team in creating intuitive user flows, wireframes, and polished interface designs.", requirements: ["Portfolio demonstrating design work", "Familiarity with Figma", "Interest in user-centered design"] },
  { title: "QA Automation Engineer", location: "Hyderabad, India", jobType: "Full Time", experience: "1 - 3 Years", salary: "₹7 - ₹11 LPA", skills: ["Selenium", "JavaScript", "API Testing", "Git"], description: "Create automated tests and help ensure reliable, high-quality product releases.", requirements: ["Experience with manual or automated testing", "Knowledge of test-case design", "Strong attention to detail"] }
];

function PostJob() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full Time",
    experience: "",
    salary: "",
    skills: "",
    description: "",
    requirements: "",
    deadline: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingSamples, setAddingSamples] = useState(false);

  useEffect(() => {
    getCompanies()
      .then(({ data }) => setCompanies(Array.isArray(data) ? data : []))
      .catch(() => {});

    getMyCompany()
      .then(({ data }) => {
        const company = data?.company || data;
        if (company?.name) {
          setForm((current) => ({
            ...current,
            company: current.company || company.name,
            location: current.location || company.location || ""
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event, submitStatus = "pending") => {
    if (event) event.preventDefault();
    setError("");
    setMessage("");

    if (!form.title || !form.company || !form.location || !form.description) {
      setError("Please fill in all required fields (Title, Company, Location, Description).");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        jobType: form.jobType,
        experience: form.experience.trim() || "Fresher / Any",
        salary: form.salary.trim() || "Not disclosed",
        skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        description: form.description.trim(),
        requirements: form.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
        deadline: form.deadline || null,
        status: submitStatus
      };

      await createJob(payload);

      if (submitStatus === "pending") {
        setMessage("Job submitted for Admin approval! Once reviewed and approved, it will be visible to jobseekers.");
      } else {
        setMessage("Job saved as Draft! You can view and submit it later from My Jobs.");
      }

      setTimeout(() => navigate("/recruiter/jobs"), 1500);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save job posting");
    } finally {
      setSaving(false);
    }
  };

  const postSampleJobs = async () => {
    setAddingSamples(true);
    setError("");
    setMessage("");
    try {
      const { data: existingJobs } = await getMyJobs();
      const existingTitles = new Set((existingJobs || []).map((job) => job.title));
      const missingJobs = sampleJobs.filter((job) => !existingTitles.has(job.title));
      if (!missingJobs.length) {
        setMessage("All four sample jobs have already been submitted for approval.");
        return;
      }
      const company = form.company.trim() || "IntervueX Technologies";
      const deadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      await Promise.all(missingJobs.map((job) => createJob({ ...job, company, deadline, status: "pending" })));
      setMessage(`${missingJobs.length} sample job${missingJobs.length === 1 ? "" : "s"} submitted for Admin approval.`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit the sample jobs for approval.");
    } finally {
      setAddingSamples(false);
    }
  };

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Post A New Job</h1>
          <p>Create a job listing on IntervueX to find top talent</p>
        </div>
      </section>

      <main className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          <div className="card" style={{ marginBottom: "20px" }}>
            <h2>Sample job postings</h2>
            <p>Submit four sample jobs—Frontend Developer, Backend Node.js Developer, UI/UX Design Intern, and QA Automation Engineer—for admin approval.</p>
            <button className="button button-outline" type="button" onClick={postSampleJobs} disabled={addingSamples}>{addingSamples ? "Submitting sample jobs..." : "Post 4 Sample Jobs for Approval"}</button>
          </div>
          <form className="form-card" onSubmit={(e) => handleSubmit(e, "pending")}>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Job Title *</label>
              <input
                required
                name="title"
                className="form-control"
                placeholder="e.g. Senior Frontend Developer"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  required
                  name="company"
                  list="companies-list"
                  className="form-control"
                  placeholder="e.g. Google, TechNova Solutions"
                  value={form.company}
                  onChange={handleChange}
                />
                <small style={{ color: "#6b7280" }}>Filled automatically from your company profile when available.</small>
                <datalist id="companies-list">
                  {companies.map((c) => (
                    <option key={c._id} value={c.name} />
                  ))}
                </datalist>
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  required
                  name="location"
                  className="form-control"
                  placeholder="e.g. Chennai, Remote, Bangalore"
                  value={form.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              <div className="form-group">
                <label>Job Type</label>
                <select name="jobType" className="form-control" value={form.jobType} onChange={handleChange}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Remote</option>
                  <option>Contract</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <input
                  name="experience"
                  className="form-control"
                  placeholder="e.g. 0 - 2 Years, 3+ Years"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Salary Range</label>
                <input
                  name="salary"
                  className="form-control"
                  placeholder="e.g. ₹6 - ₹10 LPA"
                  value={form.salary}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="deadline"
                className="form-control"
                value={form.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Required Skills (comma separated)</label>
              <input
                name="skills"
                className="form-control"
                placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                value={form.skills}
                onChange={handleChange}
              />
              <small style={{ color: "#6b7280" }}>Separate multiple skills with commas.</small>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                required
                name="description"
                className="form-control"
                rows="6"
                placeholder="Detailed description of the role, responsibilities, and team..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Requirements & Qualifications (one per line)</label>
              <textarea
                name="requirements"
                className="form-control"
                rows="4"
                placeholder="Bachelor's degree in CS or equivalent&#10;Proficiency in React.js and REST APIs&#10;Good problem-solving and communication skills"
                value={form.requirements}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
              <button
                className="button button-primary"
                type="submit"
                disabled={saving}
                style={{ padding: "12px 24px", fontWeight: "bold" }}
              >
                {saving ? "Submitting..." : "Submit for Admin Approval"}
              </button>

              <button
                type="button"
                className="button button-outline"
                disabled={saving}
                onClick={(e) => handleSubmit(e, "draft")}
                style={{ padding: "12px 20px" }}
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default PostJob;
