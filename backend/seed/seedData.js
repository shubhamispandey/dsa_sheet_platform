const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Topic = require("../models/Topic");
const Problem = require("../models/Problem");
const UserProgress = require("../models/UserProgress");

const connectDB = require("../config/db");

// LOAD ENV VARIABLES

dotenv.config();

// TOPICS DATA

const topicsData = [
  {
    title: "Arrays",
    description: "Array manipulation and algorithms",
    order: 1,
  },
  {
    title: "Strings",
    description: "String processing and algorithms",
    order: 2,
  },
  {
    title: "Linked Lists",
    description: "Linked list data structure problems",
    order: 3,
  },
  {
    title: "Stacks & Queues",
    description: "Stack and queue based problems",
    order: 4,
  },
  {
    title: "Trees",
    description: "Binary tree and tree algorithms",
    order: 5,
  },
  {
    title: "Graphs",
    description: "Graph traversal and graph algorithms",
    order: 6,
  },
  {
    title: "Dynamic Programming",
    description: "DP optimization problems",
    order: 7,
  },
];

// PROBLEMS DATA

const problemsData = {
  Arrays: [
    {
      title: "Two Sum",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/two-sum/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
      codingPlatformUrl: "https://leetcode.com/problems/two-sum/",
      order: 1,
    },
    {
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      articleUrl:
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=1pkOgXD63yU",
      codingPlatformUrl:
        "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
      order: 2,
    },
    {
      title: "Contains Duplicate",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/contains-duplicate/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=3OamzN90kPg",
      codingPlatformUrl: "https://leetcode.com/problems/contains-duplicate/",
      order: 3,
    },
    {
      title: "Product of Array Except Self",
      difficulty: "Medium",
      articleUrl:
        "https://leetcode.com/problems/product-of-array-except-self/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=bNvIQI2wAjk",
      codingPlatformUrl:
        "https://leetcode.com/problems/product-of-array-except-self/",
      order: 4,
    },
    {
      title: "Maximum Subarray",
      difficulty: "Medium",
      articleUrl: "https://leetcode.com/problems/maximum-subarray/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=5WZl3MMT0Eg",
      codingPlatformUrl: "https://leetcode.com/problems/maximum-subarray/",
      order: 5,
    },
  ],

  Strings: [
    {
      title: "Valid Anagram",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/valid-anagram/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=9UtInBqnCgA",
      codingPlatformUrl: "https://leetcode.com/problems/valid-anagram/",
      order: 1,
    },
    {
      title: "Longest Common Prefix",
      difficulty: "Easy",
      articleUrl:
        "https://leetcode.com/problems/longest-common-prefix/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=0sWShKIJoo4",
      codingPlatformUrl: "https://leetcode.com/problems/longest-common-prefix/",
      order: 2,
    },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      articleUrl:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=wiGpQwVHdE0",
      codingPlatformUrl:
        "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      order: 3,
    },
  ],

  "Linked Lists": [
    {
      title: "Reverse Linked List",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/reverse-linked-list/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
      codingPlatformUrl: "https://leetcode.com/problems/reverse-linked-list/",
      order: 1,
    },
    {
      title: "Merge Two Sorted Lists",
      difficulty: "Easy",
      articleUrl:
        "https://leetcode.com/problems/merge-two-sorted-lists/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=XIdigk956u0",
      codingPlatformUrl:
        "https://leetcode.com/problems/merge-two-sorted-lists/",
      order: 2,
    },
    {
      title: "Linked List Cycle",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/linked-list-cycle/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=gBTe7lFR3vc",
      codingPlatformUrl: "https://leetcode.com/problems/linked-list-cycle/",
      order: 3,
    },
  ],

  "Stacks & Queues": [
    {
      title: "Valid Parentheses",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/valid-parentheses/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=WTzjTskDFMg",
      codingPlatformUrl: "https://leetcode.com/problems/valid-parentheses/",
      order: 1,
    },
    {
      title: "Min Stack",
      difficulty: "Medium",
      articleUrl: "https://leetcode.com/problems/min-stack/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=qkLl7nAwDPo",
      codingPlatformUrl: "https://leetcode.com/problems/min-stack/",
      order: 2,
    },
  ],

  Trees: [
    {
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      articleUrl:
        "https://leetcode.com/problems/maximum-depth-of-binary-tree/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=hTM3phVI6YQ",
      codingPlatformUrl:
        "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      order: 1,
    },
    {
      title: "Invert Binary Tree",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/invert-binary-tree/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=OnSn2XEQ4MY",
      codingPlatformUrl: "https://leetcode.com/problems/invert-binary-tree/",
      order: 2,
    },
    {
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      articleUrl:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=6ZnyEApgFYg",
      codingPlatformUrl:
        "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      order: 3,
    },
  ],

  Graphs: [
    {
      title: "Number of Islands",
      difficulty: "Medium",
      articleUrl: "https://leetcode.com/problems/number-of-islands/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=pV2kpPD66nE",
      codingPlatformUrl: "https://leetcode.com/problems/number-of-islands/",
      order: 1,
    },
    {
      title: "Clone Graph",
      difficulty: "Medium",
      articleUrl: "https://leetcode.com/problems/clone-graph/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=mQeF6bN8hMk",
      codingPlatformUrl: "https://leetcode.com/problems/clone-graph/",
      order: 2,
    },
  ],

  "Dynamic Programming": [
    {
      title: "Climbing Stairs",
      difficulty: "Easy",
      articleUrl: "https://leetcode.com/problems/climbing-stairs/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=Y0lT9Fck7qI",
      codingPlatformUrl: "https://leetcode.com/problems/climbing-stairs/",
      order: 1,
    },
    {
      title: "House Robber",
      difficulty: "Medium",
      articleUrl: "https://leetcode.com/problems/house-robber/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=73r3KWiEvyk",
      codingPlatformUrl: "https://leetcode.com/problems/house-robber/",
      order: 2,
    },
    {
      title: "Coin Change",
      difficulty: "Medium",
      articleUrl: "https://leetcode.com/problems/coin-change/solution/",
      youtubeUrl: "https://www.youtube.com/watch?v=H9bfqozjoqs",
      codingPlatformUrl: "https://leetcode.com/problems/coin-change/",
      order: 3,
    },
  ],
};

// SEED FUNCTION

const seedData = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // CLEAR ONLY TOPICS / PROBLEMS / PROGRESS
    // KEEP USERS SAFE

    await Topic.deleteMany();

    await Problem.deleteMany();

    await UserProgress.deleteMany();

    console.log("Old topics/problems/progress cleared");

    // INSERT TOPICS

    const createdTopics = await Topic.insertMany(topicsData);

    console.log("Topics seeded");

    // CREATE TOPIC MAP

    const topicMap = {};

    createdTopics.forEach((topic) => {
      topicMap[topic.title] = topic._id;
    });

    // PREPARE ALL PROBLEMS

    const allProblems = [];

    Object.entries(problemsData).forEach(([topicName, problems]) => {
      problems.forEach((problem) => {
        allProblems.push({
          ...problem,
          topicId: topicMap[topicName],
        });
      });
    });

    // INSERT PROBLEMS

    await Problem.insertMany(allProblems);

    console.log(`${allProblems.length} problems seeded`);

    console.log("Database seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);

    process.exit(1);
  }
};

seedData();
