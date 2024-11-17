const mongoose = require('mongoose');

const techSchema = new mongoose.Schema({
    languages: {
        type: [String],
        default: [],
        required: true,
    },
    frameworks: {
        type: [String],
        default: [],
        required: true,
    },
    softwares: {
        type: [String],
        default: [],
        required: true,
    },
    categories: {
        type: [String],
        default: [],
        required: true,
    }
});

const coinRewardSchema = new mongoose.Schema({
    powerCoins: {
        type: Number,
        required: true,
    },
    achievementCoins: {
        type: Number,
        required: true,
    },
});

const memberSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
});

const appliedSchema = new mongoose.Schema({
    likedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User',
    },
    appliedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        ref: 'User',
    },
});

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    startingDate: {
        type: Date,
        required: true,
    },
    members: {
        type: [memberSchema],
        default: [],
    },
    description: {
        type: String,
        required: true,
    },
    coinReward: {
        type: coinRewardSchema,
        required: true,
    },
    github: {
        type: String,
        unique: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    techUsed: {
        type: techSchema,
        required: true,
        default: { languages: [], frameworks: [], softwares: [], categories: [] },
    },
    applied: {
        type: appliedSchema,
        required: true,
        default: { likedUsers: [], appliedUsers: [] },
    }
});

module.exports = mongoose.model('Project', projectSchema);
