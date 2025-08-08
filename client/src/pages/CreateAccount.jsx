import React from "react";
import Navbar from "../comp/navbar";
import { Link } from "react-router-dom";

const CreateAccount = () => {
  return (
    <>
    <Navbar/>
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="shield-icon"><i className="pi pi-shield
" style={{ fontSize: '2rem' }}></i></div>
          <h2>Create Account</h2>
          <p>Register to access the patient management dashboard</p>
        </div>

        <form className="login-form">
          <div className="form-group">
            <label>Full Name  <span>*</span></label>
            <input type="text" placeholder="Enter your full name" required />
          </div>

          <div className="form-group">
            <label>Email Address  <span>*</span></label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password  <span>*</span></label>
            <div className="password-wrapper">
              <input type="password" placeholder="Create a password" required />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password  <span>*</span></label>
            <input type="password" placeholder="Confirm your password" required />
          </div>

          <button type="submit" className="sign-in-button">Create Account</button>

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
