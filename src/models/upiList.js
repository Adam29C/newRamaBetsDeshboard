import mongoose from "mongoose";
const upiListSchema = new mongoose.Schema({
    upiName: {
        type: String,
        require: true
    },
    status: {
        type: String,
        default:false
    }
}, {
    timestamps: true,
});

const UpiList = mongoose.model('UpiList', upiListSchema);
export {UpiList}