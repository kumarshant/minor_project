// controllers/recommendController.js

const Recommendation = require('../models/recommendationModel');
const User = require('../models/userModel');
const mongoose =require('mongoose');
const path =require('path');


const { detectFaceAndCrop } = require('../services/facedetectionservice.js');

const { getDressRecommendations } = require('../services/recommendationService.js');


/**
 * POST /api/recommend/generate
 * Expects: (multipart route earlier saved image) or body.imagePath (relative path)
 * - imagePath will be read from req.body.imagePath OR (if uploaded) req.file.path
 * - auth middleware should set req.user
 */const generateFromImage = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const imagePath = req.file?.path || req.body.imagePath;
    if (!imagePath) return res.status(400).json({ message: 'Image required' });

// Extract only the filename
const filename = path.basename(imagePath);  // ← ONLY THIS PART

    const gender = req.body.gender || null;
    console.log(gender);
    const age = req.body.age ? Number(req.body.age) : null;
     console.log(age);
    const event = req.body.event || null;
     console.log(event);


    // 1. Face analysis
    const { skinToneHex, undertone, detectedGender, detectedAge } = await detectFaceAndCrop(imagePath);
    let finalAge= null;
    let finalGender=null;
    if(gender){
       finalGender=gender;
         console.log(`gender provided ${finalGender}`);
    }
    else{
      finalGender=detectedGender;
      console.log("detected gender")
    }
    if(age){
      finalAge= age;
      console.log(`age provided  ${finalAge}`)
      
        }
    else{
      finalAge=detectedAge;
      console.log("detected age ")
    }
    // 2. Gemini
    const geminiData = await getDressRecommendations({
      gender: finalGender ,
      age: finalAge ,
      skinTone: skinToneHex,
      undertone,
      event,
      imagePath,
    });

    // 3. SAVE USING STATIC METHOD
    const saved = await Recommendation.saveRecommendation({
      user: userId,
      imagePath: filename,
      skinTone: geminiData.analysis.skinTone,
      undertone: geminiData.analysis.undertone,
      recommendations: geminiData.recommendations,
    });
    // 4. ADD IMAGE PATH TO USER'S images ARRAY
    await User.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { images: filename }  // $addToSet = no duplicates
      },
      { new: true }
    );

    return res.status(201).json({ recommendation: saved });

  } catch (err) {
    console.error('generateFromImage error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/recommend/history
 * Returns list of saved recommendations for logged in user
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const total = await Recommendation.countDocuments({ user: userId });
    const items = await Recommendation.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({ page, limit, total, items });
  } catch (err) {
    console.error('getHistory error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * GET /api/recommend/:id
 * Return a single recommendation belonging to the user
 */// === 1. Get by MongoDB _id ===
const getRecommendationById = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const rec = await Recommendation.findById(id);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });

    if (rec.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return res.json({ recommendation: rec });
  } catch (err) {
    console.error('getRecommendationById error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


const deleteRecommendation = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const rec = await Recommendation.findById(id);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });

    // Check if user owns this recommendation
    if (rec.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Recommendation.findByIdAndDelete(id);
    return res.json({ message: 'Deleted successfully' });

  } catch (err) {
    console.error('deleteRecommendation error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  generateFromImage,
  getHistory,
  getRecommendationById,
  deleteRecommendation
};
