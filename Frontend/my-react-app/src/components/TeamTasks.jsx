import React, { useEffect, useState } from "react";
import "./TeamTasks.css";
import AddIcon from "@mui/icons-material/Add";
import TeamTasksTable from "./TeamTasksTable";
import AssignTeamTaskModal from "./AssignTeamTaskModal";

export default function TeamTasks({ teamId, role }) {
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    assignedToMe: false,
    priority: "",
    status: ""
  });

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const fetchTasks = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/team-tasks/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (teamId) fetchTasks();
  }, [teamId]);

  // ✅ FILTER LOGIC
  const filteredTasks = tasks.filter(task => {
  const assignedUsers = task.assigned_to;
    if (filters.assignedToMe) {
      if (!assignedUsers.some(u => u.id === currentUser.id)) return false;
    }

    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.status && task.status !== filters.status) return false;

    return true;
  });

  return (
    <div className="team-tasks">

      {/* TOP BAR */}
      <div className="tasks-top">

        <div className="filters">
          <label>
            <input
              type="checkbox"
              onChange={(e) => setFilters({ ...filters, assignedToMe: e.target.checked })}
            />
            Assigned to me
          </label>

          <select onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
            <option value="">Priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* ✅ ADMIN ONLY */}
        {role === "admin" && (
          <button onClick={() => setShowModal(true)}>
            <AddIcon /> Assign Task
          </button>
        )}

      </div>

      {/* TABLE */}
      <TeamTasksTable
        tasks={filteredTasks}
        refreshTasks={fetchTasks}
        role={role}
      />

      {/* MODAL */}
      {showModal && (
        <AssignTeamTaskModal
          teamId={teamId}
          closeModal={() => setShowModal(false)}
          refreshTasks={fetchTasks}
        />
      )}

    </div>
  );
}