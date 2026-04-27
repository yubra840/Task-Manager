import React, { useState, useEffect } from "react";
import "./Contacts.css";
import API from "../services/api";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Sidebar from "../components/Sidebar";
import PersonIcon from "@mui/icons-material/Person";
import NewTaskModal from "../components/NewTaskModal";
export default function Contacts() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("add");
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
    fetchContacts();
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

  const fetchUsers = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/contacts/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
      console.log("USERS DATA:", data); // 👈 ADD THIS

    setUsers(data);
  };

  const fetchContacts = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/contacts/my`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setContacts(data);
  };

  const addContact = async (id) => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/contacts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ contactId: id })
    });

    fetchContacts();
  };

  const removeContact = async (id) => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    await fetch(`${apiUrl}/contacts/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ contactId: id })
    });

    fetchContacts();
  };

  const isContact = (id) => {
    return contacts.some((c) => c.id === id);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="page-container">
      {/* OVERLAY (click outside closes sidebar) */}
      {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}
        <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
              <Sidebar />
            </div>
   <div className="contacts-container">
      {/* TOP FILTER BUTTONS */}
      <div className="contacts-tabs">
        <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </div>
        <button
          className={activeTab === "add" ? "active" : ""}
          onClick={() => setActiveTab("add")}
        >
          Add Contacts
        </button>
        <button
          className={activeTab === "my" ? "active" : ""}
          onClick={() => setActiveTab("my")}
        >
          My Contacts
        </button>
      </div>

      {/* ADD CONTACTS */}
      {activeTab === "add" && (
        <>
          <input
            type="text"
            placeholder="Search users..."
            className="search-bar"
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="users-grid">
            {filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                {user.profile_pic ? (
                  <img src={user.profile_pic} alt={user.name} />
                ) : (
                  <PersonIcon className="default-avatar" />
                  
                )}                
                <p>{user.name}</p>

                {isContact(user.id) ? (
                  <div className="action-btn remove" onClick={() => removeContact(user.id)}>
                    <RemoveCircleIcon className="remove-icon" />
                    <span>Remove</span>
                  </div>
                ) : (
                  <div className="action-btn add" onClick={() => addContact(user.id)}>
  <                  PersonAddIcon className="add-icon" />
                    <span>Add</span>
                  </div>
                
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* MY CONTACTS */}
      {activeTab === "my" && (
        <div className="users-grid">
          {contacts.map((user) => (
            <div key={user.id} className="user-card">
              {user.profile_pic ? (
                <img src={user.profile_pic} alt={user.name} />
              ) : (
                <PersonIcon className="default-avatar" />
              )}
              <p>{user.name}</p>

              <RemoveCircleIcon
                className="remove-icon"
                onClick={() => removeContact(user.id)}
              />

              <button className="assign-btn" onClick={() => setShowModal(true)}>
                Assign Task
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    {showModal && (
  <NewTaskModal
    closeModal={() => setShowModal(false)}
    refreshTasks={() => {}}
  />
)}
    </div>
   
  );
}