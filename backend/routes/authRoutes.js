const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
