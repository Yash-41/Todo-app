import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.user_id);

        toast.success("Login successful 🎉 Redirecting...", {
          position: "top-right",
          autoClose: 1500,
        });

        setTimeout(() => navigate("/home"), 1800);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Invalid credentials ❌", {
          position: "top-right",
          autoClose: 2500,
        });
      } else {
        toast.error("Server not responding ⚠️", {
          position: "top-right",
          autoClose: 2500,
        });
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2 className="auth-title">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />

        <button type="submit" className="auth-btn">
          Login
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
}
