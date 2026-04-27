//Frontend/my-react-app/src/pages/ForgotPassword.jsx
import { useState } from "react";
import API from "../services/api";
import "./Auth.css"; // reuse same CSS

export default function ForgotPassword() {
  const [form, setForm] = useState({
    email: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/forgot-password", form);
      alert("Reset link sent to your email");
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Reset Password</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={handleChange}
          required
        />


        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
}