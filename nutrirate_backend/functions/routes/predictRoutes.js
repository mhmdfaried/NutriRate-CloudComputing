const express = require("express");
const router = express.Router();
const { predict } = require("../controllers/predictController");
const { verifyToken } = require("../controllers/authController");

/**
 * @route   POST /api/predict
 * @desc    Prediksi grade nutrisi
 * @access  Private
 */
router.post("/predict", verifyToken, predict);

module.exports = router;

const { body, validationResult } = require("express-validator");

router.post(
  "/predict",
  verifyToken,
  [
    body("protein").isNumeric(),
    body("energy").isNumeric(),
    body("fat").isNumeric(),
    body("saturated_fat").isNumeric(),
    body("sugars").isNumeric(),
    body("fiber").isNumeric(),
    body("salt").isNumeric(),
  ],
  (req, res, next) => {
    // Handle hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Input tidak valid", errors: errors.array() });
    }
    next();
  },
  predict
);
