const mongoose = require('mongoose');

const userSocials = new mongoose.Schema({
    githubUsername: {
        type: String,
    },
    linkedin: {
        type: String,
    },
});

const userSkills = new mongoose.Schema({
    languages: {
        type: [String],
    },
    frameworks: {
        type: [String],
    },
    softwares: {
        type: [String],
    },
});

const projectActivitySchema = new mongoose.Schema({
    ownProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Project',
    },
    likedProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        default: {},
        ref: 'Project',
    },
    appliedProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Project',
    },
});

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        unique: true,
        type: String,
    },
    email: {
        required: true,
        unique: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    college: {
        type: String,
    },
    socials: {
        type: userSocials,
    },
    skills: {
        type: userSkills,
    },
    projects: {
        type: projectActivitySchema,
    },
});

module.exports = mongoose.model('User', userSchema);