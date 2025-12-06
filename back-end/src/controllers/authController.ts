import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check Super Admin
    if (
      username === process.env.SUPERADMIN_USERNAME &&
      password === process.env.SUPERADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username, role: "superadmin" },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
      return res.json({ token, role: "superadmin", msg: "Login successful" });
    }

    // Check Regular Admin
    if (
      username === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { username, role: "admin" },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
      );
      return res.json({ token, role: "admin", msg: "Login successful" });
    }

    // Invalid credentials
    return res.status(401).json({ msg: "Invalid credentials" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
