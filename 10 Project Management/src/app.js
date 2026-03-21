import express from "express";
import cors from "cors";
const app = express();

// Basic Middleware for configuration of the app

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Cors confqiguration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Importing Routes
import healthCheckRoutes from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to the Project Management API");
});

export default app;
