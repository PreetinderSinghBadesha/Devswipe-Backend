const mongoose = require('mongoose');

const techSchema = new mongoose.Schema({
    languages: {
        type: [String],
        required: true,
    },
    frameworks: {
        type: [String],
        required: true,
    },
    softwares: {
        type: [String],
        required: true,
    },
});

const memberSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // unique: true,
    },
    role: {
        type: String,
        required: true,
    },
});
const appliedSchema = new mongoose.Schema({
    likedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: {},
        ref: 'User',
    },
    appliedUsers: {
        type: [mongoose.Schema.Types.ObjectId],
        default: {},
        ref: 'User',
    },
});

const hackathonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: 'Not specified',
    },
    techUsed: {
        type: techSchema,
        required: true,
        default: {},
    },
    hackathonType: {
        type: String,
        required: true,
    },
    members: {
        type: [memberSchema],
        required: true,
    },
    startingDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return value < this.endingDate;
            },
            message: 'Starting date must be earlier than ending date',
        },
    },
    endingDate: {
        type: Date,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applied: {
        type: appliedSchema,
        required: true,
        default: {},
    }
});

module.exports = mongoose.model('Hackathon', hackathonSchema);
