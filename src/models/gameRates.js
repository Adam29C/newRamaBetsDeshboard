import mongoose from 'mongoose';
const gameRateSchema = new mongoose.Schema({
    gameType:{
        type: String,
        required: true
    },
    gameName: {
        type: String,
        required: true
    },
    gamePrice: {
        type: Number,
        required: true
    },
},
    {
        timestamps: true,
        versionKey: false,
    });

const GameRate = mongoose.model('GameRate', gameRateSchema);
export {GameRate}

