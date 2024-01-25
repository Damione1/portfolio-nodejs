const mongoose = require('mongoose');



const projectSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    excerpt: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
        required: false
    }],
    tags: {
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
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }

});

/* populate images pre find and findById, minus user date and __v */
projectSchema.pre('find', function (next) {
    this.populate('images', '-user -date -__v');
    next();
});


module.exports = mongoose.model('project', projectSchema);
