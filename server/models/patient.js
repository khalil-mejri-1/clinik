const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  emailAddress: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  homeAddress: {
    type: String,
    required: true,
    trim: true
  },
  medicalRemark: {
    type: String,
    required: true,
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
 etat: {
  type: String,
  enum: ["attend", "absent", "present"],
  default: "attend"
},
  appointmentDate: {
    type: Date,
    required: true
  }
  
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
