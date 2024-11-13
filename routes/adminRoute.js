const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const verifyToken = require('../middlewares/jwtMiddleware');

router.post('/add-members/:projectId',verifyToken, async (req,res,next) =>{
    try{
        const {members} = req.body;

        await Project.findByIdAndUpdate(
            req.params.projectId,
            { $addToSet: { members: { $each: members } } },
            { new: true }
        );
        res.status(200).json({ message: 'member added'});

    } catch (error) {
        res.status(500).json({ error: "Failed to add member" });
    }
});

router.post('/remove-members/:projectId',verifyToken, async (req,res,next) =>{
    try{
        const {members} = req.body;

        await Project.findByIdAndUpdate(
            req.params.projectId,
            { $pull: { members: { _id: { $in: members } } } },
            { new: true }
        );
        res.status(200).json({ message: 'member removed'});

    } catch (error) {
        res.status(500).json({ 
            error: "Failed to remove member",
            details: error.message
        });
    }
});
module.exports = router;