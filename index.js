import express from "express";
const app = express();

app.get("/", (req, res) => { res.json({ message: "Hello World!" }); });

app.listen(5000, () => console.log("Server started on port 5000 🔥🔥 siuuu"));