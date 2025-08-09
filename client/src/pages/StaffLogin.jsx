import React, { useState } from "react";
import Navbar from "../comp/navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // حالة رسالة الخطأ
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const res = await axios.post("http://localhost:3000/staff/login", {
      email,
      password,
    });

    if (res.data.success) {
      localStorage.setItem("login", "true");
      localStorage.setItem("staffName", res.data.staff.name); // هنا تخزين الاسم

      const redirectPage = localStorage.getItem("redirectAfterLogin") || "/dashboard";
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPage);
    } else {
      setError(res.data.message || "Invalid email or password");
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      setError(error.response.data.message);
    } else {
      setError("Error connecting to server. Please try again later.");
    }
    console.error(error);
  }
};


  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="shield-icon">
              <i className="pi pi-shield" style={{ fontSize: "2rem" }}></i>
            </div>
            <h2>Staff Login</h2>
            <p>Access the patient management dashboard</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div style={{ color: "red", marginBottom: "1rem" }}>
                {error}
              </div>
            )}

            <button type="submit" className="sign-in-button">
              Sign in
            </button>

            <div className="extra-links">
              <Link to="/create-account">Forgot Password?</Link>
              <Link to="/create-account">Create Account</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default StaffLogin;
