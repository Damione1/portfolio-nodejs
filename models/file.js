const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    },
    date: {
        type: Date,
        default: Date.now,
        immutable: true
    }

});

module.exports = mongoose.model('file', fileSchema);