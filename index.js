import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import authRouter from "./routes/auth.route.js";
import profilesRouter from "./routes/profiles.route.js";
import patientsRouter from "./routes/patients.route.js";
import speciesRouter from "./routes/species.route.js";
import ownersRouter from "./routes/owners.route.js";
import eventTypeRouter from "./routes/eventTypes.route.js";
import eventRouter from "./routes/events.route.js";
import medicinesRouter from "./routes/medicines.route.js";
import documentFilesRouter from "./routes/documentFiles.route.js";
import "./database/dbContext.js";

export const app = express();

const whiteList = [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3];

app.use(cors({
    origin: function (origin, callback) {
        console.log('🍏Allowed by CORS: ' + origin);
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
    apis: ["./routes/*.route.js", "./models/*.js", "./utils/*.js"],
}

app.use('/api/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/profiles', profilesRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/species', speciesRouter);
app.use('/api/v1/owners', ownersRouter);
app.use('/api/v1/eventTypes', eventTypeRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/medicines', medicinesRouter);
app.use('/api/v1', documentFilesRouter);


app.use(express.static('public'));

let PORT = process.env.PORT || 5000;

if (process.env.MODE === "test")
    PORT = 5015;

export const server = app.listen(PORT, () => console.log("Server started on port " + PORT + " 🔥🔥 http://localhost:" + PORT));