import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  uid: String,
  name: String,
  phone: String,
  dobOrAnniversary: String,   // e.g. "birthday:2025-11-29"
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
