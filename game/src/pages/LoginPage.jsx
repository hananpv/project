import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/Axios";
import { useAuth } from "../context/AuthContext";
import "../css/LoginPage.css";
import Snowfall from "react-snowfall";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //  Validation
    if (!emailOrUsername.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get("/users");

      const user = data.find(
        (u) =>
          (u.email === emailOrUsername.trim() ||
            u.username === emailOrUsername.trim()) &&
          u.password === password
      );

      //  Invalid user
      if (!user) {
        setError("Invalid email/username or password");
        toast.error("Login failed");
        return;
      }

      //  Blocked user
      if (user.isBlocked) {
        setError("Your account is blocked by admin");
        toast.error("Account blocked");
        return;
      }

      //  Save user (persistent login)
      localStorage.setItem("user", JSON.stringify(user));

      //  Context login
      login(user);

      toast.success("Login successful");

      //  Role-based redirect
      if (user.role === "admin") {
        navigate("/admin"); // admin dashboard
      } else {
        navigate("/"); // user home
      }

    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Snowfall color="white" />

      <div className="login-card">
        <h2 className="login-title">PIXELVAULT</h2>
        <p className="login-subtitle">Login to your account</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-link-text">
          Don’t have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;