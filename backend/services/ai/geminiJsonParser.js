function parseGeminiJson(rawText) {
  try {
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/g, "")
      .trim();

    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found");
    }

    const jsonString = cleaned.slice(jsonStart, jsonEnd + 1);

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini parse error:", error.message);
    throw error;
  }
}

module.exports = {
  parseGeminiJson
};