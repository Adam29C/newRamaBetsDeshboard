import mongoose from 'mongoose';

const gamesSchema = new mongoose.Schema({
  gameType: {
    type: String,
    enum: ['MainGame', 'StarLine', 'JackPot'],
    required: true,
  },
  game: {
    type: String,
  },
  providerName: {
    type: String,
  },
  providerResult: {
    type: String,
  },
  mobile: {
    type: String,
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
  timestamps: true,
});

const GameProvider = mongoose.model('GameProvider', gamesSchema);
export { GameProvider };
