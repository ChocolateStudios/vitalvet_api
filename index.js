import "dotenv/config";
import { sequelize } from "./database/connectdb.js";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

import authRouter from "./routes/auth.route.js";

await sequelize.sync();
const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || whiteList.includes(origin)) {
            return callback(null, origin);
        }
        return callback(new Error("Not allowed by CORS: " + origin));
    }
}));

app.use(express.json());
app.use(cookieParser());

const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VetalVet API Documentation",
            version: "1.0.0",
            description: "VetalVet API Documentation",
        },
        servers: [
            {
                url: process.env.SERVER_URL,
            }
        ],
    },
    apis: ["./routes/*.route.js", "./models/*.js"],
}
app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

app.use('/api/v1/auth', authRouter);

// app.use(express.static('public'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started on port " + PORT + " 🔥🔥 http://localhost:" + PORT));