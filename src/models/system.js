import  mongoose from "mongoose";

const systemSchema = new mongoose.Schema(
    {
        userId: {
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
        
        baclgroundImage:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

export default mongoose.model("System", systemSchema);
