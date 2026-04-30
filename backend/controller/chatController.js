const Conversation = require("../models/conversationModel");
const Recommendation = require("../models/recommendationModel");
const User = require("../models/userModel");

const {
  generateChatResponse
} = require("../services/conversation/conversationService");


const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        message: "Message required"
      });
    }

    const user = await User.findById(userId);

    if (
      user.userType !== "PREMIUM"
    ) {
      return res.status(403).json({
        message: "Premium membership required"
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: userId,
      status: "active"
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    const recommendation =
      await Recommendation.findById(
        conversation.recommendation
      );

    // save user message
    conversation.messages.push({
      role: "user",
      content: message
    });

    const aiResponse =
      await generateChatResponse({
        user,
        recommendation,
        conversation,
        userMessage: message
      });

    // save assistant message
    conversation.messages.push({
      role: "assistant",
      content: aiResponse.response
    });

    if (aiResponse.updatedRecommendationContext) {
      recommendation.recommendationContext =
        aiResponse.updatedRecommendationContext;

      await recommendation.save();
    }

    if (aiResponse.updatedStyleProfile) {
      user.styleProfile =
        aiResponse.updatedStyleProfile;

      await user.save();
    }

    await conversation.save();

    return res.status(200).json({
      success: true,
      response: aiResponse.response,
      suggestions:
        aiResponse.followUpSuggestions
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};



const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        user: userId
      }).populate("recommendation");

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    return res.json(conversation);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};



const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations =
      await Conversation.find({
        user: userId
      })
        .sort({ createdAt: -1 })
        .populate("recommendation");

    return res.json(conversations);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


module.exports = {
  sendMessage,
  getConversation,
  getUserConversations
};