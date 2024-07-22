import mongoose from "mongoose";

const digitsSchema = new mongoose.Schema({
    Digit: {
        type: Number,
        required: true
    },
    DigitFamily:{
        type: Number,
        required: true
    }
}, {
    versionKey: false
});

const gameDigit = mongoose.model('gameDigit', digitsSchema);
export { gameDigit };
