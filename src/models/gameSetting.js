import mongoose from 'mongoose';

const gamesSettingSchema = new mongoose.Schema({
    gameType: {
        type: String,
    },
    providerId: {
        type: String,
        index: true // Index providerId for faster queries
    },
    providerName: {
        type: String,
    },  
    gameDay: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Enumerate valid days
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
        default: false // Default value set to false
    },
},
{
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false // Removes the __v field from MongoDB documents
});

// Compound index to ensure unique providerId and gameDay combination
gamesSettingSchema.index({ providerId: 1, gameDay: 1 }, { unique: true });

const GameSetting = mongoose.model('GameSetting', gamesSettingSchema);

export { GameSetting };
