import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/Axios"; 
import { useAuth } from "../context/AuthContext";
import "../css/RegisterPage.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get("/users");

      const emailExists = res.data.some(u => u.email === email);
      if (emailExists) {
        setError("Email already registered");
        setLoading(false);
        return;
      }

      const usernameExists = res.data.some(u => u.username === username);
      if (usernameExists) {
        setError("Username already taken");
        setLoading(false);
        return;
      }

      await register({
        username,
        email,
        password
      });

      toast("Registration successful! Please login.");
      navigate("/login");

    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
                                            
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
                                              
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
                                                     
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
                                                       
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;
