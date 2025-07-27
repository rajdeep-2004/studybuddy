import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Sidebar.css";
import { HiOutlineMenu } from "react-icons/hi";

function SidebarItem({ icon, label }) {
  const iconPath = `/${icon}`;
  return (
    <div className="flex items-center gap-3 hover:bg-[#f5f6f8] rounded-lg px-4 py-2 cursor-pointer transition">
      <img src={iconPath} alt={label} className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      alert("Failed to log out. Please try again.");
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div>
        <div className="h-16 flex items-center pl-1 mb-10">
          <img src="/logo.png" alt="Study Buddy Logo" className="h-8 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="space-y-2 text-gray-800">
          <Link to={"/dashboard"}>
            <SidebarItem icon="homeicon.png" label="Home" />
          </Link>
          <Link to={"/join-group"}>
            <SidebarItem icon="plusicon.png" label="Join a Group" />
          </Link>
          <Link to="/create-group">
            <SidebarItem icon="plusicon.png" label="Create a Group" />
          </Link>
          <Link to="/calendar">
            <SidebarItem icon="calendaricon.png" label="Calendar" />
          </Link>
        </nav>
      </div>

      {/* Logout */}
      <button className="space-y-2" onClick={handleLogout}>
        <SidebarItem icon="logouticon.png" label="Logout" />
      </button>
    </>
  );

  return (
    <>

      <div className="hamburger-icon" onClick={() => setSidebarOpen(true)}>
        {sidebarOpen ? null : (
          <HiOutlineMenu className="h-6 w-6 text-gray-800" />
        )}
      </div>


      <div className="sidebar">
        <SidebarContent />
      </div>


      {sidebarOpen && (
        <>
          <div
            className="mobile-overlay"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="mobile-menu open">
            <SidebarContent />
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;