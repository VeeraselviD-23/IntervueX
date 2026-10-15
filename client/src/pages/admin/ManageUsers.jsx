import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getAdminUsers } from "../../services/adminService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getAdminUsers()
      .then(({ data }) => {
        const uniqueUsers = (Array.isArray(data) ? data : []).filter((user, index, list) => list.findIndex((item) => String(item._id) === String(user._id) || item.email?.toLowerCase() === user.email?.toLowerCase()) === index);
        setUsers(uniqueUsers);
      })
      .catch(() => setError("Unable to load users"));
  }, []);

  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Manage Users</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="table-wrap">
<table className="data-table">
<thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead>
<tbody>
{error && <tr><td colSpan="5" className="error-message">{error}</td></tr>}
{!error && users.length === 0 && <tr><td colSpan="5">No registered users found.</td></tr>}
{users.map((user) => <tr key={user._id}><td>{user.name || "Unnamed user"}</td><td>{user.email || "No email"}</td><td>{user.role === "recruiter" ? "Recruiter" : "Job Seeker"}</td><td><span className="status status-success">Active</span></td><td>—</td></tr>)}
</tbody>
</table>
</div>

        </div>
      </main>

    </div>
  );
}
export default ManageUsers;
