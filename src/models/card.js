import mongoose from "mongoose";

const cardSchema = mongoose.Schema(
  {
    cardName: { type: String, required: true },
    cardImage: { type: String, required: true },
    status: { type: Boolean, default: true }, // Fixed typo from 'defauld' to 'default'
    cardInfo: {
      MainGame: { type: Boolean, default: true },
      StarLine: { type: Boolean, default: true },
      JackPot: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

const Card = mongoose.model("Card", cardSchema);
export { Card };
