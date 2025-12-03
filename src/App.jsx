import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUpPage";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import Features from "./pages/Features";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import GroupPage from "./pages/GroupPage/GroupPage";
import Calendar from "./pages/Calendar";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>} />
        <Route path="/create-group" element={<PrivateRoute><CreateGroup/></PrivateRoute>} />
        <Route path="/join-group" element={<PrivateRoute><JoinGroup/></PrivateRoute>} />
        <Route path="/group/:groupID" element={<PrivateRoute><GroupPage/></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Calendar/></PrivateRoute>} />
      </Routes>
    </Router>
  );
}
