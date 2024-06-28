import mongoose from "mongoose";
const gamesSchema = new mongoose.Schema(
	{   
		game:{
         type:"String"
		},

		providerName: {
			type: String,
			// required: true,
		},

		providerResult: {
			type: String,
		},

		resultStatus: {
			type: Number,
		},
		activeStatus: {
			type: Boolean,
			
		},
		modifiedAt: {
			type: String,
			required: true,
		},
		mobile:{
			type: String,
		}
	},
	{
		versionKey: false,
	},
    {
        timestamps:true
    }	
);

export default  mongoose.model("GameProvider", gamesSchema);

