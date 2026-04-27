import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RootRedirect() {
  const { user } = useContext(AuthContext);

  // ✅ if logged in → dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // ❌ if not logged in → login
  return <Navigate to="/login" replace />;
}