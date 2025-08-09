import React, { useEffect, useState } from "react";
import Navbar from "../comp/navbar";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [list, setList] = useState(false);

  const [bookedDates, setBookedDates] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [initialEtat, setInitialEtat] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    homeAddress: "",
    medicalRemark: "",
    appointmentDate: null, // موعد المريض
    etat: "", // حالة الحضور: present / absent
  });

  // New state to store selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Function to open modal with patient data
  const openPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setVisible(true);
  };
  const openPatientEdit = (patient) => {
    setSelectedPatient(patient);
    setEdit(true);
  };

  const openPatientlist = () => {
    setList(true);
  };

  useEffect(() => {
    let intervalId;

    async function fetchPatients() {
      try {
        const response = await fetch("http://localhost:3000/patients");
        const data = await response.json();
        setPatients(data);

        const initialAttendance = {};
        data.forEach((p) => {
          initialAttendance[p._id] = p.etat;
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Failed to fetch patients", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPatients(); // أول تحميل بيانات

    // تحديث تلقائي كل 5 ثواني
    intervalId = setInterval(fetchPatients, 5000);

    // تنظيف الموقت عند تفكيك الكمبوننت
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/booked-appointments"
        );
        const dates = res.data.map((item) => new Date(item.appointmentDate));
        setBookedDates(dates);
      } catch (error) {
        console.error("Failed to fetch booked dates", error);
      }
    };

    fetchBookedDates();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        fullName: selectedPatient.fullName || "",
        phoneNumber: selectedPatient.phoneNumber || "",
        emailAddress: selectedPatient.emailAddress || "",
        homeAddress: selectedPatient.homeAddress || "",
        medicalRemark: selectedPatient.medicalRemark || "",
        appointmentDate: selectedPatient.appointmentDate
          ? new Date(selectedPatient.appointmentDate)
          : null,
        etat: selectedPatient.etat || "", // <-- important: set etat here
      });
      setInitialEtat(selectedPatient.etat || ""); // save initial etat on open
    }
  }, [selectedPatient]);

  const isSameHour = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours()
    );
  };

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const todayAppointmentsCount = patients.filter((p) => {
    if (!p.appointmentDate) return false;
    return isSameDay(new Date(p.appointmentDate), new Date());
  }).length;

  const isDateBooked = (date) => {
    return bookedDates.some((bookedDate) => isSameHour(bookedDate, date));
  };

  // فلترة الأوقات في DatePicker لتعطيل المحجوزة
  const filterPassedTime = (time) => {
    if (!formData.appointmentDate) return true; // إذا لم يتم اختيار يوم، نسمح بكل الأوقات

    // فقط نفحص الأوقات في نفس اليوم
    const selectedDay = formData.appointmentDate;
    const date = new Date(time);
    if (
      date.getFullYear() === selectedDay.getFullYear() &&
      date.getMonth() === selectedDay.getMonth() &&
      date.getDate() === selectedDay.getDate()
    ) {
      return !isDateBooked(date);
    }

    return true; // الأيام الأخرى مسموح بها كلها
  };

  // Fill form when patient changes
  useEffect(() => {
    if (selectedPatient) {
      setFormData({
        fullName: selectedPatient.fullName || "",
        phoneNumber: selectedPatient.phoneNumber || "",
        emailAddress: selectedPatient.emailAddress || "",
        homeAddress: selectedPatient.homeAddress || "",
        medicalRemark: selectedPatient.medicalRemark || "",
        appointmentDate: selectedPatient.appointmentDate
          ? new Date(selectedPatient.appointmentDate)
          : null,
      });
    }
  }, [selectedPatient]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update request
  const handleUpdate = async () => {
    try {
      // تحويل التاريخ إلى ISO string لو موجود
      const payload = {
        ...formData,
        appointmentDate: formData.appointmentDate
          ? formData.appointmentDate.toISOString()
          : null,
      };

      const res = await axios.put(
        `http://localhost:3000/${selectedPatient._id}`,
        payload
      );

      alert(res.data.message || "Patient updated successfully");
      setEdit(false);
      window.location.reload();
      // هنا يمكن تحديث القائمة أو إعادة تحميل البيانات
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error updating patient");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/${id}`);

      // Remove patient from state instantly
      setPatients((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting patient");
    }
  };

  // Filtrer les patients selon la recherche
  const filteredPatients = patients
    .filter((patient) => {
      const search = searchTerm.toLowerCase();
      return (
        patient.fullName.toLowerCase().includes(search) ||
        patient.emailAddress.toLowerCase().includes(search) ||
        patient.phoneNumber.includes(search)
      );
    })
    .sort((a, b) => {
      // تعامُل مع الحالة إذا لم يكن هناك موعد
      if (!a.appointmentDate && !b.appointmentDate) return 0;
      if (!a.appointmentDate) return 1; // بدون موعد يذهب للأسفل
      if (!b.appointmentDate) return -1;

      // ترتيب تصاعدي حسب التاريخ
      return new Date(a.appointmentDate) - new Date(b.appointmentDate);

      // إذا تريد ترتيب تنازلي:
      // return new Date(b.appointmentDate) - new Date(a.appointmentDate);
    });

  const updateEtat = async (patientId, newEtat) => {
    try {
      const response = await fetch(
        `http://localhost:3000/patients/${patientId}/etat`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ etat: newEtat }),
        }
      );
      if (!response.ok) throw new Error("Erreur update");

      const data = await response.json();

      setAttendance((prev) => ({
        ...prev,
        [patientId]: newEtat,
      }));
    } catch (error) {
      console.error(error);
      alert("Erreur mise à jour état");
    }
  };

  const patientsForToday = patients.filter((patient) => {
    if (!patient.appointmentDate) return false;

    const appointmentDate = new Date(patient.appointmentDate);
    const today = new Date();

    return (
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth() &&
      appointmentDate.getDate() === today.getDate()
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
                   <br />
              <h2>{patients.length}</h2>
            </div>

            <div className="stat-card" onClick={() => openPatientlist()}>
              <div className="stat-top">
                <span>Rendez-vous Today</span>
                <i
                  className="pi pi-calendar"
                  style={{ fontSize: "2rem", color: "#16a34a" }}
                ></i>
                
              </div>
              <br />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2 style={{ margin: 0 }}>{todayAppointmentsCount}</h2>
  <span style={{ cursor: "pointer", color: "#1e3a8a", fontSize:"15px"}}>Afficher les Patients</span>
</div>

              
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Search Results</span>
                <i
                  className="pi pi-search"
                  style={{ fontSize: "2rem", color: "#993eec" }}
                ></i>
              </div>
                   <br />
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
            <div
              style={{
                maxWidth: "100%", // don't overflow page
                overflowX: "auto", // enable horizontal scroll
                display: "block",
              }}
            >
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
                    <th className="th"> rendez-vous</th>
                    <th className="th">État</th>

                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => {
                    return (
                      <tr key={patient._id} className="tr">
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
                            {patient.phoneNumber}
                          </span>
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
                          {patient.appointmentDate
                            ? format(
                                new Date(patient.appointmentDate),
                                "d MMM yyyy, h:mm a"
                              )
                            : "N/A"}
                        </td>

                        <td
                          className="data"
                          style={{
                            padding: "20px",
                            borderBottom: "1px solid #ddd",
                            backgroundColor:
                              attendance[patient._id] === "present"
                                ? "lightgreen"
                                : attendance[patient._id] === "absent"
                                ? "#ffbaba"
                                : "",
                          }}
                        >
                          {patient.etat === "passed" ? (
                            <>
                              <button
                                onClick={() =>
                                  updateEtat(patient._id, "present")
                                }
                                style={{
                                  marginRight: "10px",
                                  padding: "3px",
                                  border: "none",
                                  backgroundColor: "lightgreen",
                                  borderRadius: "3px",
                                }}
                              >
                                Present
                              </button>
                              <button
                                style={{
                                  padding: "3px",
                                  border: "none",
                                  backgroundColor: "#ffbaba",
                                  borderRadius: "3px",
                                }}
                                onClick={() =>
                                  updateEtat(patient._id, "absent")
                                }
                              >
                                Absent
                              </button>
                            </>
                          ) : (
                            <>
                              <span
                                style={{ fontWeight: "500", fontSize: "16px" }}
                              >
                                {patient.etat}
                              </span>
                            </>
                          )}
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

                          <button
                            className="button_table"
                            onClick={() => openPatientEdit(patient)}
                          >
                            <i
                              className="pi pi-pencil"
                              style={{ fontSize: "1rem", color: "#16a34a" }}
                            ></i>
                          </button>
                          <button
                            className="button_table"
                            onClick={() => handleDelete(patient._id)}
                          >
                            <i
                              className="pi pi-trash"
                              style={{ fontSize: "1rem", color: "#dc2626" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <br />
        <br />
      </div>

   <Dialog
  header={
    <div style={{ padding: "15px 20px", color: "black" }}>
      Liste des patients pour le rendez-vous d'aujourd'hui
    </div>
  }
  visible={list}
  onHide={() => setList(false)}
  style={{ width: "50vw" }}
  breakpoints={{ "960px": "75vw", "641px": "100vw" }}
>
  <hr />
  <div style={{ padding: "20px" }}>
    {patientsForToday.length === 0 ? (
      <p>Aucun patient n'a rendez-vous aujourd'hui.</p>
    ) : (
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "white",
          borderRadius: "10px",
          minWidth: "900px",
        }}
      >
        <thead>
          <tr>
            <th className="th">Patient</th>
            <th className="th">Contact Info</th>
            <th className="th">Address</th>
            <th className="th">Medical Remark</th>
            <th className="th">Rendez-vous</th>
          </tr>
        </thead>
        <tbody>
          {patientsForToday.map((patient) => (
            <tr key={patient._id} className="tr">
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
                <span style={{ color: "#6b7280" }}>{patient.phoneNumber}</span>
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
                {patient.appointmentDate
                  ? format(new Date(patient.appointmentDate), "d MMM yyyy, h:mm a")
                  : "N/A"}
              </td>
            
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</Dialog>


      <Dialog
        header={
          <>
            <div style={{ padding: "15px 20px", color: "black" }}>
              Patient Details
            </div>
          </>
        }
        visible={visible}
        onHide={() => setVisible(false)}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <hr />
        {selectedPatient && (
          <div style={{ padding: "20px" }}>
            <div
              style={{
                fontWeight: "bold",
                marginTop: "-20px",
                marginBottom: "30px",
                marginLeft: "0px",
                fontWeight: "300",
                fontSize: "20px",
              }}
            >
              Registration Date:{" "}
              {selectedPatient.registeredAt
                ? format(
                    new Date(selectedPatient.registeredAt),
                    "d MMM yyyy, h:mm a"
                  )
                : "N/A"}
            </div>
            <div
              style={{
                backgroundColor:
                  initialEtat === "present"
                    ? "lightgreen"
                    : initialEtat === "absent"
                    ? "#ffbaba"
                    : "transparent",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "5px",
                color: "black",
              }}
            >
              Etat de patient : {initialEtat || "—"}
            </div>

            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label style={{ marginBottom: "10px", color: "#374151" }}>
                Full Name
              </label>
              <input
                value={selectedPatient.fullName}
                readOnly
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                  border: "#e5e7eb solid 1px",
                  borderRadius: "5px",
                  color: "#374151",
                }}
              />
            </div>
            <br />
            <div
              className="p-field"
              style={{ marginBottom: "15px", display: "flex", gap: "10px" }}
            >
              <div style={{ flex: 1 }}>
                <label style={{ marginBottom: "10px", color: "#374151" }}>
                  Phone Number
                </label>
                <input
                  value={selectedPatient.phoneNumber}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#f9fafb",
                    border: "#e5e7eb solid 1px",
                    borderRadius: "5px",
                    color: "#374151",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ marginBottom: "10px", color: "#374151" }}>
                  Email Address
                </label>
                <input
                  value={selectedPatient.emailAddress}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#f9fafb",
                    border: "#e5e7eb solid 1px",
                    borderRadius: "5px",
                    color: "#374151",
                  }}
                />
              </div>
            </div>
            <br />
            <div className="p-field" style={{ marginBottom: "15px" }}>
              <label style={{ marginBottom: "10px", color: "#374151" }}>
                Home Address
              </label>
              <input
                value={selectedPatient.homeAddress}
                readOnly
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                  border: "#e5e7eb solid 1px",
                  borderRadius: "5px",
                  color: "#374151",
                }}
              />
            </div>
            <br />
            <div className="p-field" style={{ marginBottom: "15px" }}>
              <label style={{ marginBottom: "10px", color: "#374151" }}>
                Appointment Date
              </label>
              <input
                value={
                  selectedPatient.appointmentDate
                    ? format(
                        new Date(selectedPatient.appointmentDate),
                        "d MMM yyyy, h:mm a"
                      )
                    : "N/A"
                }
                readOnly
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#f9fafb",
                  border: "#e5e7eb solid 1px",
                  borderRadius: "5px",
                  color: "#374151",
                }}
              />
            </div>
            <br />
            <div>
              {(() => {
                if (!selectedPatient.appointmentDate)
                  return "Date de rendez-vous non définie";

                const now = new Date();
                const appointment = new Date(selectedPatient.appointmentDate);

                // حساب الفرق بالايام (فقط بدون الوقت)
                const diffTime =
                  appointment.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays > 0) {
                  return `Le rendez-vous est dans ${diffDays} jour${
                    diffDays > 1 ? "s" : ""
                  }`;
                } else if (diffDays === 0) {
                  return "Le rendez-vous est aujourd'hui";
                } else {
                  return "Le rendez-vous est passé";
                }
              })()}
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        header={
          <div style={{ padding: "15px 20px", color: "black" }}>
            Patient Edit
          </div>
        }
        visible={edit}
        onHide={() => setEdit(false)}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <hr />
        <div style={{ padding: "20px" }}>
          <div className="p-field" style={{ marginBottom: "20px" }}>
            <label style={{ marginBottom: "10px", color: "#374151" }}>
              Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                border: "#e5e7eb solid 1px",
                borderRadius: "5px",
                color: "#374151",
              }}
            />
          </div>
          <div
            className="p-field"
            style={{ marginBottom: "15px", display: "flex", gap: "10px" }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ marginBottom: "10px", color: "#374151" }}>
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fff",
                  border: "#e5e7eb solid 1px",
                  borderRadius: "5px",
                  color: "#374151",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ marginBottom: "10px", color: "#374151" }}>
                Email Address
              </label>
              <input
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#fff",
                  border: "#e5e7eb solid 1px",
                  borderRadius: "5px",
                  color: "#374151",
                }}
              />
            </div>
          </div>
          <div className="p-field" style={{ marginBottom: "15px" }}>
            <label style={{ marginBottom: "10px", color: "#374151" }}>
              Home Address
            </label>
            <input
              name="homeAddress"
              value={formData.homeAddress}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                border: "#e5e7eb solid 1px",
                borderRadius: "5px",
                color: "#374151",
              }}
            />
          </div>
          <div className="p-field" style={{ marginBottom: "15px" }}>
            <label style={{ marginBottom: "10px", color: "#374151" }}>
              Appointment Date
            </label>
            <DatePicker
              selected={formData.appointmentDate}
              onChange={(date) =>
                setFormData({ ...formData, appointmentDate: date })
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={1}
              dateFormat="d MMM yyyy h:mm aa"
              timeCaption="Time"
              filterTime={filterPassedTime}
              placeholderText="Select appointment date and time"
              minDate={new Date()}
              className="custom-input"
            />
          </div>
          <div className="p-field" style={{ marginBottom: "15px" }}>
            <label style={{ marginBottom: "10px", color: "#374151" }}>
              Medical Remark
            </label>
            <textarea
              name="medicalRemark"
              value={formData.medicalRemark}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                border: "#e5e7eb solid 1px",
                borderRadius: "5px",
                color: "#374151",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <Button
              label="Present"
              className="p-button-success"
              style={{ padding: "10px 20px", borderRadius: "5px" }}
              onClick={() => {
                setFormData((prev) => ({ ...prev, etat: "present" }));
                setTimeout(() => handleChange(), 0);
              }}
            />
            <Button
              label="Absent"
              style={{ padding: "10px 20px", borderRadius: "5px" }}
              className="p-button-danger"
              onClick={() => {
                setFormData((prev) => ({ ...prev, etat: "absent" }));
                setTimeout(() => handleChange(), 0);
              }}
            />
          </div>
          <br />
          Etat initial : {initialEtat}
          <br />
          Etat actuel : {formData.etat}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <Button
              label="Cancel"
              className="p-button-text"
              onClick={() => setEdit(false)}
            />
            <Button
              label="Update"
              className="p-button-primary"
              onClick={handleUpdate}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
