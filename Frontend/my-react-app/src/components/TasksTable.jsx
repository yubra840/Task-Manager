import React, { useState, useEffect } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditTaskModal from "./EditTaskModal";
import ViewTaskModal from "./ViewTaskModal";
import API from "../services/api";

import "./TasksTable.css";

export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const token = localStorage.getItem("token");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const fetchTasks = async () => {
        const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // OPEN MENU
  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // ✅ DELETE TASK
  const handleDelete = async () => {
            const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/tasks/${selectedTask.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(tasks.filter((t) => t.id !== selectedTask.id));
    handleMenuClose();
  };

  // ✅ EDIT TASK
  const handleEdit = () => {
    setEditOpen(true);
    handleMenuClose();
  };

  return (
    <div className="tasks-table-container">
  <div className="table-wrapper">
    <table className="tasks-table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Due Date</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Assigned By</th>
          <th>Assigned To</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => {
          const assignedUsers = Array.isArray(task.assigned_to)
            ? task.assigned_to
            : JSON.parse(task.assigned_to || "[]");

          return (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{formatDate(task.due_date)}</td>
              <td className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </td>
              <td className={`status ${task.status.toLowerCase().replace(/\s/g, "_")}`}>
                {task.status}
              </td>
              <td>{task.assigned_by}</td>

              <td>
                <div className="assigned-users">
                  {assignedUsers.map((u) => (
                    <div key={u.id} className="assigned-user">
                      {u.profile_pic ? (
                        <img src={u.profile_pic} alt={u.name} />
                      ) : (
                        <PersonIcon className="default-avatar" />
                      )}
                      <span>{u.name}</span>
                    </div>
                  ))}
                </div>
              </td>

              <td>
                <MoreHorizIcon
                  className="action-icon"
                  onClick={(e) => handleMenuOpen(e, task)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

      {/* ✅ ACTION MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" /> Delete
        </MenuItem>

        <MenuItem onClick={handleEdit}>
          <EditIcon fontSize="small" /> Edit
        </MenuItem>

        <MenuItem onClick={() => { setViewOpen(true); handleMenuClose(); }}>
          <VisibilityIcon fontSize="small" /> View
        </MenuItem>

        <MenuItem onClick={() => { setViewOpen(true); handleMenuClose(); }}>
          <CommentIcon fontSize="small" /> Comment
        </MenuItem>
      </Menu>

      {/* ✅ EDIT MODAL */}
      {editOpen && (
        <EditTaskModal
          task={selectedTask}
          closeModal={() => setEditOpen(false)}
          refreshTasks={fetchTasks}
        />
      )}
      {viewOpen && (
  <ViewTaskModal
    task={selectedTask}
    closeModal={() => setViewOpen(false)}
  />
)}
    </div>
  );
}