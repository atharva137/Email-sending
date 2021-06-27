
const mongoose = require('mongoose');

const mailSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unquie: true,
    },
    fromemail:{
        type: String,
        required: true,
    },
    tomail:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    }

},{collection:'mail'})

const model = mongoose.model("MailSchema", mailSchema);

module.exports = model;
