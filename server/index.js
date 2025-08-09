
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
  res.send('update 8/9/2025');
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
    const {
      fullName,
      phoneNumber,
      emailAddress,
      homeAddress,
      medicalRemark,
      appointmentDate,
      etat = "attend"  // القيمة الافتراضية إذا لم تُرسل
    } = req.body;

    if (!fullName || !phoneNumber || !emailAddress || !homeAddress || !medicalRemark || !appointmentDate) {
      return res.status(400).json({ message: 'All fields including appointment date are required' });
    }

    // تحقق من صحة قيمة etat إذا أردت (اختياري)
    const validStates = ["attend", "absent", "present"];
    if (!validStates.includes(etat)) {
      return res.status(400).json({ message: 'Invalid etat value' });
    }

    const newPatient = new Patient({
      fullName,
      phoneNumber,
      emailAddress,
      homeAddress,
      medicalRemark,
      appointmentDate: new Date(appointmentDate),  // تحويل النص إلى تاريخ
      etat
    });

    await newPatient.save();

    res.status(201).json({ message: 'Patient added successfully', patient: newPatient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.post('/staff/login', async (req, res) => {
  const { email, password } = req.body;

  // تحقق من صحة البيانات (مثال)
  const staff = await Staff.findOne({ email });
  if (!staff) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

const isPasswordValid = password === staff.password;

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // إذا تم التحقق، أرسل اسم المستخدم مع الرسالة
  res.json({
    success: true,
    message: "Login successful",
    staff: {
      name: staff.name,
      email: staff.email,
      // أي بيانات أخرى تريد إرسالها
    }
  });
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



// GET /booked-appointments
app.get('/booked-appointments', async (req, res) => {
  try {
    const patients = await Patient.find({}, 'appointmentDate');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// PUT: Update patient by ID
app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // جلب بيانات المريض الحالي
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

   const updateData = {
  fullName: req.body.fullName,
  phoneNumber: req.body.phoneNumber,
  emailAddress: req.body.emailAddress,
  homeAddress: req.body.homeAddress,
  medicalRemark: req.body.medicalRemark,
  etat: req.body.etat, // ✅ أضف هذا السطر
};

if (req.body.appointmentDate) {
  const newDate = new Date(req.body.appointmentDate);

  if (
    patient.appointmentDate &&
    patient.appointmentDate.getTime() !== newDate.getTime()
  ) {
    updateData.appointmentDate = newDate;
    updateData.etat = "attend"; // إعادة تعيين الحالة عند تغيير الموعد
  }
}


    const updatedPatient = await Patient.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Update etat (présence) d'un patient
app.put('/patients/:id/etat', async (req, res) => {
  try {
    const { etat } = req.body;
    const validStates = ["attend", "absent", "present"];
    if (!validStates.includes(etat)) {
      return res.status(400).json({ message: 'Invalid etat value' });
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { etat },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Etat updated successfully', patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// DELETE a patient by ID
app.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



async function updateExpiredAppointments() {
  try {
    const now = new Date();
    const result = await Patient.updateMany(
      { appointmentDate: { $lte: now }, etat: "attend" },
      { $set: { etat: "passed" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} patients with expired appointments.`);
    }
  } catch (error) {
    console.error("Error updating expired appointments:", error);
  }
}

// شغّل الدالة أول مرة عند تشغيل السيرفر
updateExpiredAppointments();

// ثم شغّلها كل دقيقة (60000 مللي ثانية) لتتأكد من تحديث الحالات فور مرور الموعد
setInterval(updateExpiredAppointments, 60000);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
