import "dotenv/config";
import { sequelize } from "./database/connectdb.js";
import express from "express";
import authRouter from "./routes/auth.route.js";

await sequelize.sync();
const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " + PORT + " 🔥🔥 http://localhost:" + PORT));