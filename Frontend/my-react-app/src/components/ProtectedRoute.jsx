// components/ProtectedRoute.jsx
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  // Not logged in
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in
  return children;
}