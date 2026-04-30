const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    imagePath: {
      type: String,
      required: true
    },

    event: {
      type: String,
      default: null,
      trim: true
    },

    recommendationTier: {
      type: String,
      enum: ["STANDARD", "PREMIUM"],
      required: true
    },
    skinTone: {
      type: String,
      required: true
    },

    undertone: {
      type: String,
      required: true
    },
  
    recommendationContext: {
      type: String,
      default: null
    },

    recommendations: {
      type: [
        {
          outfit: {
            type: String,
            required: true
          },

          reason: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      default: null
    },
    
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

recommendationSchema.index({
  user: 1,
  createdAt: -1
});

// Fast premium retrieval
recommendationSchema.index({
  recommendationTier: 1
});

// Fast active recommendation lookup
recommendationSchema.index({
  user: 1,
  status: 1
});



// Save recommendation
recommendationSchema.statics.saveRecommendation = async function (
  recommendationData
) {
  return await this.create(recommendationData);
};


// Get user recommendation history
recommendationSchema.statics.getUserHistory = async function (
  userId
) {
  return await this.find({
    user: userId,
    status: "active"
  })
    .sort({ createdAt: -1 })
    .populate("conversationId");
};


recommendationSchema.statics.softDeleteRecommendation =
  async function (recommendationId, userId) {
    return await this.findOneAndUpdate(
      {
        _id: recommendationId,
        user: userId
      },
      {
        status: "deleted"
      },
      {
        new: true
      }
    );
  };


// Get premium recommendations
recommendationSchema.statics.getPremiumRecommendations =
  async function (userId) {
    return await this.find({
      user: userId,
      recommendationTier: "PREMIUM",
      status: "active"
    }).sort({
      createdAt: -1
    });
  };


const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);

module.exports = Recommendation;