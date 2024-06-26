import  mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        employeeName: {
            type: String,
            required: true,
            min: 3,
            max: 255,
        },
        username: {
			type: String,
			required: true,
			unique: true,
			max: 1024,
			min: 4,
		},
        password: {
            type: String,
            required: true,
            max: 1024,
            min: 6,
        },
        designation: {
			type: String,
			required: true,
			max: 1024,
			min: 4,
		},
        Permission: {
            type: Object,
            default:{}
        }, 
        mobile: {
            type: String,
            required: false,
        },
        knowPassword:{
            type:String
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
        },
        last_login: {
            type: String,
        },

    },
    {
        timestamps:true
    }
);

export default mongoose.model("Admin", adminSchema);
