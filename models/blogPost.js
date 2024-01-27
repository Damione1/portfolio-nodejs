const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    excerpt: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    tag: {
        type: Object,
        required: false
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        required: false
    }],
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
    date: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }

}, { timestamps: true });

/* populate images pre find and findById, minus user date and __v */
blogPostSchema.pre('find', function (next) {
    this.populate('images', '-user -createdAt -__v');
    next();
});
blogPostSchema.pre('find', function (next) {
    this.populate('user', '-password -__v -email');
    next();
});

module.exports = mongoose.model('blogPost', blogPostSchema);
