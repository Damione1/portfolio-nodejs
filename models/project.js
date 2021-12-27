const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    images: {
        type: Object,
        required: false
    },
    stack: {
        type: Object,
        required: false
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
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true
    }

});

module.exports = mongoose.model('project', projectSchema);