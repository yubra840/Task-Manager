//src/pages/Notifications.jsx
import React, { useState, useEffect } from "react";
import "./Notifications.css";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Notifications = () => {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([]);
      const [sidebarOpen, setSidebarOpen] = useState(false);
  

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ FETCH NOTIFICATIONS FROM API
  const fetchNotifications = async () => {
    try {
      const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
      const res = await fetch(`${apiUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      // 🔥 FORMAT DATA FOR UI
      const formatted = data.map((n) => ({
        id: n.id,
        message: n.message,
        from: n.sender_name,
        avatar: n.sender_avatar || "https://i.pravatar.cc/150",
        read: n.is_read,
        type: n.type,
        referenceId: n.reference_id,
        createdAt: n.created_at
      }));

      setNotifications(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setSidebarOpen(false);
    };
  
    if (sidebarOpen) {
      window.addEventListener("scroll", handleScroll);
    }
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sidebarOpen]);

   const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  const handleFilter = (type) => {
    setFilter(type);
  };

  // ✅ MARK AS READ + REDIRECT
  const handleClick = async (notification) => {
    try {
      // 🔥 MARK AS READ IN BACKEND
      const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
      await fetch(`${apiUrl}/notifications/${notification.id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });

      // 🔥 UPDATE UI
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );

      // 🔥 REDIRECT BASED ON TYPE
      if (notification.type === "task") {
        navigate(`/tasks`);
      } else if (notification.type === "team") {
        navigate(`/teams`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ⏱️ RECENT FILTER (last 24h)
  const isRecent = (date) => {
    const now = new Date();
    const created = new Date(date);
    return now - created < 24 * 60 * 60 * 1000;
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "read") return n.read;
    if (filter === "unread") return !n.read;
    if (filter === "recent") return isRecent(n.createdAt);
    return true;
  });

  return (
    <div className="notification-page">
      {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}
            
                  {/* SIDEBAR */}
                  <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
                    <Sidebar />
                  </div>
      <div className="notification-container">
        <div className="notification-filters">
          <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </div>
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => handleFilter("all")}
          >
            All
          </button>
          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => handleFilter("read")}
          >
            Read
          </button>
          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => handleFilter("unread")}
          >
            Unread
          </button>
          <button
            className={filter === "recent" ? "active" : ""}
            onClick={() => handleFilter("recent")}
          >
            Recent
          </button>
        </div>

        <div className="notification-list">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className="notification-card"
              onClick={() => handleClick(n)}
            >
              <div className="notif-left">
                <img src={n.avatar} alt="avatar" />
              </div>

              <div className="notif-middle">
                <p className="message">{n.message}</p>
                <span className="from">From: {n.from}</span>
              </div>

              <div className="notif-right">
                {!n.read && <span className="new-badge">NEW</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
