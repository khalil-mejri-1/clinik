import React from 'react';
import Navbar from '../comp/navbar';

const AddPas = () => {
  return (
    <>
   
    <Navbar/>


     <div className="form-container">
      <div className="form-header">
        <i className="pi pi-user-plus icon" />
        <h2>Patient Registration</h2>
        <p>Please fill out the form below to register a new patient</p>
      </div>

      <form className="registration-form">
        <label>
          Full Name <span>*</span>
          <div className="input-wrapper">
            <i className="pi pi-user" />
            <input type="text" placeholder="Enter patient's full name" required />
          </div>
        </label>

        <div className="input-row">
          <label>
            Phone Number <span>*</span>
            <div className="input-wrapper">
              <i className="pi pi-phone" />
              <input type="tel" placeholder="(+216) 12-345-678" required />
            </div>
          </label>

          <label>
            Email Address <span>*</span>
            <div className="input-wrapper">
              <i className="pi pi-envelope" />
              <input type="email" placeholder="patient@email.com" required />
            </div>
          </label>
        </div>

        <label>
          Home Address <span>*</span>
          <div className="input-wrapper">
            <i className="pi pi-map-marker" />
            <input type="text" placeholder="Enter patient's complete home address" required />
          </div>
        </label>
<br />
<label className="custom-label">
  Remarque medical <span className="required">*</span>
  <div className="input-wrapper">
    <i className="pi pi-pen-to-square icon" />
    <input
      type="text"
      placeholder="Enter remarque medical"
      className="custom-input"
      required
    />
  </div>
</label>


        <button type="submit" className="submit-button">Register Patient</button>
      </form>
    </div>
    
    </>
   
  );
};

export default AddPas;
