const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true,
        default: 50,
    },
    icon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    }

});

skillSchema.pre('find', function(next) {
    this.populate('icon', '-user -date -__v');
    next();
});

module.exports = mongoose.model('skill', skillSchema);