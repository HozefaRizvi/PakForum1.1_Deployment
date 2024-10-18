// Routes/followRoutes.js
const express = require('express');
const router = express.Router();
const Follower = require('../../Models/FollowsListModel/FollowerModel');
const Following = require('../../Models/FollowsListModel/FollowingModel');
const User = require('../../Models/UserModels');
const auth = require('../../Middleware/authmidlleware');

// Follow a user
router.post('/follow', auth, async (req, res) => {
    const { followingId } = req.body;
    try {
        const userToFollow = await User.findById(followingId);
        if (!userToFollow) {
            return res.status(404).json({ message: "User to follow not found" });
        }

        const alreadyFollowing = await Following.findOne({
            followingId,
            followerId: req.user.userId
        });

        if (alreadyFollowing) {
            return res.status(400).json({ message: "You are already following this user" });
        }
        const follower = await User.findById(req.user.userId);
        if (!follower) {
            return res.status(404).json({ message: "Follower not found" });
        }
        await Follower.create({
            followerId: req.user.userId,
            followingId,
            followerName: follower.name, 
            followerEmail: follower.email,  
            followerProfilePicUri: follower.profilePicUri  
        });

        await Following.create({
            followingId,
            followerId: req.user.userId,
            followingName: userToFollow.name,  
            followingEmail: userToFollow.email,    
            followingProfilePicUri: userToFollow.profilePicUri  
        });

        res.status(201).json({ message: "You are now following this user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete('/unfollow', auth, async (req, res) => {
    const { followingId } = req.body; 

    try {
        const followRecord = await Follower.findOne({
            followerId: req.user.userId,
            followingId
        });

        if (!followRecord) {
            return res.status(400).json({ message: "You are not following this user" });
        }
        await Follower.deleteOne({ followerId: req.user.userId, followingId });
        await Following.deleteOne({ followingId, followerId: req.user.userId });
        res.status(200).json({ message: "You have unfollowed this user" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/:userId/followers', async (req, res) => {
    const { userId } = req.params;

    try {
        const followers = await Follower.find({ followingId: userId }).populate('followerId', 'username');
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get('/:userId/following', async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await Following.find({ followerId: userId }).populate('followingId', 'username');
        res.status(200).json(following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/isFollowing/:followingId', auth, async (req, res) => {
    const { followingId } = req.params;
    try {
        const isFollowing = await Following.findOne({
            followerId: req.user.userId,
            followingId
        });

        if (isFollowing) {
            return res.status(200).json({ message: "You are following this user" });
        } else {
            return res.status(200).json({ message: "You are not following this user" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
