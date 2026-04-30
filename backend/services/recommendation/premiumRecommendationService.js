const {
  generateVisionRecommendation
} = require("../ai/geminiVisionService");

async function generatePremiumRecommendation(
  payload
) {
  console.log(
    "Starting premium recommendation flow..."
  );

  const parsed =
    await generateVisionRecommendation(
      payload
    );

  return {
    analysis: parsed.analysis || {},
    recommendations:
      parsed.recommendations || [],
    recommendationContext:
      parsed.recommendationContext || null,
    styleProfileUpdate:
      parsed.styleProfileUpdate || null
  };
}

module.exports = {
  generatePremiumRecommendation
};