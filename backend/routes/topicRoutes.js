const express = require("express");
const router = express.Router();
const {
  getTopics,
  getProblemsByTopic,
} = require("../controllers/topicController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, getTopics);
router.get("/:id/problems", protect, getProblemsByTopic);

module.exports = router;
