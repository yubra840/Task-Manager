import React, { useState, useEffect } from "react";
import "./MyTasks.css";
import AddIcon from "@mui/icons-material/Add";
import NewTaskModal from "../components/NewTaskModal";
import Sidebar from "../components/Sidebar";
import TasksTable from "../components/TasksTable";
import API from "../services/api";


export default function MyTasks() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  
  
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
      const res = await fetch(`${apiUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
        console.log("TASK DATA:", data); // 👈 ADD THIS
      setTasks(data);
    };
  
    useEffect(() => {
      fetchTasks();
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


  return (
    <div className="my-tasks-page">
      {/* OVERLAY (click outside closes sidebar) */}
            {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}
      
            {/* SIDEBAR */}
            <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
              <Sidebar />
            </div>

      <div className="tasks-container">
        <div className="tasks-header">
          <div className="title-sidebar">
 {/* HAMBURGER ICON (mobile only) */}
          <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </div>

          <h2>My Tasks</h2>
          </div>
         
          <button className="new-task-btn" onClick={() => setShowModal(true)}>
            <AddIcon /> New Task
          </button>
        </div>

        {/* 🔥 Reusable Component */}
        <TasksTable />

        {showModal && (
          <NewTaskModal
            closeModal={() => setShowModal(false)}
            refreshTasks={fetchTasks}
          />
        )}
      </div>
    </div>
  );
}