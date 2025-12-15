import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import carbonRoutes from "./routes/carbonRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
const app = express();
app.use(cors()); 
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/carbon", carbonRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => res.send("API running"));

connectDB();
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server ${PORT}`));
