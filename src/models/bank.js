import mongoose from "mongoose";

const mongooseSchema = new mongoose.Schema({
  userId: { type: String },
  deviceId: { type: String },
  accNumber: { type: Number },
  ifscCode: { type: String },
  bankName: { type: String },
  accName: { type: String },
});

const bank = new mongoose.model("bank",mongooseSchema);
export{bank}
