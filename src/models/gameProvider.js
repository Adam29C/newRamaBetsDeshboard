import mongoose from 'mongoose';

const gamesSchema = new mongoose.Schema({
  gameType: {
    type: String,
    required: true
  },
  game: {
    type: String,
  },
  providerName: {
    type: String,
    unique: true,
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
  timestamps: true,
});

const GameProvider = mongoose.model('GameProvider', gamesSchema);
export { GameProvider }



