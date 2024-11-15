const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const verifyToken = require('../middlewares/jwtMiddleware');
const Hackathon = require('../models/Hackathon');

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

router.post('/remove-members/:projectId', verifyToken, async (req, res, next) => {
    try {
        const { members } = req.body; 
        const memberIds = members.map((m) => m.member);
        await Project.findByIdAndUpdate(
            req.params.projectId,
            { $pull: { members: { member: { $in: memberIds } } } },
            { new: true }
        );

        res.status(200).json({ message: 'Members removed successfully' });
    } catch (error) {
        res.status(500).json({
            error: "Failed to remove members",
            details: error.message,
        });
    }
});

router.post('/accept-application', verifyToken, async (req, res, next) => {
    try {
        const { projectId, userId } = req.body;

        // Find the project by ID
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Check if the user is in the appliedUsers list
        const isUserApplied = project.applied.appliedUsers.includes(userId);
        if (!isUserApplied) {
            return res.status(400).json({ error: 'User has not applied for the project' });
        }

        // Find the user role (you can customize this part based on your logic)
        const userRole = 'Member'; // You can change this logic to fetch specific role from request body or other sources

        // Add the user to the members field
        await Project.findByIdAndUpdate(
            projectId,
            { 
                $addToSet: { 'members': { member: userId, role: userRole } } 
            }
        );

        // Remove the user from the appliedUsers field
        await Project.findByIdAndUpdate(
            projectId,
            { 
                $pull: { 'applied.appliedUsers': userId } 
            }
        );

        res.status(200).json({ message: 'User added to project members and removed from applied users' });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to accept user for the project',
            details: error.message
        });
    }
});

router.post('/accept-application-hackathon', verifyToken, async (req, res, next) => {
    try {
        const { hackathonId, userId } = req.body;

        // Find the hackathon by ID
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({ error: 'Hackathon not found' });
        }

        // Check if the user is in the appliedUsers list
        const isUserApplied = hackathon.applied.appliedUsers.includes(userId);
        if (!isUserApplied) {
            return res.status(400).json({ error: 'User has not applied for the hackathon' });
        }

        // Find the user role (you can customize this part based on your logic)
        const userRole = 'Participant'; // Change this to fetch specific role if needed

        // Add the user to the members field
        await Hackathon.findByIdAndUpdate(
            hackathonId,
            { 
                $addToSet: { 'members': { member: userId, role: userRole } } 
            }
        );

        // Remove the user from the appliedUsers field
        await Hackathon.findByIdAndUpdate(
            hackathonId,
            { 
                $pull: { 'applied.appliedUsers': userId } 
            }
        );

        res.status(200).json({ message: 'User added to hackathon members and removed from applied users' });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to accept user for the hackathon',
            details: error.message
        });
    }
});
router.post('/remove-member-hackathon', verifyToken, async (req, res, next) => {
    try {
        const { hackathonId, userId } = req.body;

        // Find the hackathon by ID
        const hackathon = await Hackathon.findById(hackathonId);
        if (!hackathon) {
            return res.status(404).json({ error: 'Hackathon not found' });
        }

        // Check if the user is in the members list
        const isMember = hackathon.members.some(member => member.member.toString() === userId);
        if (!isMember) {
            return res.status(400).json({ error: 'User is not a member of this hackathon' });
        }

        // Remove the user from the members array
        await Hackathon.findByIdAndUpdate(
            hackathonId,
            { $pull: { 'members': { member: userId } } },
            { new: true }
        );

        // Optionally, you can add the user back to the appliedUsers list if needed
        await Hackathon.findByIdAndUpdate(
            hackathonId,
            { $addToSet: { 'applied.appliedUsers': userId } },
            { new: true }
        );

        res.status(200).json({ message: 'Member removed from hackathon successfully' });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to remove member from hackathon',
            details: error.message
        });
    }
});
module.exports = router;