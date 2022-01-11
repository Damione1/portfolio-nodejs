const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({

    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    },
    category: {
        type: String,
        default: 'default',
        required: true
    }

});



module.exports = mongoose.model('option', optionSchema);