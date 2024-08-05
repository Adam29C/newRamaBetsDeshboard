import mongoose from "mongoose";

const withDrawAppMessage = new mongoose.Schema({
        textMain : {
            type: String,
            required: true
        },
        textSecondry : {
            type: String,
            required: true
        },
        Number:{
            type: Number,
            required: true
        },
        Timing:{
            type: String,
            required: true
        },
    },
    {   timestamps:true,
        versionKey : false
    });

const WithDrawAppMessage = mongoose.model('WithDrawAppMessage', withDrawAppMessage);

export{WithDrawAppMessage}