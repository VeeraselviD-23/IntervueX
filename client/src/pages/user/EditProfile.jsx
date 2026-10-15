import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getProfile, updateProfile } from "../../services/userService";

function EditProfile() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", bio: "", location: "", education: "", skills: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getProfile().then(({ data }) => { const user = data.user || data; setForm({ ...form, ...user, skills: (user.skills || []).join(", ") }); }).catch(() => setError("Unable to load profile")); }, []);
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => { event.preventDefault(); setMessage(""); setError(""); try { const { data } = await updateProfile({ ...form, skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean) }); setForm({ ...form, ...(data.user || {}) }); setMessage(data.message || "Profile updated successfully"); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to update profile"); } };
  return (
    <div className="page">
      <BackButton variant="page" />

      <section className="page-heading">
        <div className="container">
          <h1>Edit Profile</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<form className="form-card" onSubmit={handleSubmit}>
  {message && <div className="success-message">{message}</div>}{error && <div className="error-message">{error}</div>}
  <div className="form-group"><label>Full Name</label><input className="form-control" name="name" value={form.name} onChange={handleChange} required /></div>
  <div className="form-group"><label>Email</label><input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required /></div>
  <div className="form-group"><label>Phone</label><input className="form-control" name="phone" value={form.phone} onChange={handleChange} /></div>
  <div className="form-group"><label>Location</label><input className="form-control" name="location" value={form.location} onChange={handleChange} placeholder="Enter location" /></div>
  <div className="form-group"><label>Education</label><input className="form-control" name="education" value={form.education} onChange={handleChange} placeholder="Enter education" /></div>
  <div className="form-group"><label>Skills</label><input className="form-control" name="skills" value={form.skills} onChange={handleChange} placeholder="Enter Skills" /></div>
  <div className="form-group"><label>About Me</label><textarea className="form-control" name="bio" rows="5" value={form.bio} onChange={handleChange} placeholder="Write a short professional summary"></textarea></div>
  <button className="button button-primary" type="submit">Save Profile</button>
</form>

        </div>
      </main>

    </div>
  );
}
export default EditProfile;
