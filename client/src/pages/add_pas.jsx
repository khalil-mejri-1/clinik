import React, { useState, useEffect } from 'react';
import Navbar from '../comp/navbar';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddPas = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    homeAddress: '',
    medicalRemark: '',
    appointmentDate: null
  });

  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await axios.get('http://localhost:3000/booked-appointments');
        const dates = res.data.map(item => new Date(item.appointmentDate));
        setBookedDates(dates);
      } catch (error) {
        console.error("Failed to fetch booked dates", error);
      }
    };

    fetchBookedDates();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      appointmentDate: date
    });
  };

const isSameHour = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate() &&
    date1.getHours() === date2.getHours()
  );
};

const isDateBooked = (date) => {
  return bookedDates.some(bookedDate => isSameHour(bookedDate, date));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.appointmentDate) {
      alert("Please select an appointment date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        appointmentDate: formData.appointmentDate.toISOString()
      };

      const res = await axios.post('http://localhost:3000/patients', payload);
      alert(res.data.message || 'Patient registered successfully');

      setFormData({
        fullName: '',
        phoneNumber: '',
        emailAddress: '',
        homeAddress: '',
        medicalRemark: '',
        appointmentDate: null
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error registering patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-container">
        <div className="form-header">
          <i className="pi pi-user-plus icon" />
          <h2>Patient Registration</h2>
          <p>Please fill out the form below to register a new patient</p>
        </div>

        <form className="registration-form" onSubmit={handleSubmit}>
          <label>
            Full Name <span>*</span>
            <div className="input-wrapper">
              <i className="pi pi-user" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter patient's full name"
                required
              />
            </div>
          </label>

          <div className="input-row">
            <label>
              Phone Number <span>*</span>
              <div className="input-wrapper">
                <i className="pi pi-phone" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="(+216) 12-345-678"
                  required
                />
              </div>
            </label>

            <label>
              Email Address <span>*</span>
              <div className="input-wrapper">
                <i className="pi pi-envelope" />
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="patient@email.com"
                  required
                />
              </div>
            </label>
          </div>

          <label>
            Home Address <span>*</span>
            <div className="input-wrapper">
              <i className="pi pi-map-marker" />
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                placeholder="Enter patient's complete home address"
                required
              />
            </div>
          </label>

          <label className="custom-label">
            Remarque medical <span className="required">*</span>
            <div className="input-wrapper">
              <i className="pi pi-pen-to-square icon" />
              <input
                type="text"
                name="medicalRemark"
                value={formData.medicalRemark}
                onChange={handleChange}
                placeholder="Enter medical remark"
                className="custom-input"
                required
              />
            </div>
          </label>

          <label className="custom-label">
            Date de rendez-vous <span className="required">*</span>
            <div className="input-wrapper datetime-input-wrapper">
              <i className="pi pi-calendar icon" />
              <DatePicker
                selected={formData.appointmentDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={1}
                dateFormat="d MMM yyyy h:mm aa"
                timeCaption="time"
                placeholderText="Select appointment date and time"
                filterTime={filterPassedTime}
                minDate={new Date()}
                className="custom-input datetime-input"
              />
            </div>
          </label>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddPas;
