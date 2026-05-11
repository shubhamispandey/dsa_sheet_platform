const asyncHandler = require("../utils/asyncHandler");
const UserProgress = require("../models/UserProgress");

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
  const progress = await UserProgress.find({ userId: req.user._id });
  res.json({
    success: true,
    data: progress,
  });
});

// @desc    Mark problem complete
// @route   PATCH /api/progress/:problemId
// @access  Private
const updateProgress = asyncHandler(async (req, res) => {
  const { completed } = req.body;

  let progress = await UserProgress.findOne({
    userId: req.user._id,
    problemId: req.params.problemId,
  });

  if (progress) {
    progress.completed = completed;
    if (completed) {
      progress.completedAt = new Date();
    } else {
      progress.completedAt = null;
    }
    await progress.save();
  } else {
    progress = await UserProgress.create({
      userId: req.user._id,
      problemId: req.params.problemId,
      completed,
      completedAt: completed ? new Date() : null,
    });
  }

  res.json({
    success: true,
    data: progress,
  });
});

module.exports = {
  getProgress,
  updateProgress,
};
