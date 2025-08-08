import React from "react";
import { Link, useNavigate } from 'react-router-dom';

const MainHome = () => {
  const navigate = useNavigate();

  const handleStaffAccess = () => {
    const isLoggedIn = localStorage.getItem("login") === "true";
    if (isLoggedIn) {
      navigate("/Dashboard");
    } else {
      navigate("/login");
    }
  };

    const handleAddPatient = () => {
    const isLoggedIn = localStorage.getItem("login") === "true";
    if (isLoggedIn) {
      navigate("/add");
    } else {
      navigate("/login");
    }
  };


  return (
    <div className="main_home">
      <div className="bloc_parag_main">
        <i
          className="pi pi-heart"
          style={{ fontSize: "3rem", color: "white" }}
        ></i>
        <h1>Welcome to MediCare Clinic</h1>
        <h3>
          Streamlined digital patient registration system designed for healthcare professionals
        </h3>

        <div className="bloc_button">
          <button onClick={handleAddPatient}  className="button_main add">
            <i
              className="pi pi-user-plus"
              style={{ fontSize: "0.9rem", marginRight: "5px" }}
            ></i>
            Register New Patient
          </button>

          <button onClick={handleStaffAccess} className="button_main staff">
            <i
              className="pi pi-shield"
              style={{ fontSize: "0.9rem", marginRight: "5px" }}
            ></i>
            Staff Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainHome;
