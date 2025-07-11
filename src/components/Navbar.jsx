import "../index.css";
import { Link } from "react-router-dom";

function Navbar({ links }) {
  return (
    <nav className="sticky top-0 z-10 backdrop-blur-lg bg-opacity-10 border-b border-gray-200 flex items-center justify-between px-10 py-4">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src="public/logo.png"
            alt="Study Buddy Logo"
            className="h-8 w-auto"
          />
        </Link>
      </div>

      {/* Navigation Links */}
      {links}
    </nav>
  );
}

export default Navbar;
