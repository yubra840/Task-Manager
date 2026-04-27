import Sidebar from "../components/Sidebar";
import "./Settings.css";
import { useState, useEffect } from "react";

export default function Settings() {
      const [sidebarOpen, setSidebarOpen] = useState(false);
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
  
  return (
    <div className="settings-page">
       {sidebarOpen && <div className="overlay" onClick={handleOverlayClick}></div>}
            
                  {/* SIDEBAR */}
                  <div className={`sidebar-container ${sidebarOpen ? "open" : ""}`}>
                    <Sidebar />
                  </div>
      <div className="settings-content">
        <div className="title-sidebar">
        <div className="menu-icon" onClick={() => setSidebarOpen(true)}>
            ☰
          </div>
        <h2>Settings</h2>
        </div>
         
        <h3>This section is not yet implemented. It is where you can manage your account settings.</h3>
      </div>
    </div>
  );
}