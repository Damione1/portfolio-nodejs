const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    url: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    },
}, { timestamps: true });

module.exports = mongoose.model('file', fileSchema);
