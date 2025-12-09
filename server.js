import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
app.use(cors()); // allow your frontend to call backend
app.use(express.json());

app.use("/api/auth", authRoutes);

// simple health check
app.get("/", (req, res) => res.send("API running"));

connectDB();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server ${PORT}`));
