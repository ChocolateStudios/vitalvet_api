import "dotenv/config";
import { sequelize } from "./database/connectdb.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

import authRouter from "./routes/auth.route.js";

await sequelize.sync();
const app = express();

const whiteList = [process.env.ORIGIN1]

app.use(cors({
    origin: function(origin, callback) {
        if (whiteList.includes(origin)) {
            return callback(null, origin);
        }
        return callback(new Error("Not allowed by CORS: " + origin));
    }
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);

app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " + PORT + " 🔥🔥 http://localhost:" + PORT));