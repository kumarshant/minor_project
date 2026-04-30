const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    recommendation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation"
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true
        },

        content: {
          type: String,
          required: true
        },

        messageType: {
          type: String,
          enum: ["text"],
          default: "text"
        },

        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    conversationSummary: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active"
    }

  },
  {
    timestamps: true
  }
);

conversationSchema.index({
  user: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "Conversation",
  conversationSchema
);