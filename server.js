console.log("🚀 STARTING THE BRAND NEW BIODENT SERVER ON PORT 3500 🚀");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3500; // Changed port to kill ghost background processes instantly

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

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
        id: Date.now(), // Generates timestamp ID
        name,
        phone,
        date,
        status: "Pending"
    };

    let appointments = [];
    if (fs.existsSync("./data/appointments.json")) {
        appointments = JSON.parse(fs.readFileSync("./data/appointments.json"));
    }

    appointments.push(appointment);

    if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
    }

    fs.writeFileSync(
        "./data/appointments.json",
        JSON.stringify(appointments, null, 2)
    );

    res.send(`
        <script>
            alert("🎉 Appointment Booked Successfully!");
            window.location.href = "/"; 
        </script>
    `);
});

app.get("/api/appointments", (req, res) => {
    if (fs.existsSync("./data/appointments.json")) {
        const appointments = JSON.parse(fs.readFileSync("./data/appointments.json"));
        res.json(appointments);
    } else {
        res.json([]);
    }
});

// 🔥 ENHANCED DELETE ROUTE WITH ERROR REPORTING
app.post("/api/appointments/delete/:id", (req, res) => {
    const appointmentId = req.params.id;
    const filePath = "./data/appointments.json";

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: "Database file (appointments.json) does not exist yet." });
    }

    try {
        let appointments = JSON.parse(fs.readFileSync(filePath));
        
        // Convert both IDs to strings to prevent comparison bugs
        appointments = appointments.filter(a => String(a.id) !== String(appointmentId));
        
        fs.writeFileSync(filePath, JSON.stringify(appointments, null, 2));
        return res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to rewrite the database file layout." });
    }
});

app.get("/api/dashboard", (req, res) => {
    let patients = [];
    if (fs.existsSync("./data/patients.json")) {
        patients = JSON.parse(fs.readFileSync("./data/patients.json"));
    }

    let appointments = [];
    if (fs.existsSync("./data/appointments.json")) {
        appointments = JSON.parse(fs.readFileSync("./data/appointments.json"));
    }

    res.json({
        totalPatients: patients.length + appointments.length,
        totalAppointments: appointments.length,
        pendingAppointments: appointments.length,
        completedAppointments: 0
    });
});

app.listen(PORT, () => {
    console.log(`Server successfully running on http://localhost:${PORT}`);
});