import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonIcon from "@mui/icons-material/Person";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import EditTeamTaskModal from "./EditTeamTaskModal";
import ViewTeamTaskModal from "./ViewTeamTaskModal";

import "./TasksTable.css";

export default function TeamTasksTable({ tasks, refreshTasks, role }) {
  const token = localStorage.getItem("token");

  // ✅ GET CURRENT USER
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleMenuOpen = (e, task) => {
    setAnchorEl(e.currentTarget);
    setSelectedTask(task);
  };

  const handleClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/team-tasks/${selectedTask.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
   

    refreshTasks();
    handleClose();
  };

  const handleEdit = () => {
    setEditOpen(true);
    handleClose();
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
          {tasks.map(task => {

            const assignedUsers = Array.isArray(task.assigned_to)
              ? task.assigned_to
              : JSON.parse(task.assigned_to || "[]");

            // ✅ CHECK IF USER IS ASSIGNED
            const isAssignedUser = assignedUsers.some(
              (u) => u.id === currentUser?.id
            );

            // ✅ FINAL PERMISSION
            const canEdit = role === "admin" || isAssignedUser;

            return (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{formatDate(task.due_date)}</td>

                <td className={`priority ${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </td>

                <td className={`status ${task.status?.toLowerCase().replace(/\s/g, "_")}`}>
                  {task.status}
                </td>

                <td>{task.assigned_by_name}</td>

                <td>
                  <div className="assigned-users">
                    {assignedUsers.map((u) => (
                      <div key={u.id} className="assigned-user">
                        {u.profile_pic ? (
                          <img src={u.profile_pic} alt={u.name} />
                        ) : (
                          <PersonIcon className="default-avatar" />
                        )}
                        <span className="assigned-name">{u.name}</span>
                      </div>
                    ))}
                  </div>
                </td>

                <td>
                  <MoreHorizIcon
                    className="action-icon"
                    onClick={(e) => handleMenuOpen(e, task)}
                  />

                  {/* ✅ STORE PERMISSION IN TASK */}
                  {selectedTask?.id === task.id && (
                    selectedTask.canEdit = canEdit
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>

      {/* ✅ MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>

        {/* ✅ DELETE (ONLY ADMIN) */}
        {role === "admin" && (
          <MenuItem onClick={handleDelete}>
            <DeleteIcon fontSize="small" /> Delete
          </MenuItem>
        )}

        {/* ✅ EDIT (ADMIN OR ASSIGNED USER) */}
        {selectedTask?.canEdit && (
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" /> Edit
          </MenuItem>
        )}

        <MenuItem onClick={() => { setViewOpen(true); handleClose(); }}>
          <VisibilityIcon fontSize="small" /> View
        </MenuItem>

        <MenuItem onClick={() => { setViewOpen(true); handleClose(); }}>
          <CommentIcon fontSize="small" /> Comment
        </MenuItem>

      </Menu>

      {editOpen && (
        <EditTeamTaskModal
          task={selectedTask}
          closeModal={() => setEditOpen(false)}
          refreshTasks={refreshTasks}
        />
      )}

      {viewOpen && (
        <ViewTeamTaskModal
          task={selectedTask}
          closeModal={() => setViewOpen(false)}
        />
      )}
    </div>
  );
}
