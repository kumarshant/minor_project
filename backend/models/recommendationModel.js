// models/recommendationModel.js
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imagePath: { type: String, required: true },
    skinTone: { type: String, required: true },
    undertone: {
      type: String,
      enum: ['warm', 'cool', 'neutral'],
      required: true,
    },
    recommendations: [
      {
        outfit: { type: String, required: true },
        reason: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// INDEX: Fast user + latest
recommendationSchema.index({ user: 1, createdAt: -1 });

// STATIC METHOD
recommendationSchema.statics.saveRecommendation = async function (data) {
  return await this.findOneAndUpdate(
    { user: data.user, imagePath: data.imagePath },
    data,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
};

// EXPORT THE MODEL
const Recommendation = mongoose.model('Recommendation', recommendationSchema);
module.exports = Recommendation; // ← CRITICAL