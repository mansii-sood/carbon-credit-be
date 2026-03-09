import express from "express";
import {
  recordMeasure,
  recordReduction,
  purchaseOffset,
  shareCredits,
  getOffsetTransactions
  
} from "../controllers/carbonController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/measure", authMiddleware, recordMeasure);

router.post("/reduce" , authMiddleware, recordReduction);

router.post("/offset", authMiddleware, purchaseOffset);

router.get("/offsets", authMiddleware, getOffsetTransactions);

router.post("/share", authMiddleware, shareCredits);


export default router;
