const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const geminiClient = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite"
});

module.exports = {
  
  geminiClient
};