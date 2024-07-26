import mongoose from "mongoose";

const deletedUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    deviceName: {
        type: String,
    },
    deviceId: {
        type: String,
    },
    reason:{
        type:String,
        require:true
    },
    deletedAt: {
        type: Date,
        default: Date.now 
    }
}, {
    versionKey: false,
    timestamps: true 
});

const DeletedUser = mongoose.model('DeletedUser', deletedUserSchema);
export {DeletedUser}