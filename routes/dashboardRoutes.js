import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { dashboardSummary } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/summary", authMiddleware, dashboardSummary);

export default router;
