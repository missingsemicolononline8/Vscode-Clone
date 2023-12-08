const mongoose = require('mongoose');
const {Schema} = mongoose;
const userSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    email : {
        type: String,
        required: true,
        unique: true,
        // Add a regular expression pattern to validate the email format.
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    },
    password : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default : Date.now
    }

});

const user = mongoose.model('user',userSchema);
module.exports = user