const mongoose = require("mongoose");

const TopicCommentSchema = new mongoose.Schema({
    topicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: true,
    },
    commentBody: {
        type: String,
        required: true,
    },
    commentedBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        profilePicUri: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("TopicComment", TopicCommentSchema);
