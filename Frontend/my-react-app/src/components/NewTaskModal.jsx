//src/components/NewTaskModal
import React, { useState, useEffect } from "react";
import "./NewTaskModal.css";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import Checkbox from "@mui/material/Checkbox";
import API from "../services/api";

export default function NewTaskModal({ closeModal, refreshTasks }) {
  const token = localStorage.getItem("token");

  const [contacts, setContacts] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
    assignedTo: [],
    assignToMe: false // ✅ NEW
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const res = await API.fetch("/contacts/my", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setContacts(data);
  };

  // ✅ SELECT CONTACT
  const toggleSelect = (user) => {
    const exists = formData.assignedTo.find((u) => u.id === user.id);

    if (exists) {
      setFormData({
        ...formData,
        assignedTo: formData.assignedTo.filter((u) => u.id !== user.id)
      });
    } else {
      setFormData({
        ...formData,
        assignedTo: [...formData.assignedTo, user]
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalAssignedUsers = [...formData.assignedTo];

    // ✅ ONLY add current user if checkbox is checked
    if (formData.assignToMe) {
      finalAssignedUsers.push({
        id: currentUser.id,
        name: currentUser.name,
        profile_pic: currentUser.profile_pic
      });
    }
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...formData,
        assignedTo: finalAssignedUsers
      })
    });

    refreshTasks();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">
          <h3>Create New Task</h3>
          <CloseIcon onClick={closeModal} className="close-icon" />
        </div>

        <form onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Task Title"
            required
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
          />

          <input
            type="date"
            name="dueDate"
            onChange={handleChange}
          />

          <select name="priority" onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select name="status" onChange={handleChange}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          {/* ✅ ASSIGNED BY */}
          <div className="assigned-box">
            <p><b>Assigned By:</b> {currentUser.name}</p>
          </div>

          {/* ✅ ASSIGN TO ME */}
          <div className="assigned-box">
            <label>
              <Checkbox
                name="assignToMe"
                checked={formData.assignToMe}
                onChange={handleChange}
              />
              Assign to me
            </label>
          </div>

          {/* ✅ ASSIGNED TO CONTACTS */}
          <div className="assigned-box">
            <p><b>Assigned To Contacts:</b></p>

            <div className="selected-users">
              {formData.assignedTo.map((u) => (
                <span key={u.id}>{u.name}</span>
              ))}
            </div>

            <button type="button" onClick={() => setShowPicker(true)}>
              Select from contacts
            </button>
          </div>

          <button type="submit" className="create-btn">
            Create Task
          </button>
        </form>

        {/* ✅ CONTACT PICKER */}
        {showPicker && (
          <div className="picker-overlay">
            <div className="picker">

              <h4>Select Contacts</h4>

              {contacts.map((user) => (
                <div key={user.id} className="contact-item">

                  {user.profile_pic ? (
                    <img src={user.profile_pic} alt={user.name} />
                  ) : (
                    <PersonIcon className="default-avatar" />
                  )}

                  <span>{user.name}</span>

                  <Checkbox
                    checked={formData.assignedTo.some((u) => u.id === user.id)}
                    onChange={() => toggleSelect(user)}
                  />
                </div>
              ))}

              <button onClick={() => setShowPicker(false)}>
                Done
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}