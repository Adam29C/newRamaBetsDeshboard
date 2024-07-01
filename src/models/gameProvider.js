import mongoose from "mongoose";

const gamesSchema = new mongoose.Schema(
  {
    game: {
      type: String,
    },
    providerName: {
      type: String,
	  unique: true
    },
    providerResult: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    resultStatus: {
      type: Number,
    },
    activeStatus: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
);

export default mongoose.model("GameProvider", gamesSchema);
