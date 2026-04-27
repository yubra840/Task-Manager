import React, { useEffect, useState } from "react";
import "./Teams.css";
import AddIcon from "@mui/icons-material/Add";
import NewTeamModal from "../components/NewTeamModal";
import Sidebar from "../components/Sidebar";
import TeamTasks from "../components/TeamTasks";
import API from "../services/api";

export default function Teams() {
  const token = localStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [teamDetails, setTeamDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [showModal, setShowModal] = useState(false);
      const [sidebarOpen, setSidebarOpen] = useState(false);
  

  useEffect(() => {
    fetchTeams();
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

  const fetchTeams = async () => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/teams`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setTeams(data);

    if (data.length > 0) {
      setActiveTeam(data[0]);
      fetchTeamDetails(data[0].id);
    }
  };

  const fetchTeamDetails = async (id) => {
    const apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
    const res = await fetch(`${apiUrl}/teams/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    setTeamDetails(data);
  };

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    const team = teams.find(t => t.id == teamId);
    setActiveTeam(team);
    fetchTeamDetails(teamId);
  };

  return (
    <div className="teams-page">
        {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}
             
                   {/* SIDEBAR */}
                   <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
                     <Sidebar />
                   </div>
       
 <div className="teams-container">

      {/* HEADER */}
      <div className="teams-header">
        <div className="title-sidebar">
        <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </div>
        <h2>Teams</h2>
        </div>

        <button onClick={() => setShowModal(true)}>
          <AddIcon /> Create Team
        </button>
      </div>

      {/* TOP BAR */}
      <div className="teams-topbar">

        <select onChange={handleTeamChange} value={activeTeam?.id}>
          {teams.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {teamDetails && (
          <div className="team-info">
            <span>{teamDetails.members.length} Members</span>
            <span>My Role: {teamDetails.role}</span>
          </div>
        )}
      </div>

      {/* NAV */}
      <div className="teams-nav">
        <button
  onClick={() => setActiveTab("tasks")}
  className={activeTab === "tasks" ? "active" : ""}
>
  Team Tasks
</button>

<button
  onClick={() => setActiveTab("members")}
  className={activeTab === "members" ? "active" : ""}
>
  Members
</button>

<button
  onClick={() => setActiveTab("discussion")}
  className={activeTab === "discussion" ? "active" : ""}
>
  Discussion
</button>
      </div>

      {/* CONTENT */}
      <div className="teams-content">

        {activeTab === "tasks" && <div><TeamTasks teamId={activeTeam?.id} role={teamDetails?.role} /></div>}

        {activeTab === "members" && (
          <div>
            {teamDetails?.members.map(m => (
              <p key={m.id}>{m.name} ({m.role})</p>
            ))}
          </div>
        )}

        {activeTab === "discussion" && <div>Discussion Coming Soon...</div>}

      </div>

      {/* MODAL */}
      {showModal && (
        <NewTeamModal
          closeModal={() => setShowModal(false)}
          refreshTeams={fetchTeams}
        />
      )}

    </div>
    </div>
   
  );
}