import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


function SidebarItem({ icon, label }) {
  const iconPath = `${import.meta.env.BASE_URL}src/assets/${icon}`;

  

  return (
    <div className="flex items-center gap-3 hover:bg-[#f5f6f8] rounded-lg px-4 py-2 cursor-pointer transition">
      <img src={iconPath} alt={label} className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

const SideBar = () => {
  
  const logoPath = `${import.meta.env.BASE_URL}src/assets/logo.png`;
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Failed to log out. Please try again.");
    }
  }
      

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col justify-between p-6">
      {/* Logo */}
      <div>
        <div className="h-16 flex items-center pl-1 mb-10">
          <img
            src={logoPath}
            alt="Study Buddy Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 text-gray-800">
          <Link to={"/dashboard"}><SidebarItem icon="homeicon.png" label="Home" /></Link> 
          <SidebarItem icon="plusicon.png" label="Join a Group" />
          <Link to="/create-group">
            <SidebarItem icon="plusicon.png" label="Create a Group" />
          </Link>
          <SidebarItem icon="calendaricon.png" label="Calendar" />
          <SidebarItem icon="resourcesicon.png" label="Resources" />
          <SidebarItem icon="profileicon.png" label="Profile" />
        </nav>
      </div>

      {/* Logout */}
      <button className="space-y-2" onClick={handleLogout}>
        <SidebarItem icon="logouticon.png" label="Logout" />
      </button>
    </div>
  );
};

export default SideBar;
