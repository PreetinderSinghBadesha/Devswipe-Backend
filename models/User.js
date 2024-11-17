const mongoose = require('mongoose');

const userSocials = new mongoose.Schema({
    githubUsername: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    website: {
        type: String,
    },
});

const coinSchema = new mongoose.Schema({
    powerCoins: {
        type : Number,
        default: 25,
        required: true,
    },
    achievementCoins: {
        type : Number,
        default: 25,
        required: true,
    }
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
        default: [],
        ref: 'Project',
    },
    activeProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    finishedProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    likedProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
    appliedProjects: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Project',
    },
});
const hackathonActivitySchema = new mongoose.Schema({
    ownHackathon: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Hackathon',
    },
    likedHackathon: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Hackathon',
    },
    appliedHackathon: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'Hackathon',
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
    about: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
    },
    profilePicture: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    phoneNum: {
        type: String,
    },
    coins: {
        type: coinSchema,
        default: { powerCoins: 25, achievementCoins: 25 },
    },
    socials: {
        type: userSocials,
        default: {},
    },
    skills: {
        type: userSkills,
        default: {},
    },
    projects: {
        type: projectActivitySchema,
        default: {},
    },
    hackathons: {
        type: hackathonActivitySchema,
        default: {},
    }
    
});

module.exports = mongoose.model('User', userSchema);