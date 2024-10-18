import mongoose from "mongoose";

const mongooseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  deviceId: { type: String, required: false },
  accNumber: { type: String, required: false }, // Change to String to match userProfile
  ifscCode: { type: String, required: false },
  bankName: { type: String, required: false },
  accName: { type: String, required: false },
  address: { type: String, required: false }, // Added field
  city: { type: String, required: false },     // Added field
  pincode: { type: String, required: false },  // Added field
  paytm_number: { type: String, required: false }, // Added field
  created_at: { type: String, required: true }, // Added field
  updatedAt: { type: String, required: false },  // Added field
  profileChangeCounter: { type: Number, required: false }, // Added field
  changeDetails: { type: Array, required: false }, // Added field
}, {
  timestamps: true
});

const bank = new mongoose.model("bank", mongooseSchema);
export { bank };

