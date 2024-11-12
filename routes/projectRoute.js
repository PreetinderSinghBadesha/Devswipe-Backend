const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/jwtMiddleware');
const Project = require('../models/Project');

router.post('/create-project', verifyToken, async (req, res, next) => {
    try {
        const { name, startingDate, members, github, images, techUsed } = req.body;
        const project = new Project({
            name,
            owner: req.userId,
            startingDate,
            members,
            github,
            images,
            techUsed
        });
        await project.save();
        res.status(200).json({
            message: 'Project added successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to create project',
            details: error.message
        });
    }
});

router.get('/get-projects', verifyToken, async (req, res, next) => {
    try {
        const projects = await Project.find({});
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get projects'
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
        });
    }
});


router.get('get-liked-projects', verifyToken, async (req, res, next) => {
   try {
    const user = await User.findById(req.userId);
    
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch liked projects',
        });
    }
});

module.exports = router;