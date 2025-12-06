import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Verify any authenticated user (admin or superadmin)
export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Verify super admin only
export const verifySuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    if (decoded.role !== "superadmin") {
      return res.status(403).json({ msg: "Access denied. Super admin only." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
