const express = require("express");
const router = express.Router();

const path = require("path");
const multer = require("multer");

const auth = require("../middleware/auth");

const {
  generateRecommendation,
  getHistory,
  getRecommendationById,
  deleteRecommendation
} = require("../controller/recommendController");


// upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


// single route
router.post(
  "/generate",
  auth,
  upload.single("image"),
  generateRecommendation
);

router.get(
  "/history",
  auth,
  getHistory
);

router.get(
  "/:id",
  auth,
  getRecommendationById
);

router.delete(
  "/:id",
  auth,
  deleteRecommendation
);

module.exports = router; 