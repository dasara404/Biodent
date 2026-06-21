app.post("/login", (req, res) => {

    const users =
        JSON.parse(fs.readFileSync("./data/users.json"));

    const user = users.find(u =>
        u.username === req.body.username &&
        u.password === req.body.password
    );

    if(!user){
        return res.status(401).json({
            message:"Invalid credentials"
        });
    }

    res.json({
        message:"Login successful",
        role:user.role
    });

});

