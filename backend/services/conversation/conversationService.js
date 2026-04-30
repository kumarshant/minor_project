const { geminiClient } = require("../../config/geminiClient");

async function generateChatResponse({
  user,
  recommendation,
  conversation,
  userMessage
}) {
  const recentMessages = conversation.messages
    .slice(-8)
    .map(
      msg =>
        `${msg.role}: ${msg.content}`
    )
    .join("\n");

  const prompt = `
You are a premium fashion stylist AI.

USER STYLE PROFILE:
${user.styleProfile || "No style profile"}

CURRENT RECOMMENDATION CONTEXT:
${recommendation.recommendationContext || "No recommendation context"}

PREVIOUS CHAT:
${recentMessages}

NEW USER MESSAGE:
${userMessage}

Tasks:
1. Answer user naturally
2. Suggest outfit improvements if needed
3. Update recommendation context if preference changed
4. Update style profile if long-term preference changed

Return ONLY valid JSON:

{
  "response": "string",
  "updatedRecommendationContext": "string or null",
  "updatedStyleProfile": "string or null",
  "followUpSuggestions": [
    "string",
    "string"
  ]
}
`;

  const result =
    await geminiClient.generateContent(prompt);

  const raw =
    result.response.text().trim();

  const cleaned = raw
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

module.exports = {
  generateChatResponse
};