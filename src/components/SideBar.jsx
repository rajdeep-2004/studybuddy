import React from "react";
import {  Link } from "react-router-dom";

function SidebarItem({ icon, label }) {
  return (
    <div className="flex items-center gap-3 hover:bg-[#f5f6f8] rounded-lg px-4 py-2 cursor-pointer transition">
      <img src={`src/assets/${icon}`} alt={label} className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
const SideBar = () => {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col justify-between p-6">
      {/* Logo */}
      <div>
        <div className="h-16 flex items-center pl-1 mb-10">
          <img
            src="src/assets/logo.png"
            alt="Study Buddy Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 text-gray-800">
          <SidebarItem icon="homeicon.png" label="Home" />
          <SidebarItem icon="plusicon.png" label="Join a Group" />
         <Link to={"/create-group"}><SidebarItem icon="plusicon.png" label="Create a Group" /></Link> 
          <SidebarItem icon="calendaricon.png" label="Calendar" />
          <SidebarItem icon="resourcesicon.png" label="Resources" />
          <SidebarItem icon="profileicon.png" label="Profile" />
        </nav>
      </div>

      {/* Logout */}
      <div className="space-y-2">
        <SidebarItem icon="logouticon.png" label="Logout" />
      </div>
    </div>
  );
};

export default SideBar;
