import mongoose from "mongoose";
const termsCondition = new mongoose.Schema({
    text:{
        type:String
    }
},{
    timestamps:true
});

const TermCond= mongoose.model("TermCond", termsCondition);
export { TermCond };
