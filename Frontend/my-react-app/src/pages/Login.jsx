import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Auth.css"; // reuse same CSS

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="sidebar-container">
      <Sidebar />
    </div>
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Welcome Back 👋</h2>

        <input
          name="email"
          type="email"
          placeholder="Email Address"
            autoComplete="email"
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          onChange={handleChange}
          required
        />

        {/* Forgot password */}
        <div className="auth-options">
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit">Login</button>

        {/* Sign up */}
        <p className="auth-switch">
          Don’t have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
    </div>
    
  );
}