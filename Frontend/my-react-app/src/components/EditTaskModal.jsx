import React, { useState, useEffect } from "react";
import "./NewTaskModal.css";
import CloseIcon from "@mui/icons-material/Close";
import API from "../services/api";

export default function EditTaskModal({ task, closeModal, refreshTasks }) {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.due_date?.split("T")[0],
      priority: task.priority,
      status: task.status,
    });
  }, [task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ UPDATE TASK
  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    refreshTasks();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h3>Edit Task</h3>
          <CloseIcon onClick={closeModal} className="close-icon" />
        </div>

        <form onSubmit={handleSubmit}>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <button type="submit" className="create-btn">
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
}