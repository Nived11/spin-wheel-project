import { Request, Response } from "express";
import User from "../models/User";
import Spin from "../models/Spin";
import { v4 as uuidv4 } from "uuid";

// ✅ UPDATED: All physical prizes, no coupons - Better Luck increased to 80%
const PRIZE_CONFIG = [
  { prize: "Better Luck Next Time", weight: 80 },
  { prize: "Wireless Earbuds", weight: 8 },
  { prize: "Gaming Mouse", weight: 4 },
  { prize: "Smartwatch", weight: 3 },
  { prize: "Power Bank", weight: 2 },
  { prize: "Gaming Keyboard", weight: 1.5 },
  { prize: "Tablet", weight: 1 },
  { prize: "iPhone 16 Pro", weight: 0.5 }
] as const;

const SPECIAL_PRIZE_POSITION = 100;
const SPECIAL_PRIZE_NAME = "iPhone 16 Pro";

// Create unique UID
export const createUID = async (req: Request, res: Response) => {
  const { name, phone, dobOrAnniversary } = req.body;

  if (!name || name.trim().length < 3) {
    return res.status(400).json({ msg: "Name must be at least 3 characters" });
  }

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ msg: "Phone must be 10 digits" });
  }

  if (!dobOrAnniversary || !dobOrAnniversary.includes(":")) {
    return res.status(400).json({ msg: "Date is required" });
  }

  const [selectedType, selectedDate] = dobOrAnniversary.split(":");

  if (!selectedDate || selectedDate.trim() === "") {
    return res.status(400).json({ msg: "Date is required" });
  }

  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    const existingSpin = await Spin.findOne({ uid: existingUser.uid });
    if (existingSpin) {
      return res.status(400).json({ msg: "You have already played" });
    }
  }

  const uid = "EMP-" + uuidv4().slice(0, 6).toUpperCase();
  await User.create({ uid, name, phone, dobOrAnniversary });

  const link = `${process.env.FRONTEND_URL}/spin?uid=${uid}`;
  res.json({ uid, link });
};

// Validate UID
export const validateUID = async (req: Request, res: Response) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ valid: false, msg: "UID is required" });
  }

  const user = await User.findOne({ uid });
  if (!user) {
    return res.status(400).json({ valid: false, msg: "Invalid UID" });
  }

  const used = await Spin.findOne({ uid });
  if (used) {
    return res.status(400).json({ valid: false, msg: "UID already used" });
  }

  res.json({ valid: true });
};

// Weighted prize generator
function choosePrize() {
  const total = PRIZE_CONFIG.reduce((acc, p) => acc + p.weight, 0);
  const random = Math.random() * total;

  let sum = 0;
  for (const p of PRIZE_CONFIG) {
    sum += p.weight;
    if (random <= sum) return p;
  }
  
  return PRIZE_CONFIG[0];
}

// Spin logic
export const spinWheel = async (req: Request, res: Response) => {
  try {
    const { uid } = req.body;

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(400).json({ msg: "Invalid UID" });
    }

    const existingSpin = await Spin.findOne({ uid });
    if (existingSpin) {
      return res.status(400).json({ msg: "Already spin" });
    }

    const spinCount = await Spin.countDocuments();
    const currentPosition = spinCount + 1;

    let result;
    
    if (currentPosition === SPECIAL_PRIZE_POSITION) {
      result = PRIZE_CONFIG.find(p => p.prize === SPECIAL_PRIZE_NAME);
      
      if (!result) {
        result = { prize: SPECIAL_PRIZE_NAME, weight: 0 };
      }
    } else {
      result = choosePrize();
    }

    await Spin.create({
      uid,
      prize: result.prize,
      probability: result.weight,
    });

    res.json({ prize: result.prize });
    
  } catch (error) {
    console.error("Spin error:", error);
    res.status(500).json({ msg: "Server error during spin" });
  }
};

// Get user details for certificate
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ msg: "UID is required" });
    }

    const user = await User.findOne({ uid });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const spin = await Spin.findOne({ uid });

    res.json({
      name: user.name,
      phone: user.phone,
      prize: spin?.prize || null,
      uid: user.uid,
    });
    
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
