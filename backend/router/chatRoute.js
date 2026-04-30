const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  sendMessage,
  getConversation,
  getUserConversations
} = require("../controller/chatController");

router.post("/:conversationId/message", auth, sendMessage);

router.get("/:conversationId", auth, getConversation);

router.get("/", auth, getUserConversations);

module.exports = router;