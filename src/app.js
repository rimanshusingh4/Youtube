import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser'; // eska kaam hai, mere server se user ke browser ki cookies ko use and set kar pau, basically CRUD operation.


const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,

}));

// most of the time jb v hum middleware use karte hai toh app.use ka hi use karke karte hai.
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"})); // extended means URL me objects ke ander v object de sakte hai.
app.use(express.static("public"))
app.use(cookieParser())

//  Import Routes

import userRoutes from './routes/user.routes.js'

// routes declaration
app.use("/user", userRoutes);


export {app};