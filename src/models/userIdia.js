import mongoose from "mongoose";

const newIdeasSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    idea: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    approveIdea: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

const UserIdea = mongoose.model('UserIdea', newIdeasSchema);
export { UserIdea };
