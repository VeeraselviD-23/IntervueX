import React from "react";

function SearchBar({
  keyword = "",
  setKeyword = () => {},
  company = "",
  setCompany = () => {},
  location = "",
  setLocation = () => {},
  onSearch = () => {},
  onReset = () => {}
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form
      className="search-box"
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        background: "#fff",
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}
    >
      <input
        className="form-control"
        type="text"
        placeholder="Job title, skill or keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{ flex: "2 1 200px" }}
      />
      <input
        className="form-control"
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        style={{ flex: "1.5 1 150px" }}
      />
      <input
        className="form-control"
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ flex: "1 1 130px" }}
      />
      <button className="button button-primary" type="submit">
        Search Jobs
      </button>
      {(keyword || company || location) && (
        <button
          type="button"
          className="button button-outline"
          onClick={onReset}
          style={{ whiteSpace: "nowrap" }}
        >
          Clear
        </button>
      )}
    </form>
  );
}

export default SearchBar;
