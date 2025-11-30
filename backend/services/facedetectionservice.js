// detect.js
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, ImageData } = require('canvas');

// Load opencv.js - try multiple paths
let cv;
try {
  cv = require(path.join(__dirname, '..', 'opencv.js'));
} catch (e) {
  try {
    cv = require('../opencv.js');
  } catch (e2) {
    console.error('Failed to load opencv.js. Make sure it exists in the backend root.');
    process.exit(1);
  }
}
global.cv = cv;

// Paths to models
const MODEL_DIR = path.join(__dirname, 'face-models');
const HAAR_PATH = path.join(MODEL_DIR, 'haarcascade_frontalface_default.xml');
const AGE_PROTO = path.join(MODEL_DIR, 'age_deploy.prototxt');
const AGE_MODEL = path.join(MODEL_DIR, 'age_net.caffemodel');
const GENDER_PROTO = path.join(MODEL_DIR, 'gender_deploy.prototxt');
const GENDER_MODEL = path.join(MODEL_DIR, 'gender_net.caffemodel');

const AGE_LIST = ['(0-2)', '(4-6)', '(8-12)', '(15-20)', '(25-32)', '(38-43)', '(48-53)', '(60-100)'];
const GENDER_LIST = ['Male', 'Female'];

// Helper functions for skin tone & undertone

function getAverageSkinColor(maskedFace, finalMask) {
  const height = maskedFace.rows;
  const width = maskedFace.cols;
  const channels = maskedFace.channels();

  let rSum = 0, gSum = 0, bSum = 0;
  let pixelCount = 0;

  const maskData = finalMask.data;
  const faceData = maskedFace.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const maskIdx = y * width + x;
      if (maskData[maskIdx] === 255) {               // skin pixel
        const idx = (y * width + x) * channels;
        rSum += faceData[idx];
        gSum += faceData[idx + 1];
        bSum += faceData[idx + 2];
        pixelCount++;
      }
    }
  }

  if (pixelCount === 0) throw new Error('No skin pixels found in mask');

  return {
    r: Math.round(rSum / pixelCount),
    g: Math.round(gSum / pixelCount),
    b: Math.round(bSum / pixelCount)
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

// Simple warm/cool/neutral based on R-B difference
function getUndertone(r, b) {
  const diff = r - b;
  if (diff > 15) return 'warm';
  if (diff < -15) return 'cool';
  return 'neutral';
}


function waitForOpenCV() {
  return new Promise((resolve) => {
    if (cv && cv.Mat) return resolve();
    if (cv.onRuntimeInitialized) {
      cv.onRuntimeInitialized = resolve;
    } else {
      resolve();
    }
  });
}

function argMax(arr) {
  let max = arr[0];
  let idx = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
      idx = i;
    }
  }
  return idx;
}

function loadFileToFS(filePath, fileName) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  try {
    const stat = cv.FS.stat('/' + fileName);
    if (stat) {
      console.log(`File ${fileName} already loaded in virtual FS`);
      return;
    }
  } catch (e) { /* ignore */ }

  const data = fs.readFileSync(filePath);
  cv.FS_createDataFile('/', fileName, data, true, true, true);
  console.log(`Loaded ${fileName} into OpenCV.js virtual FS`);
}

