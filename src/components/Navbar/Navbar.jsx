import React from 'react';
import "./Navbar.css";

const Navbar = () => {
  const signIn = false;

  return (
    <div className="navbar">
      <ul className="left-nav">
        <li id="logo">Study Buddy</li>
      </ul>
      <ul className="right-nav">
        <li className="pages">Home</li>
        <li className="pages">Dashboard</li>
        <li className="pages">
          <button className='button'>{signIn ? "Groups" : "SignUp"}</button>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;