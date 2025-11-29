import mongoose from "mongoose";

const SpinSchema = new mongoose.Schema({
  uid: String,
  prize: String,
  probability: Number,
  spinTime: { type: Date, default: Date.now },
  redeemed: { type: Boolean, default: false },
  redemptionTime: Date
});

export default mongoose.model("Spin", SpinSchema);
