const mongoose = require("mongoose");
const ReplySchema = new mongoose.Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TopicComment",
        required: true,
    },
    replyBody: {
        type: String,
        required: true,
    },
    repliedBy: {
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
module.exports = mongoose.model("TopicCommentReply", ReplySchema);
