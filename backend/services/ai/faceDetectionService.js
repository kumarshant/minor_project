const path = require("path");
const { createCanvas, loadImage } = require("canvas");

let cv;

try {
  cv = require(path.join(__dirname, "../../opencv.js"));
} catch (error) {
  throw new Error("opencv.js not found in root directory");
}

global.cv = cv;

const {
  waitForOpenCV,
  loadAllModels,
  convertImageToMat,
  detectFace,
  predictAgeGender,
  extractSkinToneAndCrop
} = require("./faceHelpers");

async function detectFaceAndCrop(imagePath) {
  try {
    console.log("Starting face analysis...");

    // wait for opencv runtime
    await waitForOpenCV();

    // load all required models
    await loadAllModels();

    // image → mat
    const src = await convertImageToMat(imagePath);

    // detect face
    const faceRect = detectFace(src);

    // predict age + gender
    const {
      detectedAge,
      detectedGender
    } = predictAgeGender(src, faceRect);

    // extract skin tone + crop
    const {
      croppedPath,
      skinToneHex,
      undertone
    } = extractSkinToneAndCrop(src, faceRect);

    src.delete();

    return {
      croppedPath,
      detectedAge,
      detectedGender,
      skinToneHex,
      undertone,
      faceBox: faceRect
    };

  } catch (error) {
    console.error(
      "Face detection service error:",
      error
    );
    throw error;
  }
}

module.exports = {
  detectFaceAndCrop
};