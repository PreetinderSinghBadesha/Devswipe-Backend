const mongoose = require('mongoose');

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

const hackathonSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    location:{
        type: String,
    },
    techUsed: {
        type: techSchema,
        required: true,
        default: {},
    },
    hackathonType:{
        type: String,
        required: true,
    },
    members: {
        type: [memberSchema],
        required: true,
    },
    startingDate:{
        type: Date,
        required: true,    
    },
    endingDate:{
        type: Date,
        required: true,    
    },
    link:{
        type: String,
        required: true,
    },
    duration:{
        type: String,
        required: true,
    }
});