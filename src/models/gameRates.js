import mongoose from 'mongoose';
const gameRateSchema = new mongoose.Schema({
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

