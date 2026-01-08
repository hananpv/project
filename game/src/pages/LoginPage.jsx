import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/Axios"; // ✅ CORRECT PATH
import { useAuth } from "../context/AuthContext";
import "../css/LoginPage.css";

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

    if (!emailOrUsername || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // 🔥 FIND USER BY EMAIL OR USERNAME
      const res = await api.get("/users");
      const user = res.data.find(
        (u) =>
          (u.email === emailOrUsername ||
            u.username === emailOrUsername) &&
          u.password === password
      );

      if (!user) {
        setError("Invalid email/username or password");
        setLoading(false);
        return;
      }

      // ✅ LOGIN THROUGH AUTH CONTEXT
      login(user);

      // 🔁 Redirect
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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
