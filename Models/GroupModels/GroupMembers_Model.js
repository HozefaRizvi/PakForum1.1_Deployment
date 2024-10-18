const mongoose = require('mongoose');

const GroupMemberSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // Add name field
    profilePicUri: { type: String, required: false }, // Add profilePicUri field
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GroupMember', GroupMemberSchema);
