const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({

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
    sessionId: {
        type: String,
    },
    userAgent: {
        type: String,
    }

});

module.exports = mongoose.model('authSchema', authSchema);