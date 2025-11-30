// services/recommendationService.js
const { geminiClient } = require('../config/geminiClient.js');

async function getDressRecommendations({ gender, age, skinTone, undertone, event, imagePath }) {
  const prompt = `
You are a professional fashion stylist AI. Return **only** a valid JSON object — **no markdown, no extra text**.

User:
- Gender: ${gender}
- Age: ${age}
- Skin tone: ${skinTone}
- Undertone: ${undertone}
- Event: ${event}

Return **exactly** this JSON (no \`\`\`json, no extra text):

{
  "imagePath": "${imagePath}",
  "analysis": {
    "skinTone": "${skinTone}",
    "undertone": "${undertone}"
  },
  "recommendations": [
    {
      "outfit": "string - full outfit name",
      "reason": "string - why it suits skin tone, undertone, and event"
    },
    {
      "outfit": "string - full outfit name",
      "reason": "string - why it suits skin tone, undertone, and event"
    },
    {
      "outfit": "string - full outfit name",
      "reason": "string - why it suits skin tone, undertone, and event"
    }
  ]
}

**CRITICAL RULES**:
- **NEVER** wrap in \`\`\`json or \`\`\`
- Return **raw JSON only**
- Exactly 3 recommendations
- Valid JSON (no trailing commas)
`.trim();

  let rawText;
  try {
    const result = await geminiClient.generateContent(prompt);
    rawText = result.response.text().trim();
    let cleaned = rawText
      .replace(/^```json\s*/i, '')   // Remove ```json
      .replace(/^```\s*/i, '')       // Remove ```
      .replace(/\s*```$/g, '')       // Remove closing ```
      .trim();

    // Extract the json object that we got . 
   
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      throw new Error("No valid JSON object found");
    }

    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);
    const data = JSON.parse(jsonString);

    if (!data.imagePath) throw new Error("Missing imagePath");
    if (!data.analysis || !data.analysis.skinTone || !data.analysis.undertone) {
      throw new Error("Missing analysis.skinTone or undertone");
    }
    if (!Array.isArray(data.recommendations) || data.recommendations.length !== 3) {
      throw new Error("Must have exactly 3 recommendations");
    }

    for (const rec of data.recommendations) {
      if (!rec.outfit || !rec.reason) {
        throw new Error("Recommendation missing outfit or reason");
      }
      console.log(rec.outfit);
      console.log(rec.reason);
    }

    console.log("Gemini JSON parsed & validated successfully");
    return data;

  } catch (parseError) {
    console.error("=== GEMINI RESPONSE DEBUG ===");
    console.error("Raw text:", rawText);
    console.error("Cleaned text (before slice):", rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/g, '')
      .trim()
    );
    console.error("Parse error:", parseError.message);
    console.error("==============================");

    throw new Error(`Gemini response invalid: ${parseError.message}`);
  }
}

module.exports = { getDressRecommendations };