import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column" id="message">
          <h4 className="footer-heading">Study Buddy</h4>
          <p style={{width:"400px",margin:"0"}}>Connect with peers, form study groups, and excel together.</p>
        </div>

        <div className="footer-column" id="links">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Resources</a></li>
          </ul>
        </div>

        <div className="footer-column" id="contact">
          <h4 className="footer-heading">Contact</h4>
          <p>Email: studybuddyofficial@gmail.com</p>
          <p>Phone: +91 00000 00000</p>
        </div>
      </div>

      <div className="footer-bottom">
        <hr />
        <p>© 2025 Study Buddy. All rights reserved.</p>
      </div>
    </footer>
  );
}
