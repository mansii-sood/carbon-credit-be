import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login" , loginUser);

export default router;
