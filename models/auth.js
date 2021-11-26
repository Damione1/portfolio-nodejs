const mongoose = require('mongoose');

const authShema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    refreshToken: {
        type: String,
    },
    attempts: {
        type: Number,
        default: 0,
    },
    lastUsed: { 
        type: Date,
        default: Date.now,
    },

});

module.exports = mongoose.model('authShema', authShema);