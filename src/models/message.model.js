const mongoose = require("mongoose");
const User = require("./user.model");
const messageSchema = new mongoose.Schema({
    user:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chart",
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ["user","model","system"],
        required: true,
        default: "user",
    },
    
});

module.exports = mongoose.model("Message", messageSchema);