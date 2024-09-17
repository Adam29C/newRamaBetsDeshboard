import mongoose from "mongoose";

const fundreqSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    fullname: {
      type: String,
    },
    amount:{
      type:Number
    },
    username: {
      type: String,
    },
    mobile: {
      type: String,
    },
    reqAmount: {
      type: Number,
    },
    reqType: {
      type: String,
    },
    reqStatus: {
      type: String,
    },
    fromExport: {
      type: Boolean,
      required: false,
    },
    from: {
      type: Number, //0 : from export, 1: from chatpanel or view Wallet, 2 : from pending Debit
      required: false,
    },

    accNumber: { type: String, required: false },
    ifscCode: { type: String, required: false },
    bankName: { type: String, required: false },
    accName: { type: String, required: false },
    reqDate: { type: String },
    reqTime: { type: String },
    withdrawalMode: {
      type: String,
    },
    UpdatedBy: {
      type: String,
      required: false,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    reqUpdatedAt: {
      type: String,
    },
    timestamp: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const fundRequest = mongoose.model("fundRequest", fundreqSchema);
export { fundRequest };
