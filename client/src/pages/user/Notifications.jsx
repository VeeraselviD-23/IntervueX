import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notificationService";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  const loadNotifications = () => getNotifications().then(({ data }) => setNotifications(Array.isArray(data) ? data : [])).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load notifications"));
  useEffect(() => { loadNotifications(); }, []);

  const markRead = async (notification) => {
    if (!notification.read) {
      await markNotificationRead(notification._id);
      setNotifications(notifications.map((item) => item._id === notification._id ? { ...item, read: true } : item));
    }
  };

  const markAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications(notifications.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Notifications</h1>
          <p>Stay updated about jobs, applications and interviews.</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

{error && <p className="error-message">{error}</p>}
{notifications.some((notification) => !notification.read) && <button className="button button-outline" type="button" onClick={markAllRead}><i className="bi bi-check2-all" aria-hidden="true"></i> Mark all as read</button>}
<div className="notification-list">
  {notifications.length === 0 && !error && <p>No notifications yet.</p>}
  {notifications.map((notification) => <button className={`notification-item ${notification.read ? "" : "unread"}`} type="button" key={notification._id} onClick={() => markRead(notification)}><span className="notification-icon"><i className="bi bi-bell-fill" aria-hidden="true"></i></span><span><strong className="notification-title">{notification.title}</strong><span>{notification.message}</span><small className="notification-time">{new Date(notification.createdAt).toLocaleString()}</small></span></button>)}
</div>

        </div>
      </main>

    </div>
  );
}
export default Notifications;
