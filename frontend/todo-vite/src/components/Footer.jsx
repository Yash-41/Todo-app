import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-divider"></div>
      <p>© {new Date().getFullYear()} To-Do App | Built with 💙 by Yash Nehra & Arshlan</p>

      <div className="footer-links">
        <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="#">Privacy Policy</a>
      </div>

      <div className="footer-divider"></div>
    </footer>
  );
}
