import express from "express";
import {
  recordMeasure,
  recordReduction,
  purchaseOffset,
  
} from "../controllers/carbonController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/measure", authMiddleware, recordMeasure);

router.post("/reduce" , authMiddleware, recordReduction);

router.post("/offset", authMiddleware, purchaseOffset);


export default router;
