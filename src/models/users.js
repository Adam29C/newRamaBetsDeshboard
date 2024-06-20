import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

// Utility function to get current month and year in string format
const currentMonthAndYearInString = () => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const today = new Date();
  return `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
};

// Schema for mobile number with validation fields
const MobileNumberValidator = {
  value: {
    type: Number,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
    select: false
  },
};

const BankDetailSchema = new Schema({
  bankName: {
    type: String,
  },
  branchName: {
    type: String,
  },
  accountNumber: {
    type: Number,
  },
  holderName: {
    type: String,
  },
  ifscCode: {
    type: String,
  }
});

const UserSchema = new Schema({
  userName: {
    type: String,
  },
  mobileNumber: MobileNumberValidator,
  roles: {
    type: String,
    enum: ["USER", "ADMIN"],
    default: "USER",
  },
  fcmToken: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "active", "deactivate"],
    default: "pending",
  },
  loginStatus: {
    type: String,
    enum: ["loggedIn", "loggedOut"],
  },
  appInstalledStatus: {
    type: String,
  },
  memberSince: {
    type: String,
    default: currentMonthAndYearInString
  },
  bankDetails: {
    type: BankDetailSchema,
  },
}, {
  collection: "users",
  timestamps: true
});

UserSchema.methods.correctPassword = async function (clientPassword, savedPassword) {
  return await bcrypt.compare(clientPassword, savedPassword);
};

UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.pinChangedAt) {
    const changedTimestamp = parseInt(this.pinChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const Users = mongoose.model("users", UserSchema);

export { Users };
