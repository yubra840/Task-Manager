//src/components/AssignTeamTaskModal.jsx
import React, { useState, useEffect } from "react";
import "./NewTaskModal.css";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import API from "../services/api";

export default function AssignTeamTaskModal({ teamId, closeModal, refreshTasks }) {
  const token = localStorage.getItem("token");

  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending"
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/teams/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setMembers(data.members);
  };

  const toggleSelect = (user) => {
    const exists = selected.find(u => u.id === user.id);

    if (exists) {
      setSelected(selected.filter(u => u.id !== user.id));
    } else {
      setSelected([...selected, user]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/team-tasks/${teamId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        assignedTo: selected
      })
    });

    refreshTasks();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h3>Assign Team Task</h3>
          <CloseIcon onClick={closeModal} />
        </div>

        <form onSubmit={handleSubmit}>

          <input placeholder="Task Title" required onChange={(e)=>setForm({...form,title:e.target.value})}/>
          <textarea placeholder="Description" onChange={(e)=>setForm({...form,description:e.target.value})}/>
          <input type="date" onChange={(e)=>setForm({...form,dueDate:e.target.value})}/>

          <select onChange={(e)=>setForm({...form,priority:e.target.value})}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select onChange={(e)=>setForm({...form,status:e.target.value})}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <div className="assigned-box">
            <p>Select Members</p>

            {members.map(user => (
              <div key={user.id}>
                <span>{user.name}</span>

                <Checkbox
                  checked={selected.some(u => u.id === user.id)}
                  onChange={() => toggleSelect(user)}
                />
              </div>
            ))}
          </div>

          <button className="create-btn">Assign Task</button>

        </form>

      </div>
    </div>
  );
}