import  mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
    {
        adminId: {
            type: String,
        },

        text: {
			type: String,
		},

       logo: {
            type: String,
        },

        fabIcon: {
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
