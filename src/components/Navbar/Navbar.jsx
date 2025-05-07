// Navbar.jsx
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const signIn = false;

  return (
    <div className="navbar">
      <ul className="left-nav">
        <li id="logo">Study Buddy</li>
      </ul>
      <ul className="right-nav">
        <li className="pages"><Link to="/">Home</Link></li>
        <li className="pages"><Link to="/dashboard">Dashboard</Link></li>
        <li className="pages">
          <button className="button">{signIn ? "Groups" : "SignUp"}</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