async function detectFaceAndCrop(imagePath) {
  console.log('Starting face detection...');
  console.log('MODEL_DIR:', MODEL_DIR);
  console.log('HAAR_PATH:', HAAR_PATH);
  console.log('Haar file exists?', fs.existsSync(HAAR_PATH));

  await waitForOpenCV();
  console.log('OpenCV initialized');

  // Load image
  const img = await loadImage(imagePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);

  // Convert to OpenCV Mat
  const src = cv.matFromImageData(imageData);
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  //  LOAD ALL MODEL FILES INTO VIRTUAL FS 
  try {
    loadFileToFS(HAAR_PATH, 'haarcascade_frontalface_default.xml');
    loadFileToFS(AGE_PROTO, 'age_deploy.prototxt');
    loadFileToFS(AGE_MODEL, 'age_net.caffemodel');
    loadFileToFS(GENDER_PROTO, 'gender_deploy.prototxt');
    loadFileToFS(GENDER_MODEL, 'gender_net.caffemodel');
  } catch (e) {
    src.delete(); gray.delete();
    throw new Error(`Failed to load model files into OpenCV.js FS: ${e.message}`);
  }

  //FACE DETECTION
  const faceCascade = new cv.CascadeClassifier();
  try {
    const loaded = faceCascade.load('/haarcascade_frontalface_default.xml');
    if (!loaded) throw new Error('Failed to load cascade classifier');
  } catch (e) {
    src.delete(); gray.delete(); faceCascade.delete();
    throw new Error(`Failed to load Haar cascade: ${e.message}`);
  }

  const faces = new cv.RectVector();
  try {
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0);
  } catch (e) {
    src.delete(); gray.delete(); faceCascade.delete(); faces.delete();
    throw new Error(`Face detection failed: ${e.message}`);
  }

  if (faces.size() === 0) {
    src.delete(); gray.delete(); faceCascade.delete(); faces.delete();
    throw new Error('No face detected in the image');
  }

  console.log(`Detected ${faces.size()} face(s)`);
  const faceRect = faces.get(0);
  faces.delete(); faceCascade.delete();

  // Crop face from original color image
  const faceROI = src.roi(faceRect);

  // Convert faceROI to RGB for neural network
  const faceRGB = new cv.Mat();
  cv.cvtColor(faceROI, faceRGB, cv.COLOR_RGBA2RGB);

  // Prepare blob
  const blob = cv.blobFromImage(
    faceRGB,
    1.0,
    new cv.Size(227, 227),
    new cv.Scalar(78.4263377603, 87.7689143744, 114.895847746),
    false,
    false
  );

  // Initialize result variables
  let gender = 'Unknown';
  let age = 'Unknown';

  // === GENDER PREDICTION ===
  let genderNet = null;
  let genderPreds = null;
  try {
    genderNet = cv.readNetFromCaffe('/gender_deploy.prototxt', '/gender_net.caffemodel');
    genderNet.setInput(blob);
    genderPreds = genderNet.forward();
    const genderIdx = argMax(Array.from(genderPreds.data32F));
    gender = GENDER_LIST[genderIdx];
    console.log(`Detected Gender: ${gender}`);
  } catch (e) {
    console.error('Gender prediction error:', e.message);
  } finally {
    if (genderNet) genderNet.delete();
    if (genderPreds) genderPreds.delete();
  }

  // === AGE PREDICTION ===
  let ageNet = null;
  let agePreds = null;
  try {
    ageNet = cv.readNetFromCaffe('/age_deploy.prototxt', '/age_net.caffemodel');
    ageNet.setInput(blob);
    agePreds = ageNet.forward();
    const ageIdx = argMax(Array.from(agePreds.data32F));
    age = AGE_LIST[ageIdx];
    console.log(`Detected Age: ${age}`);
  } catch (e) {
    console.error('Age prediction error:', e.message);
  } finally {
    if (ageNet) ageNet.delete();
    if (agePreds) agePreds.delete();
  }

  // SAVE CROPPED FACE WITH SKIN-BASED MASK 
  const faceRGBForMask = new cv.Mat();
  cv.cvtColor(faceROI, faceRGBForMask, cv.COLOR_RGBA2RGB);

  const faceYCrCb = new cv.Mat();
  cv.cvtColor(faceRGBForMask, faceYCrCb, cv.COLOR_RGB2YCrCb);

  const lowerSkin = new cv.Mat(faceYCrCb.rows, faceYCrCb.cols, faceYCrCb.type(), [0, 133, 77, 0]);
  const upperSkin = new cv.Mat(faceYCrCb.rows, faceYCrCb.cols, faceYCrCb.type(), [255, 173, 127, 255]);

  const skinMask = new cv.Mat();
  cv.inRange(faceYCrCb, lowerSkin, upperSkin, skinMask);

  const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(5, 5));
  const cleanMask = new cv.Mat();

  cv.morphologyEx(skinMask, cleanMask, cv.MORPH_OPEN, kernel);
  cv.morphologyEx(cleanMask, cleanMask, cv.MORPH_CLOSE, kernel);

  const ellipseMask = new cv.Mat.zeros(faceRect.height, faceRect.width, cv.CV_8UC1);
  const white = new cv.Scalar(255);
  const centerX = faceRect.width / 2;
  const centerY = faceRect.height * 0.45;
  const center = new cv.Point(Math.round(centerX), Math.round(centerY));
  const axes = new cv.Size(Math.round(faceRect.width * 0.38), Math.round(faceRect.height * 0.50));
  cv.ellipse(ellipseMask, center, axes, 0, 0, 360, white, -1);

  const finalMask = new cv.Mat();
  cv.bitwise_and(cleanMask, ellipseMask, finalMask);

  console.log('Face mask created using skin color detection + ellipse');

  const maskedFace = new cv.Mat();
  faceROI.copyTo(maskedFace, finalMask);

  // Compute skinToneHex & undertone
 
  let skinToneHex = '#000000';
  let undertone = 'unknown';
  try {
    const avg = getAverageSkinColor(maskedFace, finalMask);
    skinToneHex = rgbToHex(avg.r, avg.g, avg.b);
    undertone = getUndertone(avg.r, avg.b);
    console.log(`Detected Skin Tone: ${skinToneHex}`);
    console.log(`Detected Undertone: ${undertone}`);
  } catch (e) {
    console.error('Skin tone detection failed:', e.message);
  }

  // Create output canvas with transparency
  const outCanvas = createCanvas(faceRect.width, faceRect.height);
  const outCtx = outCanvas.getContext('2d');
  const imgData = new ImageData(
    new Uint8ClampedArray(maskedFace.data),
    faceRect.width,
    faceRect.height
  );
  outCtx.putImageData(imgData, 0, 0);

  // ------------------- Cleanup -------------------
  blob.delete();
  faceRGB.delete();
  faceRGBForMask.delete();
  faceYCrCb.delete();
  lowerSkin.delete();
  upperSkin.delete();
  skinMask.delete();
  kernel.delete();
  cleanMask.delete();
  ellipseMask.delete();
  finalMask.delete();
  maskedFace.delete();
  faceROI.delete();
  src.delete();
  gray.delete();

  // ------------------- Save -------------------
  const tmpDir = path.join(__dirname, 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const croppedPath = path.join(tmpDir, `face_${Date.now()}.png`);
  const buffer = outCanvas.toBuffer('image/png');
  fs.writeFileSync(croppedPath, buffer);

  console.log(`Face saved: ${croppedPath}`);
  console.log(`Detected Age: ${age}`);
  console.log(`Detected Gender: ${gender}`);

  // ------------------- Return -------------------
  return {
    croppedPath,
    detectedAge: age,
    detectedGender: gender,
    faceBox: {
      x: faceRect.x,
      y: faceRect.y,
      width: faceRect.width,
      height: faceRect.height
    },
    skinToneHex,      // NEW
    undertone         // NEW
  };
}

// Export
module.exports = { detectFaceAndCrop };

// Test
if (require.main === module) {
  const testImage = process.argv[2] || './test.jpg';
  if (!fs.existsSync(testImage)) {
    console.error(`Image not found: ${testImage}`);
    console.log('Usage: node detect.js <path-to-image>');
    process.exit(1);
  }

  detectFaceAndCrop(testImage)
    .then(result => {
      console.log('\n=== RESULT ===');
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
}