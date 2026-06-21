app.post("/api/patients", (req, res) => {

    const patients =
        JSON.parse(fs.readFileSync("./data/patients.json"));

    const patient = {
        id: Date.now(),
        ...req.body
    };

    patients.push(patient);

    fs.writeFileSync(
        "./data/patients.json",
        JSON.stringify(patients, null, 2)
    );

    res.json(patient);

});

app.get("/api/patients", (req, res) => {

    const patients =
        JSON.parse(fs.readFileSync("./data/patients.json"));

    res.json(patients);

});

app.delete("/api/patients/:id", (req, res) => {

    let patients =
        JSON.parse(fs.readFileSync("./data/patients.json"));

    patients = patients.filter(
        p => p.id != req.params.id
    );

    fs.writeFileSync(
        "./data/patients.json",
        JSON.stringify(patients, null, 2)
    );

    res.json({
        message: "Patient deleted"
    });

});

app.put("/api/patients/:id", (req, res) => {

    const patients =
        JSON.parse(fs.readFileSync("./data/patients.json"));

    const index =
        patients.findIndex(
            p => p.id == req.params.id
        );

    patients[index] = {
        ...patients[index],
        ...req.body
    };

    fs.writeFileSync(
        "./data/patients.json",
        JSON.stringify(patients, null, 2)
    );

    res.json(patients[index]);

});

app.get("/api/patients/search/:name", (req, res) => {

    const patients =
        JSON.parse(fs.readFileSync("./data/patients.json"));

    const result = patients.filter(p =>
        p.fullName
        .toLowerCase()
        .includes(req.params.name.toLowerCase())
    );

    res.json(result);

});