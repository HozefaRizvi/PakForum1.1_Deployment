const express = require("express");
const User = require("../Models/UserModels");
const Topic = require("../Models/TopicModel");
const TopicComment = require("../Models/TopicCommentModal");
const { TopicLike, TopicReport } = require("../Models/TopicLikeAndReportModel");
const Reply = require("../Models/TopicReplyModel");
const auth = require("../Middleware/authmidlleware");
const router = express.Router();
router.post("/add-topic", async (req, res) => {
  const { topicname, TopicContent, TopicTags, TopicPhotoUri, userEmail } =
    req.body;
  try {
    const user = await User.findOne({ email: userEmail }).select("-password");
    console.log(user.profilePicUri);
    if (!user) return res.status(404).json({ message: "User  not found" });

    const newTopic = new Topic({
      topicname,
      TopicContent,
      TopicTags,
      TopicPhotoUri,
      user: {
        userId: user._id,
        username: user.name,
        profilePicUri: user.profilePicUri,
      },
    });

    await newTopic.save();
    res
      .status(201)
      .json({ message: "Topic added successfully", Topic: newTopic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/get-all-topics", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/get-topic/:id", async (req, res) => {
  const topicId = req.params.id;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }
    res.status(200).json(topic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/like-topic/:topicId", auth, async (req, res) => {
  const topicId = req.params.topicId;
  try {
    const user = req.user;
    const existingLike = await TopicLike.findOne({
      topicId,
      userId: user.userId,
    });

    if (existingLike)
      return res
        .status(400)
        .json({ message: "You have already liked this topic" });

    const newLike = new TopicLike({
      topicId,
      userId: user.userId,
    });
    await newLike.save();
    res.status(200).json({ message: "Topic liked successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/report-topic/:topicId", auth, async (req, res) => {
  const topicId = req.params.topicId;
  try {
    const user = req.user;
    const existingReport = await TopicReport.findOne({
      topicId,
      userId: user.userId,
    });
    if (existingReport)
      return res
        .status(400)
        .json({ message: "You have already reported this topic" });

    const newReport = new TopicReport({
      topicId,
      userId: user.userId,
    });
    await newReport.save();
    res.status(200).json({ message: "Topic reported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/edit-topic/:topicId", auth, async (req, res) => {
  const topicId = req.params.topicId;
  const { topicContent, topicTags, topicPhotoUri } = req.body;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    if (topic.user.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    topic.topicContent = topicContent || topic.topicContent;
    topic.topicTags = topicTags || topic.topicTags;
    topic.topicPhotoUri = topicPhotoUri || topic.topicPhotoUri;
    await topic.save();
    res.status(200).json({ message: "Topic updated successfully", topic });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/delete-topic/:topicId", auth, async (req, res) => {
  const topicId = req.params.topicId;

  try {
    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    if (topic.user.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }
    const comments = await TopicComment.find({ topicId });
    const commentIds = comments.map((comment) => comment._id);
    await Reply.deleteMany({ commentId: { $in: commentIds } });
    await TopicComment.deleteMany({ topicId });
    await TopicLike.deleteMany({ topicId });
    await TopicReport.deleteMany({ topicId });
    await Topic.findByIdAndDelete(topicId);

    res
      .status(200)
      .json({ message: "Topic and associated data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
