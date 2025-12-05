import { Request, Response } from "express";
import User from "../models/User";
import Spin from "../models/Spin";
import { v4 as uuidv4 } from "uuid";

const prizes = [
  { prize: "Free Full Mandi", weight: 1 },
  { prize: "20% OFF", weight: 4 },
  { prize: "10% OFF", weight: 10 },
  { prize: "Free Lime Juice", weight: 10 },
  { prize: "5% OFF", weight: 10 },
  { prize: "Better Luck Next Time", weight: 65 }
];


// Create unique UID
export const createUID = async (req: Request, res: Response) => {
  const { name, phone, dobOrAnniversary } = req.body;

  // simple validations
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
}

// Spin logic
export const spinWheel = async (req: Request, res: Response) => {
  const { uid } = req.body;

  const user = await User.findOne({ uid });
  if (!user) return res.status(400).json({ msg: "Invalid UID" });

  const used = await Spin.findOne({ uid });
  if (used) return res.status(400).json({ msg: "Already spin" });

  const result = choosePrize();

  await Spin.create({
    uid,
    prize: result!.prize,
    probability: result!.weight,
  });

  // For demo (simulate WhatsApp)
  console.log(`Send WhatsApp: Congrats ${user.name}, you won ${result!.prize}`);

  res.json({ prize: result!.prize });
};
