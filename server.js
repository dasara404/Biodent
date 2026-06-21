console.log("🚀 STARTING THE BRAND NEW BIODENT SERVER ON PORT 3500 🚀");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3500; 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// 🌟 VERCEL FIX: This points your database file to the allowed temporary folder
const filePath = "/tmp/appointments.json";

// Helper function to safely read appointments without crashing
const readAppointments = () => {
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath));
        } catch (e) {
            return [];
        }
    }
    return [];
};

// Page Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/appointments", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "appointments.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// Appointment booking logic
app.post("/appointment", (req, res) => {
    const { name, phone, date } = req.body;

    const appointment = {
        id: Date.now(), 
        name,
        phone,
        date,
        status: "Pending"
    };

    let appointments = readAppointments();
    appointments.push(appointment);

    // Save directly to Vercel's temporary folder
    fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2));

    res.send(`
        <script>
            alert("🎉 Appointment Booked Successfully!");
            window.location.href = "/"; 
        </script>
    `);
});

app.get("/api/appointments", (req, res) => {
    const appointments = readAppointments();
    res.json(appointments);
});

// DELETE ROUTE
app.post("/api/appointments/delete/:id", (req, res) => {
    const appointmentId = req.params.id;

    try {
        let appointments = readAppointments();
        appointments = appointments.filter(a => String(a.id) !== String(appointmentId));
        
        fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2));
        return res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to update appointments." });
    }
});

app.get("/api/dashboard", (req, res) => {
    let appointments = readAppointments();

    res.json({
        totalPatients: appointments.length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.length,
        completedAppointments: 0
    });
});

app.listen(PORT, () => {
    console.log(`Server successfully running on http://localhost:${PORT}`);
});