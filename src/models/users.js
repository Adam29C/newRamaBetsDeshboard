import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 255,
    },
    username: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    deviceName: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    email: {
      type: String,
    },
    firebaseId: {
      type: String,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    wallet_balance: {
      type: Number,
      default:0
    },
    wallet_bal_updated_at: {
      type: String,
    },
    isRegister:{
      type:Boolean,
      default:false
    },
    mpin: {
      type: String,
    },
    fingerPrint: {
      type: String,
    },
    register_via: {
      type: Number,
      // 1: registered from android, 2: registered from web
    },
    mpinOtp: {
      type: Number,
    },
    deviceVeriOTP: {
      type: Number,
    },
    CreatedAt: {
      type: String,
    },
    UpdatedAt: {
      type: String,
    },
    changeDetails: {
      type: Array,
    },
    loginStatus: {
      type: String,
    },
    mainNotification: {
      type: Boolean,
    },
    gameNotification: {
      type: Boolean,
    },
    starLineNotification: {
      type: Boolean,
    },
    andarBaharNotification: {
      type: Boolean,
    },
    time: {
      type: String,
    },
    timestamp: {
      type: Number,
    },
    blockReason: {
      type: String,
    },
    lastLoginDate: {
      type: String,
    },
    otp:{
      type:Number
    },
    isVerified:{
      type:Boolean,
      default:false
    },
    language:{
      type:String
    },
    state:{
      type:String
    },
    city:{
      type:String
    },
    
  },
  {
    versionKey: false,
    timestamps:true
  }
);

const Users = mongoose.model("Users", userSchema);
export {Users}