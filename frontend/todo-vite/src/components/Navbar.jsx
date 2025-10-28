import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!user_id && !!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand app-logo" to="/">
          <i className="bi bi-list-check me-2"></i> To-Do App
        </Link>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/todos">
                My Todos
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/about">
                About
              </Link>
            </li>
          </ul>
          <div className="d-flex ms-3">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-login me-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-signup">
                  Sign Up
                </Link>
              </>
            ) : (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
