const fs = require("fs");
const path = require("path");
const user= require("../../models/userModel");
const recommendation =require("../../models/recommendationModel");

const {
  geminiClient
} = require("../../config/geminiClient");

const {
  parseGeminiJson
} = require("./geminiJsonParser");


function getMimeType(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();

  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";

  return "image/jpeg";
}


function buildPremiumPrompt({
  name,
  event,
  userQuery,
  preferences,
  userStyleProfile
}) {
  return `
You are an elite AI fashion stylist hired for ${name}
Analyze this user's image and provide highly personalized fashion recommendations. use his name while giving recommendation. 
USER STYLE PROFILE:
${
  userStyleProfile
    ? JSON.stringify(userStyleProfile, null, 2)
    : "No previous style profile"
},
USER REQUEST:${userQuery || "General recommendation"},
EVENT: ${event || "General"},
PREFERENCES:${preferences || "None"}
TASKS:
Analyze:
- skin tone
- undertone
- age estimate
- gender estimate
- body type
- style personality
- seasonal palette

Generate exactly 5 outfit recommendations.

Each recommendation should contain:
- outfit
- reason

Also generate:
- recommendationContext(string of adjectives about current request based upon your analysis and previously given context)
- styleProfileUpdate(string of adjectives about persons style based on your analysis and previously given userStyleProfile)
Return ONLY valid JSON:

{
  "analysis": {
    "skinTone": "",
    "undertone": "",
    "age": "",
    "gender": "",
    "bodyType": "",
    "stylePersonality": "",
    "seasonalPalette": ""
  },

  "recommendations": [
    {
      "outfit": "",
      "reason": ""
    }
  ],

  "recommendationContext": "",// its the context of current request
  "styleProfileUpdate": "" //it is the global style profile of user
}
`;
}


async function generateVisionRecommendation(payload) {
  try {
    console.log("Gemini Vision started");

    const prompt =
      buildPremiumPrompt(payload);

    const base64Image = fs
      .readFileSync(payload.imagePath)
      .toString("base64");

    const mimeType =
      getMimeType(payload.imagePath);

    console.log("Sending image to Gemini...");

    const result =
      await geminiClient.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType
          }
        }
      ]);

    console.log("Gemini response received");

    const rawText =
      result.response.text();

    console.log("Raw Gemini Output:", rawText);

    return parseGeminiJson(rawText);

  } catch (error) {
    console.error(
      "geminiVisionService error:",
      error
    );

    throw error;
  }
}


module.exports = {
  generateVisionRecommendation
};