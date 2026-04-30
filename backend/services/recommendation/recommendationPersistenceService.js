const Recommendation =
  require("../../models/recommendationModel");

async function saveRecommendationData({
  user,
  imagePath,
  event,
  recommendationResult
}) {
  try {
    const recommendation =
      await Recommendation.create({
        user: user._id,

        imagePath,

        event,

        recommendationTier:
          user.userType,

        skinTone:
          recommendationResult.analysis?.skinTone || null,

        undertone:
          recommendationResult.analysis?.undertone || null,

        seasonalPalette:
          recommendationResult.analysis?.seasonalPalette || null,

        recommendations:
          recommendationResult.recommendations || [],

        recommendationContext:
          recommendationResult.recommendationContext || null,

        shoppingLinks:
          recommendationResult.shoppingLinks || []
      });

    return recommendation;

  } catch (error) {
    console.error(
      "saveRecommendationData error:",
      error
    );

    throw error;
  }
}

module.exports = {
  saveRecommendationData
};