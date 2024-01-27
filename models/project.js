const mongoose = require('mongoose');



const projectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
    },
    excerpt: {
        type: String,
    },
    link: {
        type: String,
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
    }],
    tags: {
        type: Object,
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
    slug: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'deleted'],
        default: 'draft'
    },

}, { timestamps: true });

projectSchema.index({ slug: 1 });
projectSchema.index({ user: 1 });

/* populate images pre find and findById, minus user date and __v */
projectSchema.pre('findOne', function (next) {
    this.populate('images', '-user -created_at -__v');
    next();
});


module.exports = mongoose.model('project', projectSchema);
