import mongoose from 'mongoose';

const { Schema } = mongoose;

const tokenDataSchema = new Schema(
  {
    token: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    },
    deviceId: {
      type: String,
      default: ''
    },
  },
  {
    timestamps: true
  }
);

const TokenData = mongoose.model("tokenData", tokenDataSchema);

export {
  TokenData,
}

