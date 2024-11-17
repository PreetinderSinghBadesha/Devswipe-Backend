const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/jwtMiddleware');
const Project = require('../models/Project');
const User = require('../models/User');
const Hackathon = require('../models/Hackathon');

router.post('/create-project', verifyToken, async (req, res, next) => {
    try {
        const {
            name,
            owner,
            startingDate,
            members,
            description,
            coinReward,
            github,
            thumbnail,
            techUsed,
            applied,
        } = req.body;

        const newProject = new Project({
            name,
            owner,
            startingDate,
            members: members || [],
            description,
            coinReward,
            github,
            thumbnail,
            techUsed: techUsed || {
                languages: [],
                frameworks: [],
                softwares: [],
                categories: [],
            },
            applied: applied || { likedUsers: [], appliedUsers: [] },
        });

        await newProject.save();

        await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { 'projects.ownProjects': newProject._id } },
            { new: true }
        );

        res.status(200).json({
            message: 'Project added successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to create project',
            details: error.message,
        });
    }
});


router.post('/create-hackathon', verifyToken, async (req, res, next) => {
    try {
        const { name, startingDate, endingDate, members, link, images, techUsed, location, hackathonType, duration } = req.body;

        const hackathon = new Hackathon({
            name,
            owner: req.userId,
            startingDate,
            endingDate,
            members,
            link,
            images,
            techUsed,
            location,
            hackathonType,
            duration,
        });

        await hackathon.save();

        await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { 'hackathon.ownhackathon': hackathon._id } },
            { new: true }
        );

        res.status(200).json({
            message: 'Hackathon created successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to create hackathon',
            details: error.message,
        });
    }
});


router.get('/get-hackathon', verifyToken, async (req, res, next) => {
    try {
        const hackathon = await Hackathon.find({});
        res.status(200).json(hackathon);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get projects'
        });
    }
});

router.get('/get-projects', verifyToken, async (req, res, next) => {
    try {
        const projects = await Project.find({})
            .populate('members.member', 'username email')
            .populate('applied.appliedUsers', 'username email');

        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get projects',
            details: error.message,
        });
    }
});


router.get('/get-user-projects', verifyToken, async (req, res, next) => {
    try {
        const projects = await Project.find({owner: req.userId});
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get projects'
        });
    }
});

router.get('/project/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id)
            .populate('members.member', 'username email')
            .populate('applied.appliedUsers', 'username email');

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch project',
            details: error.message,
        });
    }
});

router.get('/hackathon/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;

        const hackathon = await Hackathon.findById(id)
            .populate('members', 'username email')
            .populate('applied.appliedUsers', 'username email');

        if (!hackathon) {
            return res.status(404).json({ error: 'Hackathon not found' });
        }

        res.status(200).json(hackathon);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch hackathon',
            details: error.message,
        });
    }
});


router.post('/like-project', verifyToken, async (req, res, next) => {
    try {
        const { projectId } = req.body;
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { 'projects.likedProjects': projectId } },
            { new: true }
        );
        
        res.status(200).json({ message: 'Project liked successfully' });
    } catch (error) {
        res.status(500).json({ 
                error: 'Failed to like project', 
                details: error.message 
        });
    }
});

router.get('/get-liked-projects', verifyToken, async (req, res, next) => {
   try {
    const user = await User.findById(req.userId).populate('projects.likedProjects');

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json( user.projects.likedProjects);
    
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch liked projects',
            details: error.message
        });
    }
});


router.post('/apply-for-project', verifyToken, async (req, res, next) => {
    try {
        const { projectId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the user already applied
        if (project.applied.appliedUsers.includes(req.userId)) {
            return res.status(400).json({ error: 'User already applied for this project' });
        }

        await Project.findByIdAndUpdate(
            projectId,
            { $addToSet: { 'applied.appliedUsers': req.userId } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { 'projects.appliedProjects': projectId } },
            { new: true }
        );

        res.status(200).json({ message: 'Applied to project successfully' });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to apply for project',
            details: error.message,
        });
    }
});


router.post('/apply-for-hackathon', verifyToken, async (req, res, next) => {
    try {
        const { hackathonId } = req.body;

        // Find the hackathon by ID
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({ error: 'Hackathon not found' });
        }

        // Add the hackathon ID to the user's appliedHackathons list
        await User.findByIdAndUpdate(
            req.userId,
            { $addToSet: { 'hackathons.appliedHackathons': hackathonId } },
            { new: true }
        );

        // Add the user ID to the hackathon's applied.appliedUsers list
        await Hackathon.findByIdAndUpdate(
            hackathonId,
            { $addToSet: { 'applied.appliedUsers': req.userId } },
            { new: true }
        );

        res.status(200).json({ message: 'Applied to hackathon successfully' });
    } catch (error) {
        res.status(500).json({ 
            error: 'Failed to apply for hackathon', 
            details: error.message 
        });
    }
});


router.get('/get-applied-projects', verifyToken, async (req, res, next) => {
    try {
     const user = await User.findById(req.userId).populate('projects.appliedProjects');
 
     if (!user) {
         return res.status(404).json({ error: 'User not found' });
     }
     res.status(200).json( user.projects.appliedProjects);
     
     } catch (error) {
         res.status(500).json({
             error: 'Failed to fetch applied projects',
             details: error.message
         });
     }
 });


module.exports = router;