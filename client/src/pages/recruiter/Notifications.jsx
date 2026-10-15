import React, { useEffect, useState } from "react";
import BackButton from "../../components/BackButton";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notificationService";
function Notifications() {
  const [notifications, setNotifications] = useState([]), [error, setError] = useState("");
  const load = () => getNotifications().then(({ data }) => setNotifications(Array.isArray(data) ? data : [])).catch(() => setError("Unable to load notifications."));
  useEffect(() => { load(); }, []);
  const markRead = async (id) => { await markNotificationRead(id); load(); };
  return <div className="page"><BackButton variant="page" /><section className="page-heading"><div className="container"><h1>Recruiter Notifications</h1><p>Updates about job approval and candidate applications.</p></div></section><main className="section"><div className="container">{notifications.some((item) => !item.read) && <button className="button button-outline" type="button" onClick={() => markAllNotificationsRead().then(load)}>Mark all as read</button>}{error && <p className="error-message">{error}</p>}<div className="notice-list">{notifications.length === 0 && !error && <p>No notifications yet.</p>}{notifications.map((item) => <div className="notice" key={item._id}><strong>{item.title}</strong><p>{item.message}</p><small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</small>{!item.read && <button className="button button-outline" type="button" onClick={() => markRead(item._id)}>Mark as read</button>}</div>)}</div></div></main></div>;
}
export default Notifications;
