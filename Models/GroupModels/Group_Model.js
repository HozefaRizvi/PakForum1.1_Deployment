// Models/GroupModel.js
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    groupId: { type: String, unique: true }, // Ensure this is unique
    groupName: { type: String, required: true },
    groupDescription: { type: String, required: true },
    groupPhoto: { type: String, default: "" },
    groupPrivate: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("Group", GroupSchema);
