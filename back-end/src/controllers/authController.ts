// backend/src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

// backend/src/controllers/authController.ts
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username, role: "admin" },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" } // Changed to 7 days
    );
    
    res.json({ token, msg: "Login successful" });
  } else {
    res.status(401).json({ msg: "Invalid credentials" });
  }
};
