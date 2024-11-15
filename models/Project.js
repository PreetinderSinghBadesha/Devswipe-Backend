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
        required: true,
    },
    github: {
        type: String,
        unique: true,
    },
    images: {
        type: [String],
        required: true,
    },
    techUsed: {
        type: techSchema,
        required: true,
        default: {},
    },
    applied:{
        type: appliedSchema,
        required: true,
        default: {},
    }
});

module.exports = mongoose.model('Project', projectSchema);
