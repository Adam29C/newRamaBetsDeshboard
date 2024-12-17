const mongoose =require("mongoose");
const termsCondition = new mongoose.Schema({
    text:{
        type:String
    }
},{
    timestamps:true
});
export default mongoose.model("TermCond", termsCondition);
