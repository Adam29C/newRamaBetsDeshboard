import mongoose from "mongoose";
const howtoplaySchema = new mongoose.Schema({
    howtoplay: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            videoUrl: {
                type: String,
                required: true
            }
        }
    ]
}, {
    timestamps:true,
    versionKey: false
});

const HowToPlay = mongoose.model('HowToPlay', howtoplaySchema);
export {HowToPlay}