const asyncHandler = require("../utils/asyncHandler");
const Topic = require("../models/Topic");
const Problem = require("../models/Problem");

// @desc    Get all topics
// @route   GET /api/topics
// @access  Private
const getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({}).sort({ order: 1 });
  res.json({
    success: true,
    data: topics,
  });
});

// @desc    Get problems by topic
// @route   GET /api/topics/:id/problems
// @access  Private
const getProblemsByTopic = asyncHandler(async (req, res) => {
  const problems = await Problem.find({ topicId: req.params.id }).sort({
    order: 1,
  });
  res.json({
    success: true,
    data: problems,
  });
});

module.exports = {
  getTopics,
  getProblemsByTopic,
};
