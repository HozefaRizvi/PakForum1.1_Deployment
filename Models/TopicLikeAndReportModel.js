const mongoose = require("mongoose");

const TopicLikeSchema = new mongoose.Schema({
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likeCount: { type: Number, default: 1 }
}, { timestamps: true });

const TopicReportSchema = new mongoose.Schema({
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportCount: { type: Number, default: 1 }
}, { timestamps: true });

const TopicLike = mongoose.model('TopicLike', TopicLikeSchema);
const TopicReport = mongoose.model('TopicReport', TopicReportSchema);
module.exports = { TopicLike, TopicReport };
