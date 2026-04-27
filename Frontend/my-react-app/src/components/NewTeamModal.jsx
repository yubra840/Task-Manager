import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Checkbox from "@mui/material/Checkbox";
import "./NewTaskModal.css";

export default function NewTeamModal({ closeModal, refreshTeams }) {
  const token = localStorage.getItem("token");

  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showPicker, setShowPicker] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/contacts/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setContacts(data);
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
   await fetch(`${apiUrl}/teams`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        members: selected
      })
    });

    refreshTeams();
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <div className="modal-header">
          <h3>Create Team</h3>
          <CloseIcon onClick={closeModal} />
        </div>

        <form onSubmit={handleSubmit}>

          <input
            placeholder="Team Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <textarea
            placeholder="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="assigned-box">
            <p><b>Members:</b></p>

            <div className="selected-users">
              {selected.map(u => <span key={u.id}>{u.name}</span>)}
            </div>

            <button type="button" onClick={() => setShowPicker(true)}>
              Add Members
            </button>
          </div>

          <button type="submit" className="create-btn">
            Create Team
          </button>

        </form>

        {showPicker && (
          <div className="picker-overlay">
            <div className="picker">

              <h4>Select Members</h4>

              {contacts.map(user => (
                <div key={user.id} className="contact-item">
                  <span>{user.name}</span>

                  <Checkbox
                    checked={selected.some(u => u.id === user.id)}
                    onChange={() => toggleSelect(user)}
                  />
                </div>
              ))}

              <button onClick={() => setShowPicker(false)}>Done</button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}