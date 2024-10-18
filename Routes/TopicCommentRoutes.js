const express = require("express");
const Topic = require("../Models/TopicModel"); 
const TopicComment = require("../Models/TopicCommentModal");
const User = require("../Models/UserModels");
const router = express.Router();
const auth = require("../Middleware/authmidlleware");
router.post("/add-comment-topic/:topicId", auth, async (req, res) => {
    const { commentBody } = req.body;
    const topicId = req.params.topicId;

    try {
        const topic = await Topic.findById(topicId);
        if (!topic) {
            return res.status(404).json({ message: "Topic not found" });
        }

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newComment = new TopicComment({
            topicId,
            commentBody,
            commentedBy: {
                userId: user._id,
                username: user.username,
                profilePicUri: user.profilePicUri,
                name: user.name,
            },
        });

        await newComment.save();
        res.status(201).json({ message: "Comment added successfully", comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.get("/show-allcomment-topic/:topicId", async (req, res) => {
    const topicId = req.params.topicId;

    try {
        const comments = await TopicComment.find({ topicId });
        res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
router.delete("/delete-comment-specific/:commentId", auth, async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const comment = await TopicComment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        if (comment.commentedBy.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Not authorized" });
        }
        await TopicComment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
module.exports = router;
