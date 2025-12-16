import { Request, Response } from "express";
import User from "../models/User";
import Spin from "../models/Spin";
import { v4 as uuidv4 } from "uuid";

// Updated prize distribution
const prizes = [
  { prize: "Better Luck Next Time", weight: 74 },
  { prize: "Pepsi 200ml", weight: 10 },
  { prize: "5% OFF", weight: 5 },
  { prize: "Watermelon Juice", weight: 5 },
  { prize: "Gift", weight: 3 },
  { prize: "10% OFF", weight: 2 },
  { prize: "Free Full Mandi", weight: 1 }
];

// Create unique UID
export const createUID = async (req: Request, res: Response) => {
  const { name, phone, dobOrAnniversary } = req.body;

  // Simple validations
  if (!name || name.trim().length < 3) {
    return res.status(400).json({ msg: "Name must be at least 3 characters" });
  }

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ msg: "Phone must be 10 digits" });
  }

  // Validate date
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

  const user = await User.findOne({ uid });
  if (!user) return res.status(400).json({ valid: false, msg: "Invalid UID" });

  const used = await Spin.findOne({ uid });
  if (used) return res.status(400).json({ valid: false, msg: "UID already used" });

  res.json({ valid: true });
};

// Weighted prize generator
function choosePrize() {
  const total = prizes.reduce((acc, p) => acc + p.weight, 0);
  const random = Math.random() * total;

  let sum = 0;
  for (const p of prizes) {
    sum += p.weight;
    if (random <= sum) return p;
  }
  
  // Fallback to first prize
  return prizes[0];
}

// Spin logic
export const spinWheel = async (req: Request, res: Response) => {
  const { uid } = req.body;

  const user = await User.findOne({ uid });
  if (!user) return res.status(400).json({ msg: "Invalid UID" });

  const used = await Spin.findOne({ uid });
  if (used) return res.status(400).json({ msg: "Already spin" });

  // Count total spins to determine position
  const spinCount = await Spin.countDocuments();
  const currentPosition = spinCount + 1; // This user's position

  let result;
  
  // Check if this is the 50th user
  if (currentPosition === 50) {
    // Force "Free Full Mandi" for 50th user
    result = prizes.find(p => p.prize === "Free Full Mandi");
  } else {
    // Regular weighted random for all other users
    result = choosePrize();
  }

  await Spin.create({
    uid,
    prize: result!.prize,
    probability: result!.weight,
  });


  res.json({ prize: result!.prize });
};

// Get user details for certificate
export const getUserDetails = async (req: Request, res: Response) => {
  const { uid } = req.query;

  const user = await User.findOne({ uid });
  if (!user) return res.status(404).json({ msg: "User not found" });

  const spin = await Spin.findOne({ uid });

  res.json({
    name: user.name,
    phone: user.phone,
    prize: spin?.prize || null,
    uid: user.uid,
  });
};
