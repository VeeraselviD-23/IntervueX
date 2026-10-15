import React from "react";

function Filter({
  jobType = "All Types",
  setJobType = () => {},
  experience = "Any Experience",
  setExperience = () => {},
  salary = "Any Salary",
  setSalary = () => {},
  sort = "latest",
  setSort = () => {},
  onReset = () => {}
}) {
  return (
    <div className="card" style={{ height: "fit-content", minWidth: "250px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ margin: 0 }}>Filter Jobs</h3>
        <button
          type="button"
          onClick={onReset}
          style={{
            background: "none",
            border: "none",
            color: "#4f46e5",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
            padding: 0
          }}
        >
          Reset All
        </button>
      </div>

      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Sort By</label>
        <select className="form-control" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="latest">Latest Jobs (Newest First)</option>
          <option value="oldest">Oldest Jobs</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Job Type</label>
        <select className="form-control" value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="All Types">All Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
          <option value="Contract">Contract</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Experience</label>
        <select className="form-control" value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="Any Experience">Any Experience</option>
          <option value="Fresher">Fresher / 0 Years</option>
          <option value="1 - 2 Years">1 - 2 Years</option>
          <option value="3 - 5 Years">3 - 5 Years</option>
          <option value="5+ Years">5+ Years</option>
        </select>
      </div>

      <div className="form-group" style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Salary Range</label>
        <select className="form-control" value={salary} onChange={(e) => setSalary(e.target.value)}>
          <option value="Any Salary">Any Salary</option>
          <option value="0 - 3 LPA">₹0 - ₹3 LPA</option>
          <option value="3 - 6 LPA">₹3 - ₹6 LPA</option>
          <option value="6 - 10 LPA">₹6 - ₹10 LPA</option>
          <option value="10+ LPA">₹10+ LPA</option>
        </select>
      </div>
    </div>
  );
}

export default Filter;
