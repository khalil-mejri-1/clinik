import React, { useState } from "react";
import Navbar from "../comp/navbar";
import { Link, useNavigate } from "react-router-dom";

const StaffLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = (e) => {
  e.preventDefault();

  if (email === "ex@gmail.com" && password === "1234") {
    localStorage.setItem("login", "true");

    const redirectPage = localStorage.getItem("redirectAfterLogin") || "/dashboard";
    localStorage.removeItem("redirectAfterLogin"); // تنظيف
    navigate(redirectPage);

  } else {
    alert("❌ Wrong email or password");
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
