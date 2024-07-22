import mongoose from "mongoose";
const GameResultSchema = new mongoose.Schema({
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'GameProvider' },
    providerName: { type: String },
    session: { type: String },
    resultDate: { type: String },
    winningDigit: { type: String },
    DigitFamily: { type: String, required: true }, // Ensure required is set
    status: { type: String },
    createdAt: { type: Date, default: Date.now }
  });
  

const GameResult = mongoose.model('GameResult', GameResultSchema);
export {GameResult}