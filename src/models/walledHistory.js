import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
   userId:{
    type:String
   },
   amount:{
    type:Number
   },
   description:{
    type:String
   }
},{timestamps:true})

const wallet =new mongoose.model("wallet",walletSchema);

export{wallet}
