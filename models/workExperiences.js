const mongoose = require('mongoose');

const workExperiencesSchema = new mongoose.Schema({

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
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

});

module.exports = mongoose.model('WorkExperience', workExperiencesSchema);