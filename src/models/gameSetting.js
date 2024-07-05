import mongoose from 'mongoose';
const gamesSettingSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    gameDay: {
        type: String,
        required: true
    },
    OBT: {
        type: String,
        required: true
    },
    CBT: {
        type: String,
        required: true
    },
    OBRT: {
        type: String,
        required: true
    },
    CBRT: {
        type: String,
        required: true
    },
    isClosed: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        versionKey: false
    });

const GameSetting = mongoose.model('GameSetting', gamesSettingSchema);
export { GameSetting }
