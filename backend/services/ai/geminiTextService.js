const {
  geminiClient
} = require("../../config/geminiClient");

async function generateGeminiRecommendations({
  gender,
  age,
  skinTone,
  undertone,
  event
}) {
  const prompt = `
You are a professional fashion stylist AI.

User:
- Gender: ${gender}
- Age: ${age}
- Skin tone: ${skinTone}
- Undertone: ${undertone}
- Event: ${event}

Return valid JSON:
generate exactly 3 

{
  "analysis":{
    "skinTone":"string",
    "undertone":"string"
  },
  "recommendations":[
    {
      "outfit":"string",
      "reason":"string"
    }
  ]
}
`;

  const result =
    await geminiClient.generateContent(
      prompt
    );

  const raw =
    result.response.text();

  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/g, "")
    .trim();

  const jsonStart =
    cleaned.indexOf("{");

  const jsonEnd =
    cleaned.lastIndexOf("}");

  const jsonString =
    cleaned.slice(
      jsonStart,
      jsonEnd + 1
    );

  return JSON.parse(jsonString);
}

module.exports = {
  generateGeminiRecommendations
};