// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import RootRedirect from "./components/RootRedirect"; // ✅ NEW

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MyTasks from "./pages/MyTasks";
import Contacts from "./pages/Contacts";
import Teams from "./pages/Teams";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ SMART ROOT ROUTE */}
        <Route path="/" element= {<RootRedirect />} />

        {/* ✅ PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* moved signup */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ PROTECTED ROUTES */}
        <Route path="/tasks" element={
          <ProtectedRoute>
            <MyTasks />
          </ProtectedRoute>
        } />

        <Route path="/contacts" element={
          <ProtectedRoute>
            <Contacts />
          </ProtectedRoute>
        } />

        <Route path="/teams" element={
          <ProtectedRoute>
            <Teams />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;