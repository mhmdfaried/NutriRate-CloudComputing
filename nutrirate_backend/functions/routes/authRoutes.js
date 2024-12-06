const express = require("express");
const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login user (ditangani di sisi client)
 * @access  Publik
 */
router.post("/login", (req, res) => {
  res
    .status(200)
    .json({ message: "Login ditangani di sisi client dengan Firebase SDK" });
});

/**
 * @route   POST /api/auth/register
 * @desc    Register user baru (ditangani di sisi client)
 * @access  Publik
 */
router.post("/register", (req, res) => {
  res
    .status(200)
    .json({ message: "Register ditangani di sisi client dengan Firebase SDK" });
});

module.exports = router;
