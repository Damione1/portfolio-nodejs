const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Username already used"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    }
});

const userSettingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userSchema',
        required: true,
        immutable: true
    },
    mainTitle: {
        type: String,
        required: false
    },
    mainSubtitle: {
        type: String,
        required: false
    },
    workExperiencesTitle: {
        type: String,
        required: false
    },
    workExperiencesSubtitle: {
        type: String,
        required: false
    },
    qualificationsTitle: {
        type: String,
        required: false
    },
    qualificationsSubtitle: {
        type: String,
        required: false
    },
    projectsTitle: {
        type: String,
        required: false
    },
    projectsSubtitle: {
        type: String,
        required: false
    },
    skillsTitle: {
        type: String,
        required: false
    },
    skillsSubtitle: {
        type: String,
        required: false
    },
    homeMetaTitle: {
        type: String,
        required: false
    },
    homeMetaDescription: {
        type: String,
        required: false
    }

});

const User = module.exports = mongoose.model('userSchema', userSchema);
const Settings = mongoose.model('userSettingsSchema', userSettingsSchema);


// Exporting our model objects
module.exports = {
    User,
    Settings
}