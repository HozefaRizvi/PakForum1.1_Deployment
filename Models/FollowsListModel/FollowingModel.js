const mongoose = require('mongoose');

const FollowingSchema = new mongoose.Schema(
  {
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    followingName: { type: String, required: true },        // Add following name
    followingEmail: { type: String, required: true },       // Add following email
    followingProfilePicUri: { type: String, required: true }, // Add following profile pic URI
  },
  { timestamps: true }
);

module.exports = mongoose.model("Following", FollowingSchema);
