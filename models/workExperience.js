const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({

    company: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: false
    },
    current: {
        type: Boolean,
        required: true,
        default: false
    },
    description: {
        type: String,
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

module.exports = mongoose.model('workExperience', workExperienceSchema);