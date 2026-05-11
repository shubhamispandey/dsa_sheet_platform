const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  articleUrl: {
    type: String,
  },
  youtubeUrl: {
    type: String,
  },
  codingPlatformUrl: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Problem", problemSchema);
