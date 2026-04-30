const User = require("../models/userModel");
const Recommendation = require("../models/recommendationModel");

const Conversation = require("../models/conversationModel");

const {
  processRecommendation
} = require("../services/recommendation/recommendRouterService");

const {
  saveRecommendationData
} = require("../services/recommendation/recommendationPersistenceService");

const {
  generateChatResponse
} = require("../services/conversation/conversationService");


async function generateRecommendation(req, res) {
  try {
    console.log("====== GENERATE STARTED ======");

    const user = await User.findById(req.user.id);   
   
    if(!user) return res.json({message:"user not found "})
    const imagePath = req.file?.path;

    console.log("User:", user?._id);
    console.log("User Tier:", user?.userType);
    console.log("Image Path:", imagePath);

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        message: "Image required"
      });
    }

    const isPremium =
      user.userType === "PREMIUM" 

  
    const payload = {
      name:user.username,
      userType:user.userType,
      imagePath,
      event: req.body.event,
      gender: req.body.gender,
      age: req.body.age
    };

   
    if (isPremium) {
      payload.userQuery = req.body.userQuery;
      payload.preferences = req.body.preferences;
      payload.userStyleProfile = user.styleProfile;

      console.log("Premium payload added");
    }

    console.log("Processing recommendation...", payload);

 
    const recommendationResult =
      await processRecommendation(payload);

    console.log("Recommendation generated successfully", recommendationResult.recommendationContext, recommendationResult.styleProfileUpdate);


    const savedRecommendation =
      await saveRecommendationData({
        user,
        imagePath,
        event: req.body.event,
        recommendationResult
      });

    console.log(
      "Recommendation saved:",
      savedRecommendation._id
    );

    let conversation = null;

    
   if (isPremium) {
  console.log("Creating premium conversation...");

  conversation = await Conversation.create({
    user: req.user.id,
    recommendation: savedRecommendation._id
  });

  savedRecommendation.conversationId = conversation._id;

  await savedRecommendation.save();

  console.log(
    "Conversation created:",
    conversation._id
  );
 
      if (
        recommendationResult.styleProfileUpdate
      ) {
        console.log("Updating style profile...");

        await User.findByIdAndUpdate(
          user._id,
          {
            styleProfile:
              recommendationResult.styleProfileUpdate
          }
        );
      }
    }

    console.log("====== GENERATE SUCCESS ======");

    return res.status(201).json({
      success: true,
      recommendation: savedRecommendation,
      conversationId:
        conversation?._id || null
    });

  } catch (error) {
    console.error(
      "generateRecommendation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}



async function getHistory(req, res) {
  try {
    console.log("Fetching history...");

    const user = req.user.id;

    const recommendations =
      await Recommendation.getUserHistory(
        user
      );

    console.log(
      "History fetched:",
      recommendations.length
    );

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations
    });

  } catch (error) {
    console.error("getHistory error:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}



async function getRecommendationById(
  req,
  res
) {
  try {
    console.log("Fetching recommendation");

    const userId = req.user.id;
    const recommendationId = req.params.id;
    console.log(recommendationId);

    const recommendation =
      await Recommendation.findOne({
        _id: recommendationId,
        user: userId,
        status: "active"
      }).populate("conversationId");

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message:
          "Recommendation not found"
      });
    }

    console.log("Recommendation found");

    return res.status(200).json({
      success: true,
      recommendation
    });

  } catch (error) {
    console.error(
      "getRecommendationById error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}



async function deleteRecommendation(
  req,
  res
) {
  try {
    console.log("Deleting recommendation...");

    const user = req.currentUser;
    const recommendationId =
      req.params.id;

    const recommendation =
      await Recommendation.findOne({
        _id: recommendationId,
        user: user._id
      });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message:
          "Recommendation not found"
      });
    }

    recommendation.status =
      "deleted";

    await recommendation.save();

    console.log(
      "Recommendation soft deleted"
    );


    if (
      recommendation.conversationId
    ) {
      await Conversation.findByIdAndUpdate(
        recommendation.conversationId,
        {
          status: "archived"
        }
      );

      console.log(
        "Conversation archived"
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Recommendation deleted successfully"
    });

  } catch (error) {
    console.error(
      "deleteRecommendation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


module.exports = {
  generateRecommendation,
  getHistory,
  getRecommendationById,
  deleteRecommendation
};