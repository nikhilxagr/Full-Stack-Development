import express from "express";
import cors from "cors";
const app = express();

// Basic Middleware for configuration of the app

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true , limit:"16kb"}));
app.use(express.static("public"));


// Cors confqiguration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
  Credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/", (req, res) => {
  res.send("Welcome to the Project Management API");
});

export default app;