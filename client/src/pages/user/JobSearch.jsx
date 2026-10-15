import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import Filter from "../../components/Filter";
import JobCard from "../../components/JobCard";
import { getJobs } from "../../services/jobService";

function JobSearch() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter State
  const [keyword, setKeyword] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All Types");
  const [experience, setExperience] = useState("Any Experience");
  const [salary, setSalary] = useState("Any Salary");
  const [sort, setSort] = useState("latest");

  const fetchFilteredJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (company.trim()) params.company = company.trim();
      if (location.trim()) params.location = location.trim();
      if (jobType && jobType !== "All Types") params.jobType = jobType;
      if (experience && experience !== "Any Experience") params.experience = experience;
      if (salary && salary !== "Any Salary") params.salary = salary;
      if (sort) params.sort = sort;

      const { data } = await getJobs(params);
      setJobs(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load jobs");
    } finally {
      setLoading(false);
    }
  }, [keyword, company, location, jobType, experience, salary, sort]);

  useEffect(() => {
    fetchFilteredJobs();
  }, [fetchFilteredJobs]);

  const handleReset = () => {
    setKeyword("");
    setCompany("");
    setLocation("");
    setJobType("All Types");
    setExperience("Any Experience");
    setSalary("Any Salary");
    setSort("latest");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>Find Jobs</h1>
            <p>Explore verified openings from top recruiters and companies.</p>
          </div>
        </div>

        <SearchBar
          keyword={keyword}
          setKeyword={setKeyword}
          company={company}
          setCompany={setCompany}
          location={location}
          setLocation={setLocation}
          onSearch={fetchFilteredJobs}
          onReset={handleReset}
        />

        <div className="profile-grid" style={{ marginTop: "24px", alignItems: "flex-start" }}>
          <Filter
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            salary={salary}
            setSalary={setSalary}
            sort={sort}
            setSort={setSort}
            onReset={handleReset}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>
                {!loading && `${jobs.length} position${jobs.length === 1 ? "" : "s"} available`}
              </span>
            </div>

            {loading && <p>Searching available jobs...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && jobs.length === 0 && (
              <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
                <i className="bi bi-search" style={{ fontSize: "36px", display: "block", marginBottom: "10px" }} aria-hidden="true"></i>
                <h3>No Matching Jobs Found</h3>
                <p style={{ color: "#6b7280", maxWidth: "420px", margin: "8px auto 16px" }}>
                  Try adjusting your search criteria, keywords, or filters to discover more open roles.
                </p>
                <button type="button" className="button button-outline" onClick={handleReset}>
                  Clear All Filters
                </button>
              </div>
            )}

            <div className="job-grid" style={{ display: "grid", gap: "16px" }}>
              {!loading &&
                jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    id={job._id}
                    title={job.title}
                    company={job.company?.name || job.company || "Company not specified"}
                    location={job.location}
                    jobType={job.jobType || job.type}
                    salary={job.salary}
                    skills={job.skills}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobSearch;
