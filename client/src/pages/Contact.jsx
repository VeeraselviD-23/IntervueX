import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sending, setSending] = useState(false);
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });
    try {
      const { data } = await api.post("/contact", form);
      setStatus({ type: "success", message: data.message });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({ type: "error", message: error.response?.data?.message || "Unable to send your message. Please try again." });
    } finally { setSending(false); }
  };
  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Contact IntervueX</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="profile-grid">
  <div className="card">
    <h3>Get In Touch</h3>
    <p>Email: support@intervuex.com</p>
    <p>Phone: +91 98765 43210</p>
    <p>Support: Monday to Friday, 9:00 AM to 6:00 PM</p>
  </div>
  <form className="form-card" onSubmit={submit}>
    <h3>Send Us A Message</h3>
    {status.message && <div className={`${status.type}-message`}>{status.message}</div>}
    <div className="form-group"><label>Full Name</label><input required name="name" value={form.name} onChange={updateField} className="form-control" placeholder="Enter your name" /></div>
    <div className="form-group"><label>Email Address</label><input required name="email" value={form.email} onChange={updateField} className="form-control" type="email" placeholder="Enter your email" /></div>
    <div className="form-group"><label>Subject</label><input required name="subject" value={form.subject} onChange={updateField} className="form-control" placeholder="Enter subject" /></div>
    <div className="form-group"><label>Message</label><textarea required name="message" value={form.message} onChange={updateField} className="form-control" rows="6" placeholder="Write your message"></textarea></div>
    <button className="button button-primary" type="submit" disabled={sending}>{sending ? "Sending..." : "Send Message"}</button>
  </form>
</div>

        </div>
      </main>

    </div>
  );
}
export default Contact;




























