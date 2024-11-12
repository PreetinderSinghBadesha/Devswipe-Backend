const mongoose = require('mongoose');

const userSocials = new mongoose.Schema({
    githubUsername: {
        type: String , 
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
        type:[String],
    },
    softwares: {
        type: [String],
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
        type: [userSocials],
    },
    skills: {
        type: [userSkills],
    },
});

module.exports = mongoose.model('User', userSchema);