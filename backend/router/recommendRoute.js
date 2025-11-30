// routes/recommendRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const {
  generateFromImage,
  getHistory,
  getRecommendationById,
  deleteRecommendation
} = require('../controller/recommendController');

// multer storage for image upload in this route 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });



// Route A: POST generate with image upload
router.post('/generate', auth, upload.single('image'), generateFromImage);
// Route B: GET history
router.get('/history', auth, getHistory);

// Route C: GET single recommendation
router.get('/:id', auth, getRecommendationById);

router.delete("/:id",auth, deleteRecommendation );

module.exports = router;
