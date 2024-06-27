import  mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
    {
        adminId: {
            type: String,
        },

        title: {
			type: String,
		},

       logo: {
            type: String,
        },

        favIcon: {
			type: String,
		},
        
        backgroundImage:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

export default mongoose.model("System", systemSchema);
