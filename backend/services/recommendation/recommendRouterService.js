
const {
  generateStandardRecommendation
} = require("./standardRecommendationService");

const {
  generatePremiumRecommendation
} = require("./premiumRecommendationService");

async function processRecommendation(payload) {
  console.log(payload);
  const { userType } = payload;

  const isPremiumUser =
        userType === "PREMIUM"

    console.log(isPremiumUser);

  if (isPremiumUser) {
    return generatePremiumRecommendation(payload);
  }

  return generateStandardRecommendation(payload);
}

module.exports = {
  processRecommendation
};