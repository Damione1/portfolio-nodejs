const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true,
        default: 50,
    },
    icon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fileSchema',
        autopopulate: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    }

});

module.exports = mongoose.model('skill', skillSchema);