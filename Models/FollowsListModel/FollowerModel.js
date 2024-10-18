const mongoose = require('mongoose');
const FollowerSchema = new mongoose.Schema(
  {
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followerName: { type: String, required: true },        // Add follower name
    followerEmail: { type: String, required: true },       // Add follower email
    followerProfilePicUri: { type: String, required: true }, // Add follower profile pic URI
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follower", FollowerSchema);
