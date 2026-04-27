import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Auth.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err.response.data.error);
    }
  };

  return (
    <div className="auth-page">
       <div className="sidebar-container">
            <Sidebar />
          </div>
      <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Create Your Account</h2>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />

        <button type="submit">Sign Up</button>
        <p className="auth-switch">Already have an account? <span className="login-link" onClick={() => navigate("/login")}>Login</span></p>
      </form>
    </div>
    </div>
    
  );
}