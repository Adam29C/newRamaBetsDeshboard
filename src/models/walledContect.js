import mongoose from "mongoose";

const walletContactSchema = new mongoose.Schema({
        number: {
            type: Number,
        },
        headline:{
            type:String,
        },
        upiId:{
            type:String,
        },
    },
    {
        timeStamp:true,
        // versionKey : false
    });

const WalletContact = mongoose.model('WalletContact', walletContactSchema);

export {WalletContact}