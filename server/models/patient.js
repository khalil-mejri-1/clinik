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
  }
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
