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

module.exports = router;