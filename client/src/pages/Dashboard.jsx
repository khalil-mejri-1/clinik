import React, { useEffect, useState } from "react";
import Navbar from "../comp/navbar";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  // New state to store selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Function to open modal with patient data
  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setVisible(true);
  };

  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("http://localhost:3000/patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  // Filtrer les patients selon la recherche
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(search) ||
      patient.emailAddress.toLowerCase().includes(search) ||
      patient.phoneNumber.includes(search)
    );
  });

  return (
    <>
      <Navbar />

      <div className="dashboard-container">
        <div
          style={{
            maxWidth: "1100px",
            margin: "auto",
            position: "relative",
            top: "50px",
          }}
        >
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">
                <i
                  className="pi pi-users"
                  style={{
                    marginRight: "8px",
                    color: "#1666f0",
                    fontSize: "2rem",
                  }}
                ></i>
                Patient Dashboard
              </h1>

              <p className="dashboard-subtitle">
                Manage and view all registered patients
              </p>
            </div>
            <Link className="btn-primary" to="/add">
              + Register New Patient
            </Link>
          </div>

          {/* Stats */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-top">
                <span>Total Patients</span>
                <i
                  className="pi pi-users"
                  style={{ fontSize: "2rem", color: "#1666f0" }}
                ></i>
              </div>
              <h2>{patients.length}</h2>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Registered Today</span>
                <i
                  className="pi pi-calendar"
                  style={{ fontSize: "2rem", color: "#16a34a" }}
                ></i>
              </div>
              <h2>
                {
                  patients.filter((p) => {
                    const today = new Date().toDateString();
                    // Si tu as un champ createdAt dans ta base, sinon adapter
                    return new Date(p.createdAt).toDateString() === today;
                  }).length
                }
              </h2>
            </div>
            <div className="stat-card">
              <div className="stat-top">
                <span>Search Results</span>
                <i
                  className="pi pi-search"
                  style={{ fontSize: "2rem", color: "#993eec" }}
                ></i>
              </div>
              <h2>{filteredPatients.length}</h2>
            </div>
          </div>

          {/* Search */}
          <div className="search-box" style={{ margin: "1rem 0" }}>
            <input
              type="text"
              placeholder="Search patients by name, email, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "8px", fontSize: "1rem" }}
            />
          </div>

          {/* Patients List or Empty state */}
          {loading ? (
            <p>Loading patients...</p>
          ) : filteredPatients.length === 0 ? (
            <div className="empty-state">
              <p>No patients found</p>
              <Link to="/add" className="btn-primary">
                Register First Patient
              </Link>
            </div>
          ) : (
            <div  style={{
    maxWidth: "100%",            // don't overflow page
    overflowX: "auto",           // enable horizontal scroll
    display: "block",
  }} >
 <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "white",
      borderRadius: "10px",
      minWidth: "900px", // ensures scrollbar shows if content wider than container
    }}
  >
              <thead>
                <tr>
                  <th className="th">Patient</th>
                  <th className="th">Contact Info</th>

                  <th className="th">Address</th>
                  <th className="th">Medical Remark</th>
                  <th className="th">Registered</th>
                  <th className="th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td
                      className="data name"
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {patient.fullName}
                    </td>
                    <td
                      className="data"
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {patient.emailAddress} <br />
                      <span style={{ color: "#6b7280" }}>
                        {" "}
                        {patient.phoneNumber}
                      </span>{" "}
                    </td>
                    <td
                      className="data"
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {patient.homeAddress}
                    </td>
                    <td
                      className="data"
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {patient.medicalRemark}
                    </td>
                    <td
                      className="data"
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {patient.medicalRemark}
                    </td>
                    <td
                      className="data"
                      style={{
                        padding: "20px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <button
                        className="button_table"
                        onClick={() => openPatientDetails(patient)}
                      >
                        <i
                          className="pi pi-eye"
                          style={{ fontSize: "1rem", color: "#1e3a8a" }}
                        ></i>
                      </button>

                      <button className="button_table">
                        <i
                          className="pi pi-pencil"
                          style={{ fontSize: "1rem", color: "#16a34a" }}
                        ></i>
                      </button>
                      <button className="button_table">
                        <i
                          className="pi pi-trash"
                          style={{ fontSize: "1rem", color: "#dc2626" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>
           
          )}
        </div>
        <br />
        <br />
      </div>

    <Dialog 
    header={<div style={{ padding: "15px 20px", color:"black" }}>Patient Details</div>} 
  visible={visible} 
  onHide={() => setVisible(false)}
  style={{ width: '50vw' }} 
  breakpoints={{ '960px': '75vw', '641px': '100vw' }}
>
  <hr />
  {selectedPatient && (
    <div style={{ padding:"20px" }}>
      <div className="p-field" style={{ marginBottom: "20px" }}>
        <label  style={{marginBottom:"10px", color:"#374151"}} >Full Name</label>
        <input value={selectedPatient.fullName} readOnly  style={{ width: "100%",padding:"10px",backgroundColor:"#f9fafb", border:"#e5e7eb solid 1px",borderRadius:"5px", color:"#374151"}}/>
      </div>
<br />
      <div className="p-field" style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{marginBottom:"10px", color:"#374151"}}>Phone Number</label>
          <input value={selectedPatient.phoneNumber} readOnly   style={{ width: "100%",padding:"10px",backgroundColor:"#f9fafb", border:"#e5e7eb solid 1px",borderRadius:"5px", color:"#374151"}}/>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{marginBottom:"10px", color:"#374151"}}>Email Address</label>
          <input value={selectedPatient.emailAddress} readOnly   style={{ width: "100%",padding:"10px",backgroundColor:"#f9fafb", border:"#e5e7eb solid 1px",borderRadius:"5px", color:"#374151"}}/>
        </div>
      </div>
<br />
      <div className="p-field" style={{ marginBottom: "15px" }}>
        <label style={{marginBottom:"10px", color:"#374151"}}>Home Address</label>
        <input value={selectedPatient.homeAddress} readOnly   style={{ width: "100%",padding:"10px",backgroundColor:"#f9fafb", border:"#e5e7eb solid 1px",borderRadius:"5px", color:"#374151"}}/>
      </div>
<br />
      <div style={{ fontWeight: "bold", marginTop: "10px" }}>
        Registration Date: {new Date(selectedPatient.createdAt).toLocaleString()}
      </div>
    </div>
  )}
</Dialog>

    </>
  );
}
