import "../index.css";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css"

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <nav className="sticky top-0 z-10 backdrop-blur-lg bg-opacity-10 border-b border-gray-200 flex items-center justify-between px-10 py-4 navbar">
      {/* Logo */}
      <div className="flex items-center space-x-2 logo">
        <Link to="/">
          <img src="/logo.png" alt="Study Buddy Logo" className="h-8 w-auto" />
        </Link>
      </div> 

      {/* Navigation Links */}

      <div className="flex items-center space-x-8 navlinks">
        <Link to="/">
          <p
            className={`${
              isActive("/")
                ? "text-[rgb(109,191,254)] font-semibold"
                : "text-black"
            } hover:text-[rgb(109,191,254)] transition`}
          >
            Home
          </p>
        </Link>

        <Link to="/features">
          <p
            className={`${
              isActive("/features")
                ? "text-[rgb(109,191,254)] font-semibold"
                : "text-black"
            } hover:text-[rgb(109,191,254)] transition`}
          >
            Features
          </p>
        </Link>

        <a
          href="https://www.linkedin.com/in/rajdeepsanyal"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black hover:text-[rgb(109,191,254)] transition contact"
        >
          Contact
        </a>
        {isActive("/signup") ? null : (
          <Link to="/signup">
            <button
              className={`bg-[rgb(109,191,254)] border-2 border-[rgb(109,191,254)] text-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition font-medium cta`}
            >
              Get Started Free
            </button>
          </Link>
        )}

        <Link to="/login">
          <button className="border border-gray-300 text-gray-700 px-5 py-2 rounded-full hover:bg-gray-100 transition font-medium cta">
            Log In
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
