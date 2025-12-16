import express from "express";
import { createUID, validateUID, spinWheel , getUserDetails} from "../controllers/spinController";

const router = express.Router();

router.post("/create-uid", createUID);
router.get("/validate-uid", validateUID);
router.post("/spin", spinWheel);
router.get("/user-details", getUserDetails);


export default router;
