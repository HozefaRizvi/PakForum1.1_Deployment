const express = require("express");
const Topic = require("../Models/TopicModel");
const TopicComment = require("../Models/TopicCommentModal");
const Reply = require("../Models/TopicReplyModel");
const User = require("../Models/UserModels");
const router = express.Router();
const auth = require("../Middleware/authmidlleware");

router.post("/add-reply-topic/:commentId", auth, async (req, res) => {
    const { replyBody } = req.body;
    const commentId = req.params.commentId;

    try {
        const comment = await TopicComment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const newReply = new Reply({
            commentId: commentId,
            replyBody,
            repliedBy: {
                userId: user._id,
                username: user.username,
                profilePicUri: user.profilePicUri,
                name: user.name,
            },
        });

        await newReply.save();
        res.status(201).json({ message: "Reply added successfully", reply: newReply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
