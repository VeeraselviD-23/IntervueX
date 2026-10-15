import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getMyCompany, saveMyCompany } from "../../services/companyService";
const initialForm = { name: "", industry: "", email: "", website: "", location: "", description: "" };
function CompanyProfile() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  useEffect(() => {
    getMyCompany()
      .then(({ data }) => {
        const company = data?.company || data;
        if (company) setForm({ ...initialForm, ...company });
      })
      .catch((requestError) => {
        if (requestError.response?.status !== 404) setError("Unable to load company profile. You can still create one below.");
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);
    try {
      const { data } = await saveMyCompany(form);
      setForm({ ...initialForm, ...(data?.company || data) });
      setMessage("Company profile saved. New job listings can now use these details.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save company profile.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="page"><BackButton variant="page" /><section className="page-heading"><div className="container"><h1>Company Profile</h1><p>Complete these details so candidates can recognize your organization on job listings.</p></div></section><main className="section"><div className="container"><form className="form-card" onSubmit={submit}>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}{loading ? <p>Loading company profile…</p> : <><div className="form-group"><label htmlFor="company-name">Company Name</label><input id="company-name" name="name" className="form-control" placeholder="e.g. Acme Technologies" value={form.name} onChange={updateField} required /></div><div className="form-group"><label htmlFor="company-industry">Industry</label><input id="company-industry" name="industry" className="form-control" placeholder="e.g. Information Technology" value={form.industry} onChange={updateField} /></div><div className="form-group"><label htmlFor="company-email">Company Email</label><input id="company-email" name="email" className="form-control" type="email" placeholder="e.g. careers@acme.com" value={form.email} onChange={updateField} /></div><div className="form-group"><label htmlFor="company-website">Website</label><input id="company-website" name="website" className="form-control" type="url" placeholder="e.g. https://www.acme.com" value={form.website} onChange={updateField} /></div><div className="form-group"><label htmlFor="company-location">Location</label><input id="company-location" name="location" className="form-control" placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={updateField} /></div><div className="form-group"><label htmlFor="company-description">About Company</label><textarea id="company-description" name="description" className="form-control" rows="6" placeholder="Describe your company, culture, and the opportunities you offer." value={form.description} onChange={updateField} /></div><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Company Profile"}</button></>}</form></div></main></div>;
}
export default CompanyProfile;
