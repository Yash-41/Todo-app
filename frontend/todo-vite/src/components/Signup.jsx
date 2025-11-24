import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const newUser = { name, email, password };

    try {
      const res = await axios.post("http://localhost:3000/api/users/signup", newUser);
      if (res.status === 201) {
        toast.success("Signup successful 🎉 Redirecting...", {
          position: "top-right",
          autoClose: 1500,
        });
        setTimeout(() => navigate("/"), 1800);
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message || "Signup failed ❌", {
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
      <form className="auth-form" onSubmit={handleSignup}>
        <h2 className="auth-title">Sign Up</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input"
          required
        />
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
          Sign Up
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>

      <ToastContainer />
    </div>
  );
}
