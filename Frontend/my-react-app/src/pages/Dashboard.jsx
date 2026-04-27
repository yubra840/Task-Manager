import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";
import API from "../services/api";
import MyTasks from "./Tasks";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    inProgress: 0,
    completed: 0,
    pending: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(
          "/dashboard/stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchStats();
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

  // Close sidebar when clicking outside
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="dashboard-page">

      {/* OVERLAY (click outside closes sidebar) */}
      {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}

      {/* SIDEBAR */}
      <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className="dashboard-container">

        {/* HEADER */}
        <div className="header">

          {/* HAMBURGER ICON (mobile only) */}
          <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </div>

          <div className="welcome">
            Welcome, {user?.name || "User"}!
          </div>

        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card total">
            <h3>Total Tasks</h3>
            <p>{stats.totalTasks}</p>
          </div>

          <div className="stat-card taskprogress">
            <h3>In Progress</h3>
            <p>{stats.inProgress || 0}</p>
          </div>

          <div className="stat-card taskcompleted">
            <h3>Completed</h3>
            <p>{stats.completed || 0}</p>
          </div>

          <div className="stat-card taskpending">
            <h3>Pending</h3>
            <p>{stats.pending || 0}</p>
          </div>

        </div>

        <div className="table-section">
          <MyTasks />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;