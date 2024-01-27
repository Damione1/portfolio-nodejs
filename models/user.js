const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already used"],
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    }
}, { timestamps: true });

userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.index({ email: 1 });
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
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

}, { timestamps: true });

userSettingsSchema.index({ user: 1 });

const User = module.exports = mongoose.model('userSchema', userSchema);
const Settings = mongoose.model('userSettingsSchema', userSettingsSchema);


// Exporting our model objects
module.exports = {
    User,
    Settings
}
