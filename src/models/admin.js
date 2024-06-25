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
            max: 1024,
            min: 4,
        },
        role: {
            type: String,
        },

        isBlock: {
            type: Boolean,
            default:false
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
            type: Object,
            default:{}
        },
    },
    {
        timestamps:true
    }
);

export default mongoose.model("admin", adminSchema);
