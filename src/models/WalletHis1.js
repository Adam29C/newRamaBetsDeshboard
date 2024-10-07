import mongoose from 'mongoose';
const walletHistorySchema = new mongoose.Schema({
    userId: {
        type: String,   
    },
    bidId: {
        type: String,
        required: false
    },
    admin_id: {
        type: String,
        required: false
    },
    provider_id: {
        type: String,
        required: false
    },
    filterType: {
        type: Number,  
        required: false
    },
    provider_ssession: {
        type: String,
        required: false
    },
    addedBy_name: {
        type: String,
        required: false
    },
    previous_amount: {
        type: Number,
        
    },
    current_amount: {
        type: Number,
        
    },
    transaction_amount: {
        type: Number,
        
    },
    description: {
        type: String,
        
    },
    transaction_date: {
        type: String,
        
    },
    transaction_time: {
        type: String,
        
    },
    transaction_status: {
        type: String,
        
    },
    win_revert_status: {
        type: Number,
        required: false
    },
    particular: {
        type: String,
        required: false
    },
    upiId: {
        type: String,
    },
    timestamp: {
        type: Number,
    },
    fullname: {
        type: String,
    },
    reqType: {
        type: String,
        required: false
    },
    username: {
        type: String,
        
    },
    mobile: {
        type: String,
        required: false
    },
    transaction_id: {
        type: String,
        required: false
    }
},
    {
        versionKey: false,
        timestamps: {
            createdAt: 'createTime',
            updatedAt: 'updatedTime'
        }
    }
);
const WalletHis = mongoose.model('WalletHis', walletHistorySchema);
export{WalletHis}