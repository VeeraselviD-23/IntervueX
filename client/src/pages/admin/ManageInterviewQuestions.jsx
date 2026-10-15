import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { createInterviewQuestion, deleteInterviewQuestion, getInterviewQuestions } from "../../services/interviewService";

const initialForm = { question: "", category: "HR", difficulty: "Easy", answerGuide: "", status: "published" };
const hrQuestionSet = [
  ["Tell me about yourself.", "Give a concise professional introduction: your background, relevant skills, a key achievement, and why this role interests you."],
  ["Why do you want to work for this company?", "Show that you researched the company and connect its mission, product, or culture to your career goals."],
  ["What are your greatest strengths?", "Choose strengths relevant to the role and support each with a brief, specific example."],
  ["What is one area you are working to improve?", "Name a genuine development area, explain the action you are taking, and show measurable progress."],
  ["Describe a challenging situation at work and how you handled it.", "Use the STAR method: Situation, Task, Action, Result. Focus on your decisions and the positive outcome."],
  ["Where do you see yourself in five years?", "Describe realistic growth goals that align with the role, team, and company rather than an unrelated job title."],
  ["Why should we hire you?", "Summarize your most relevant skills, evidence of impact, and the value you can bring to the team."],
  ["How do you handle pressure and tight deadlines?", "Describe how you prioritize, communicate risks early, and use an example of delivering quality work under pressure."],
  ["Tell me about a time you worked successfully in a team.", "Use a specific example that highlights collaboration, communication, and the shared result."],
  ["Do you have any questions for us?", "Ask thoughtful questions about team goals, success measures, growth opportunities, or the interviewer's experience."]
];

function ManageInterviewQuestions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const loadQuestions = () => getInterviewQuestions().then(({ data }) => setQuestions(Array.isArray(data) ? data.filter((item) => item.category !== "HTML") : [])).catch(() => setError("Unable to load interview questions."));
  useEffect(() => { loadQuestions(); }, []);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setError(""); try { await createInterviewQuestion(form); setForm(initialForm); setMessage("Interview question published."); loadQuestions(); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save the question."); } };
  const remove = async (id) => { if (!window.confirm("Delete this interview question?")) return; try { await deleteInterviewQuestion(id); setMessage("Interview question deleted."); loadQuestions(); } catch { setError("Unable to delete the question."); } };
  const addHrQuestions = async () => { setError(""); setMessage(""); const existing = new Set(questions.map((item) => item.question)); const missing = hrQuestionSet.filter(([question]) => !existing.has(question)); if (!missing.length) { setMessage("The HR interview questions are already available."); return; } try { await Promise.all(missing.map(([question, answerGuide]) => createInterviewQuestion({ question, answerGuide, category: "HR", difficulty: "Easy", status: "published" }))); setMessage(`${missing.length} HR interview questions published.`); loadQuestions(); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to add the HR questions."); } };
  return <div className="page"><BackButton variant="page" /><section className="page-heading"><div className="container"><h1>Interview Questions</h1><p>Create preparation questions for job seekers.</p></div></section><main className="section"><div className="container">
    <div className="card" style={{ marginBottom: "20px" }}><h2>Ready-made HR questions</h2><p>Add 10 common HR interview questions with preparation guides.</p><button className="button button-outline" type="button" onClick={addHrQuestions}>Add HR Interview Questions</button></div>
    <form className="form-card" onSubmit={submit}><h2>Add Interview Question</h2>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}<div className="form-group"><label>Question</label><textarea className="form-control" name="question" value={form.question} onChange={update} rows="3" placeholder="e.g. Tell me about a challenging project you completed." required /></div><div className="form-row"><div className="form-group"><label>Category</label><input className="form-control" name="category" value={form.category} onChange={update} placeholder="e.g. HR, Technical, React" required /></div><div className="form-group"><label>Difficulty</label><select className="form-control" name="difficulty" value={form.difficulty} onChange={update}><option>Easy</option><option>Medium</option><option>Hard</option></select></div></div><div className="form-group"><label>Answer Guide</label><textarea className="form-control" name="answerGuide" value={form.answerGuide} onChange={update} rows="3" placeholder="Add the key points a strong answer should cover." /></div><button className="button button-primary" type="submit">Publish Question</button></form>
    <div className="table-wrap"><table className="data-table"><thead><tr><th>Question</th><th>Category</th><th>Difficulty</th><th>Status</th><th>Action</th></tr></thead><tbody>{questions.length === 0 && <tr><td colSpan="5">No interview questions have been added.</td></tr>}{questions.map((item) => <tr key={item._id}><td>{item.question}</td><td>{item.category || "General"}</td><td>{item.difficulty || "-"}</td><td>{item.status || "published"}</td><td><button className="button button-outline" type="button" onClick={() => remove(item._id)}>Delete</button></td></tr>)}</tbody></table></div>
  </div></main></div>;
}
export default ManageInterviewQuestions;
