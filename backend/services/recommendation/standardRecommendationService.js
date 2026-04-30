const {
  detectFaceAndCrop
} = require("../ai/faceDetectionService");

const {
  generateGeminiRecommendations
} = require("../ai/geminiTextService");

async function generateStandardRecommendation({
  imagePath,
  gender,
  age,
  event
}) {
  console.log("Starting standard recommendation flow...");

  const faceData = await detectFaceAndCrop(imagePath);

  const finalGender =
    gender || faceData.detectedGender;

  const finalAge =
    age || faceData.detectedAge;

  const geminiData =
    await generateGeminiRecommendations({
      gender: finalGender,
      age: finalAge,
      skinTone: faceData.skinToneHex,
      undertone: faceData.undertone,
      event
    });

  return {
    analysis: {
      skinTone:
        geminiData.analysis.skinTone,

      undertone:
        geminiData.analysis.undertone,

      age: finalAge,

      gender: finalGender,

      bodyType: null,
      stylePersonality: null,
      seasonalPalette: null
    },

    recommendations:
      geminiData.recommendations,

    recommendationContext: null,
    shoppingLinks: [],
    styleProfileUpdate: null
  };
}

module.exports = {
  generateStandardRecommendation
};