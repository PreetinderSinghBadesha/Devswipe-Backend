const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const verifyToken = require('../middlewares/jwtMiddleware');

router.post('/add-members/:projectId',verifyToken, async (req,res) =>{
    try{
        const user = req.body;
        await Project.findByIdAndUpdate(
            req.params.projectId,
            { $addToSet: { : projectId } },
            { new: true }
        );


    } catch (error) {
        res.status(500).json({ error: "Failed to add member" });
    }
});

module.exports = router;