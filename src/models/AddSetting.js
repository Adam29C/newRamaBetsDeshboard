import mongoose from 'mongoose';

const gamesSettingSchema = new mongoose.Schema({
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
    modifiedAt: {
        type: String,
        required: true
    }
}, {
    versionKey: false
});

export default mongoose.model('games_setting', gamesSettingSchema);
