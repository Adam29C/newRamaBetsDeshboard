import mongoose from 'mongoose';
const gamesResultSchema = new mongoose.Schema({
    providerId: {
        type: String,
        required: true
    },
    providerName: {
        type: String,
        required: true
    },
    session: {
        type: String,
        required: true
    },
    resultDate: {
        type: String,
        required: true
    },
    winningDigit: {
        type: String,
        required: true
    },
    winningDigitFamily: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });

const GameResult = mongoose.model('GameResult', gamesResultSchema);
export {GameResult}