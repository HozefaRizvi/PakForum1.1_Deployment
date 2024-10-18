const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
    topicname: { type: String, required: true },
    TopicContent: { type: String, required: true },
    TopicTags: { type: [String], default: [] },
    TopicPhotoUri: { type: String },
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        profilePicUri: { type: String, required: true },
    },
}, { timestamps: true });

module.exports = mongoose.model("Topic", TopicSchema);
