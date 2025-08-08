
const express = require('express');
const mongoose = require('mongoose');
const Staff = require('./models/staff');
const Patient = require('./models/patient');  // adjust path if needed

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(express.json()); // 👈 this is important for JSON parsing

const cors = require("cors");
app.use(cors());

const connectDB = async () => {
  try {
    const uri =
      "mongodb+srv://medical123499:Fhj4aWtlt9MVxP47@cluster0.ihxbjw0.mongodb.net/";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Node.js project with MongoDB!');
});

app.post('/staff', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const newStaff = new Staff({ name, email, password });

    await newStaff.save();

    res.status(201).json({ message: 'Staff created successfully', staff: newStaff });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /patients - Add new patient
app.post('/patients', async (req, res) => {
  try {
    const { fullName, phoneNumber, emailAddress, homeAddress, medicalRemark } = req.body;

    if (!fullName || !phoneNumber || !emailAddress || !homeAddress || !medicalRemark) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newPatient = new Patient({
      fullName,
      phoneNumber,
      emailAddress,
      homeAddress,
      medicalRemark
    });

    await newPatient.save();

    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




// GET /patients - Get all patients

app.get('/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
