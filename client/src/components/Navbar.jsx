import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getNotifications } from "../services/notificationService";
import BackButton from "./BackButton";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "jobseeker") {
      setUnreadCount(0);
      return;
    }
    getNotifications().then(({ data }) => setUnreadCount(Array.isArray(data) ? data.filter((notification) => !notification.read).length : 0)).catch(() => setUnreadCount(0));
  }, [user]);

  const dashboardPath = user?.role === "recruiter"
    ? "/recruiter/dashboard"
    : user?.role === "admin"
      ? "/admin/dashboard"
      : "/user/dashboard";
  const notificationPath = user?.role === "recruiter" ? "/recruiter/notifications" : "/user/notifications";
  const canBrowseJobs = !user || user.role === "jobseeker";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container navbar">
        <BackButton variant="navbar" />
        <Link className="logo" to="/" onClick={closeMenu} aria-label="IntervueX home"><img src="/images/intervuex logo.png" alt="IntervueX logo" /><span>IntervueX</span></Link>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Toggle navigation">
          <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"}`} aria-hidden="true"></i>
        </button>
        <nav className={`nav-links${menuOpen ? " open" : ""}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/about" onClick={closeMenu}>About</Link>
          {canBrowseJobs && <Link to="/jobs" onClick={closeMenu}>Find Jobs</Link>}
          {canBrowseJobs && <Link to="/interview" onClick={closeMenu}>Interview Prep</Link>}
          {canBrowseJobs && <Link to="/tests" onClick={closeMenu}>Tests</Link>}
          <Link to="/contact" onClick={closeMenu}>Contact</Link>
          {user ? (
            <>
              <Link to={dashboardPath} onClick={closeMenu}>Dashboard</Link>
              {user.role !== "admin" && <Link className="notification-link" to={notificationPath} onClick={closeMenu} aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}><i className="bi bi-bell-fill" aria-hidden="true"></i>{unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}</Link>}
              <button type="button" className="nav-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link className="nav-button" to="/login" onClick={closeMenu}>Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
