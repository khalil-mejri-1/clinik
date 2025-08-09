import React, { useState } from "react";
import Navbar from "../comp/navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple password check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/staff", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(res.data.message);
      setError("");
      setTimeout(() => navigate("/login"), 1500); // redirect to login
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Server error. Please try again.");
      }
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
            <h2>Create Account</h2>
            <p>Register to access the patient management dashboard</p>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                Full Name <span>*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email Address <span>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password <span>*</span>
              </label>
              <div className="password-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                Confirm Password <span>*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="sign-in-button">
              Create Account
            </button>

            <div className="extra-links">
              <Link to="/login">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateAccount;
