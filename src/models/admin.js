import  mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            min: 3,
            max: 255,
        },
        email: {
            type: String,
            required: false,
            max: 255,
            min: 6,
        }, 
        mobile: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
            max: 1024,
            min: 6,
        },
        username: {
            type: String,
            required: true,
            max: 1024,
            min: 4,
        },
        role: {
            type: String,
            default: "ADMIN"
        },

        user_counter: {
            type: Number,
            required: true,
        },
        banned: {
            type: Number,
            required: true,
        },
        CtreatedAt: {
            type: Date,
            default: Date.now(),
        },
        loginStatus: {
            type: String,
            required: true,
        },
        last_login: {
            type: String,
            required: true,
        },
        col_view_permission: {
            type: Array,
            required: true,
        },
        loginFor: {
            type: Number,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("admin", adminSchema);
