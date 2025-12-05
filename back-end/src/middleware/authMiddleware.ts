import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided or wrong format");
    return res.status(401).json({ msg: "No token provided" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // console.log("Token verified:", decoded);
    
    // Use req.user instead of req.body.admin
    req.user = decoded;
    next();
  } catch (error: any) {
    console.log("Token verification failed:", error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: "Token expired" });
    }
    
    return res.status(401).json({ msg: "Invalid token" });
  }
};
