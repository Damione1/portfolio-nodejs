const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
    subTitle: {
        type: String,
        required: true
    },
    title: {
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
        enum: ['en', 'fr'],
        default: 'en'
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'deleted'],
        default: 'draft'
    },

}, { timestamps: true });

workExperienceSchema.index({ user: 1 });

module.exports = mongoose.model('workExperience', workExperienceSchema);
