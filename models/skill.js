const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    },
    language: {
        type: String,
        required: true,
        default: 'en'
    }

});

module.exports = mongoose.model('skill', skillSchema);