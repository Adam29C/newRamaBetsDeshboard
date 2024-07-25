import mongoose from "mongoose";
const GameResultSchema = new mongoose.Schema({
    providerId: { type: String },
    providerName: { type: String },
    session: { type: String },
    resultDate: { type: String },
    winningDigit: { type: String },
    DigitFamily: { type: String, required: true }, // Ensure required is set
    status: { type: String }, 
  },{
    timestamps:true
  });
  

const GameResult = mongoose.model('GameResult', GameResultSchema);
export {GameResult}