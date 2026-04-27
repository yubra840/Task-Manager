import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Sidebar.css";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import API from "../services/api";

export default function Sidebar() {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
      const res = await fetch(`${apiUrl}/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      setUnreadCount(data.count);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) return; // 🚫 don't call API without token

  fetchUnreadCount();

  const interval = setInterval(fetchUnreadCount, 10000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>TaskManager</h2>
      </div>

      <nav className="sidebar-links">
        <NavLink to="/dashboard" className="sidebar-link">
          <DashboardIcon className="icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/tasks" className="sidebar-link">
          <TaskIcon className="icon" />
          <span>My Tasks</span>
        </NavLink>

        <NavLink to="/teams" className="sidebar-link">
          <GroupsIcon className="icon" />
          <span>Teams</span>
        </NavLink>

        <NavLink to="/contacts" className="sidebar-link">
          <GroupsIcon className="icon" />
          <span>Contacts</span>
        </NavLink>

        {/* 🔔 NOTIFICATIONS WITH BADGE */}
        <NavLink to="/notifications" className="sidebar-link notif-link">
          <NotificationsIcon className="icon" />

          <span>Notifications</span>

          {unreadCount > 0 && (
            <span className="notif-badge">
              {unreadCount}
            </span>
          )}
        </NavLink>

        <NavLink to="/settings" className="sidebar-link">
          <SettingsIcon className="icon" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}