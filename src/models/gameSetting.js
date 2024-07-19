import mongoose from 'mongoose';

const gamesSettingSchema = new mongoose.Schema({
    gameType: {
        type: String,
        required: true
    },
    providerName: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
    },
    gameSatingInfo: [{
        gameDay: {
            type: String,
            // enum: ['all','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        OBT: {
            type: String,
        },
        CBT: {
            type: String,
        },
        OBRT: {
            type: String,
        },
        CBRT: {
            type: String,
        },
        isClosed: {
            type: Boolean,
            default: false
        }
    }]
},
{
    timestamps: true,
    versionKey: false
});



const GameSetting = mongoose.model('GameSetting', gamesSettingSchema);

export { GameSetting };
