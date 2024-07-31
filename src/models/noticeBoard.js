const mongoose = require('mongoose');

const noticeBoardSchema = new mongoose.Schema({
    title1: {
        type: String,
    },
    description1: {
        type: String
    },
    title2: {
        type: String,
    },
    description2: {
        type: String,
    },
    title3: {
        type: String,
    },
    description3: {
        type: String,
    },
    contact: {
        type: String,
    },
},
    {
        timestamps: true
        // versionKey : false
    });

module.exports = mongoose.model('NoticeBoard', noticeBoardSchema);
