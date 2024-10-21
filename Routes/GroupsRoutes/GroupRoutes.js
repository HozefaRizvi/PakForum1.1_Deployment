const express = require('express');
const Group = require('../../Models/GroupModels/Group_Model');
const auth = require('../../Middleware/authmidlleware');
const User = require('../../Models/UserModels');
const GroupMember = require("../../Models/GroupModels/GroupMembers_Model")
const mongoose = require('mongoose');
const router = express.Router();
router.post('/create-group', async (req, res) => {
    const { groupName, groupDescription, groupPhoto, groupPrivate, userEmail } = req.body; 
    try {
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }
        const existingGroup = await Group.findOne({ groupName, createdBy: user._id });
        if (existingGroup) {
            return res.status(400).json({ message: "You already have a group with this name." });
        }
        const newGroup = new Group({
            groupId: new mongoose.Types.ObjectId().toString(),
            groupName,
            groupDescription,
            groupPhoto,
            groupPrivate,
            createdBy: user._id 
        });
        await newGroup.save();
        res.status(201).json({ message: "Group created successfully", groupId: newGroup._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete('/delete-group/:groupId', auth, async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Deleting the group
        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/show_all_groups", async (req, res) => {
    try {
        const groups = await Group.find(); // Retrieve all groups
        res.status(200).json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/add-member/:groupId', async (req, res) => {
    const { userEmail } = req.body; 
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const existingMember = await GroupMember.findOne({ groupId, email: userEmail });
        if (existingMember) {
            return res.status(400).json({ message: "User  is already a member of the group" });
        }
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        const newMember = new GroupMember({
            groupId,
            userId: user._id, 
            name: user.name,
            profilePicUri: user.profilePicUri
        });
        await newMember.save();
        res.status(201).json({ message: "Member added successfully", member: newMember });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
//show group members
router.get('/show-members/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Find all members of the group
        const members = await GroupMember.find({ groupId });

        // Directly use the stored data from the GroupMember schema
        const memberDetails = members.map((member) => ({
            userId: member.userId,
            name: member.name,  // Using name from GroupMember
            profilePicUri: member.profilePicUri,  // Using profilePicUri from GroupMember
            joinedAt: member.joinedAt
        }));

        res.status(200).json(memberDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete('/remove-member/:groupId/:userId', auth, async (req, res) => {
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        // Find the member and delete
        const member = await GroupMember.findOneAndDelete({ groupId, userId });
        if (!member) {
            return res.status(404).json({ message: "Member not found in the group" });
        }

        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get('/show-specific-group/:groupId', async (req, res) => {
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        res.status(200).json(group);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.post('/join-group/:groupId', async (req, res) => {
    const { userEmail } = req.body; 
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        const existingMember = await GroupMember.findOne({ groupId, userId: user._id });
        if (existingMember) {
            return res.status(400).json({ message: "You are already a member of this group" });
        }

        const newMember = new GroupMember({
            groupId,
            userId: user._id,
            name: user.name,
            profilePicUri: user.profilePicUri
        });
        await newMember.save();
        res.status(201).json({ message: "Joined group successfully", member: newMember });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete('/leave-group/:groupId', async (req, res) => {
    const { userEmail } = req.body;
    const groupId = req.params.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        const member = await GroupMember.findOneAndDelete({ groupId, userId: user._id });
        if (!member) {
            return res.status(404).json({ message: "You are not a member of this group" });
        }

        res.status(200).json({ message: "Left the group successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.post('/check-group-status/:groupId', async (req, res) => {
    const { userEmail } = req.body;  // Retrieve userEmail from the request body
    const groupId = req.params.groupId;  // Retrieve groupId from the URL parameters

    try {
        const group = await Group.findById(groupId);  // Check if the group exists
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const user = await User.findOne({ email: userEmail });  // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const member = await GroupMember.findOne({ groupId, userId: user._id });  // Check if the user is a group member
        if (member) {
            return res.status(200).json({ message: "User is a member of the group", status: true });
        } else {
            return res.status(200).json({ message: "User is not a member of the group", status: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
