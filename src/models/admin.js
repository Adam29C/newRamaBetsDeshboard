import  mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        employeeName: {
            type: String,
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
			max: 1024,
			min: 4,
		},
        permission: {
            type: Object,
            default:{}
        },
        loginPermission:{
         type:Number,
         require:true
         /**
          * 0-for both,
          * 1-for dashboad
          * 2-for chat panel
          */
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
