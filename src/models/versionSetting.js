import mongoose from "mongoose";
const versionSchema = new mongoose.Schema({
        appVersion: {
            type: Number,
            required: false
        },
        forceUpdate: {
            type: Boolean,
            required: false
        },
        apkFileName: {
            type: String,
            required: false
        },
        maintainence: {
            type: Boolean,
            required: false
        },
    },
    {
    timestamps:true    
    });

const VersionSetting  = mongoose.model('VersionSetting', versionSchema);
export {VersionSetting}