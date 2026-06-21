app.post("/api/appointments", (req, res) => {

    const appointments =
        JSON.parse(fs.readFileSync("./data/appointments.json"));

    const appointment = {
        id: Date.now(),
        status: "Pending",
        ...req.body
    };

    appointments.push(appointment);

    fs.writeFileSync(
        "./data/appointments.json",
        JSON.stringify(appointments, null, 2)
    );

    res.json(appointment);

});

app.put("/api/appointments/:id/approve", (req, res) => {

    const appointments =
        JSON.parse(fs.readFileSync("./data/appointments.json"));

    const appointment =
        appointments.find(
            a => a.id == req.params.id
        );

    appointment.status = "Approved";

    fs.writeFileSync(
        "./data/appointments.json",
        JSON.stringify(appointments, null, 2)
    );

    res.json(appointment);

});

app.put("/api/appointments/:id/complete", (req, res) => {

    const appointments =
        JSON.parse(fs.readFileSync("./data/appointments.json"));

    const appointment =
        appointments.find(
            a => a.id == req.params.id
        );

    appointment.status = "Completed";

    fs.writeFileSync(
        "./data/appointments.json",
        JSON.stringify(appointments, null, 2)
    );

    res.json(appointment);

});

app.put("/api/appointments/:id/cancel", (req, res) => {

    const appointments =
        JSON.parse(fs.readFileSync("./data/appointments.json"));

    const appointment =
        appointments.find(
            a => a.id == req.params.id
        );

    appointment.status = "Cancelled";

    fs.writeFileSync(
        "./data/appointments.json",
        JSON.stringify(appointments, null, 2)
    );

    res.json(appointment);

});



