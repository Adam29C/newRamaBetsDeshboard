import { required } from "joi";
import mongoose from "mongoose";
const game_bidsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    cardId: { type: String, required: true },
    cardName:{type: String, required: true},
    providerId: {
      type: String,
      required: true,
    },
    gameTypeId: {
      type: String,
      required: false,
    },
    providerName: {
      type: String,
      required: true,
    },
    gameTypeName: {
      type: String,
      required: false,
    },
    gameTypePrice: {
      type: Number,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    bidDigit: {
      type: String,
      required: true,
    },
    biddingPoints: {
      type: Number,
      required: true,
    },
    winStatus: {
      type: Number,
      required: true,
    },
    gameWinPoints: {
      type: Number,
      required: true,
    },
    gameDate: {
      type: String,
      required: true,
    },
    dateStamp: {
      type: Number,
      required: false,
    },
    gameSession: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "createTime",
      updatedAt: "updatedTime",
    },
  }
);

const game_bids = mongoose.model("game_bids", game_bidsSchema);
export { game_bids };
