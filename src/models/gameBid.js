import mongoose from "mongoose";
const game_bidsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    providerId: {
      type: String,
    },
    cardId:{type:String}, 
    cardName:{type:String},
    gameTypeId: {
      type: String,
      required: false,
    },
    providerName: {
      type: String,
    },
    gameTypeName: {
      type: String,
      required: false,
    },
    gameTypePrice: {
      type: Number,
    },
    userName: {
      type: String,
    },
    mobileNumber: {
      type: String,
    },
    bidDigit: {
      type: String,
    },
    biddingPoints: {
      type: Number,
    },
    winStatus: {
      type: Number,
    },
    gameWinPoints: {
      type: Number,
    },
    gameDate: {
      type: String,
    },
    dateStamp: {
      type: Number,
      required: false,
    },
    gameSession: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
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
const gameBid = mongoose.model("gameBid", game_bidsSchema);
export { gameBid };
