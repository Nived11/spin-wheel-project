import express from "express";
import { createUID, validateUID, spinWheel } from "../controllers/spinController";

const router = express.Router();

router.post("/create-uid", createUID);
router.get("/validate-uid", validateUID);
router.post("/spin", spinWheel);

export default router;
