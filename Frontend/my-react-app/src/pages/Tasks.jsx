import React, { useState, useEffect } from "react";
import "./MyTasks.css";
import AddIcon from "@mui/icons-material/Add";
import NewTaskModal from "../components/NewTaskModal";
import TasksTable from "../components/TasksTable";
import API from "../services/api";

export default function MyTasks() {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  
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
  return (
    <div className="my-tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <h2>My Tasks</h2>
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