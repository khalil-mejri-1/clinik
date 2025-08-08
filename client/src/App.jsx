import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Add from "./pages/add_pas";
import Login from "./pages/StaffLogin.jsx";
import CreateAccount from "./pages/CreateAccount";

import "./index.css";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <>
      {/* <button className="button_dark" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button> */}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<Add />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
                    <Route path="/Dashboard" element={<Dashboard />} />

          <Route path="/*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <footer className="footer">
        © 2025 MediCare Clinic. Professional healthcare management system.
      </footer>
    </>
  );
}

export default App;
