import express from "express";
import { login } from "../controllers/authController";
import { verifyAuth, verifySuperAdmin } from "../middleware/authMiddleware";
import { getUsersForRedemption, getAllUsers, getFullStats, markRedeemed, deleteUser,} from "../controllers/adminController";

const router = express.Router();

// Public route
router.post("/login", login);

// Both admin & superadmin can access (same stats)
router.get("/stats", verifyAuth, getFullStats);
router.post("/redeem", verifyAuth, markRedeemed);

// User list endpoints
router.get("/users/redeem", verifyAuth, getUsersForRedemption); // Admin endpoint
router.get("/users", verifyAuth, getAllUsers); // Super admin endpoint (same data)

// Super admin only
router.delete("/users/:uid", verifySuperAdmin, deleteUser);

export default router;
