const mongoose = require('mongoose');
const {Schema} = mongoose;
const notesSchema = new Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    project_name : {
        type : String,
        required : true
    },
    project_root : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        default : Date.now
    }

});

module.exports = mongoose.model('project',notesSchema);