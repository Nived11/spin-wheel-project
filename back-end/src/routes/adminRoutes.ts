// backend/src/routes/adminRoutes.ts
import express from "express";
import { login } from "../controllers/authController";
import { verifyAdmin } from "../middleware/authMiddleware";
import { getAllUsers, getStats, markRedeemed, deleteUser } from "../controllers/adminController";

const router = express.Router();

// Public route
router.post("/login", login);

// Protected routes
router.get("/users", verifyAdmin, getAllUsers);
router.get("/stats", verifyAdmin, getStats);
router.post("/redeem", verifyAdmin, markRedeemed);
router.delete("/users/:uid", verifyAdmin, deleteUser);

export default router;
