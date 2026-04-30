const fs = require("fs");
const path = require("path");
const {
  createCanvas,
  loadImage,
  ImageData
} = require("canvas");

const cv = global.cv;

const MODEL_DIR = path.join(
  __dirname,
  "../face-models"
);

const AGE_LIST = [
  "(0-2)",
  "(4-6)",
  "(8-12)",
  "(15-20)",
  "(25-32)",
  "(38-43)",
  "(48-53)",
  "(60-100)"
];

const GENDER_LIST = [
  "Male",
  "Female"
];

const MODEL_FILES = {
  haar: "haarcascade_frontalface_default.xml",
  ageProto: "age_deploy.prototxt",
  ageModel: "age_net.caffemodel",
  genderProto: "gender_deploy.prototxt",
  genderModel: "gender_net.caffemodel"
};

function waitForOpenCV() {
  return new Promise((resolve) => {
    if (cv && cv.Mat) {
      resolve();
    } else if (cv.onRuntimeInitialized) {
      cv.onRuntimeInitialized = resolve;
    } else {
      resolve();
    }
  });
}

function loadFileToFS(filePath, fileName) {
  try {
    cv.FS.stat("/" + fileName);
    return;
  } catch (e) {}

  const data =
    fs.readFileSync(filePath);

  cv.FS_createDataFile(
    "/",
    fileName,
    data,
    true,
    true,
    true
  );
}

function loadAllModels() {
  Object.values(MODEL_FILES).forEach(
    (file) => {
      loadFileToFS(
        path.join(MODEL_DIR, file),
        file
      );
    }
  );
}

async function convertImageToMat(
  imagePath
) {
  const img =
    await loadImage(imagePath);

  const canvas =
    createCanvas(
      img.width,
      img.height
    );

  const ctx =
    canvas.getContext("2d");

  ctx.drawImage(
    img,
    0,
    0
  );

  const imageData =
    ctx.getImageData(
      0,
      0,
      img.width,
      img.height
    );

  return cv.matFromImageData(
    imageData
  );
}

function detectFace(src) {
  const gray =
    new cv.Mat();

  cv.cvtColor(
    src,
    gray,
    cv.COLOR_RGBA2GRAY
  );

  const classifier =
    new cv.CascadeClassifier();

  classifier.load(
    "/haarcascade_frontalface_default.xml"
  );

  const faces =
    new cv.RectVector();

  classifier.detectMultiScale(
    gray,
    faces,
    1.1,
    3,
    0
  );

  if (faces.size() === 0) {
    throw new Error(
      "No face detected"
    );
  }

  const faceRect =
    faces.get(0);

  gray.delete();
  faces.delete();
  classifier.delete();

  return faceRect;
}

function argMax(arr) {
  return arr.indexOf(
    Math.max(...arr)
  );
}

function predictAgeGender(
  src,
  faceRect
) {
  const faceROI =
    src.roi(faceRect);

  const faceRGB =
    new cv.Mat();

  cv.cvtColor(
    faceROI,
    faceRGB,
    cv.COLOR_RGBA2RGB
  );

  const blob =
    cv.blobFromImage(
      faceRGB,
      1.0,
      new cv.Size(227, 227),
      new cv.Scalar(
        78.42,
        87.76,
        114.89
      )
    );

  let detectedGender =
    "Unknown";

  let detectedAge =
    "Unknown";

  try {
    const genderNet =
      cv.readNetFromCaffe(
        "/gender_deploy.prototxt",
        "/gender_net.caffemodel"
      );

    genderNet.setInput(blob);

    const preds =
      genderNet.forward();

    detectedGender =
      GENDER_LIST[
        argMax(
          Array.from(
            preds.data32F
          )
        )
      ];

    preds.delete();
    genderNet.delete();
  } catch (err) {
    console.log(
      "Gender prediction failed"
    );
  }

  try {
    const ageNet =
      cv.readNetFromCaffe(
        "/age_deploy.prototxt",
        "/age_net.caffemodel"
      );

    ageNet.setInput(blob);

    const preds =
      ageNet.forward();

    detectedAge =
      AGE_LIST[
        argMax(
          Array.from(
            preds.data32F
          )
        )
      ];

    preds.delete();
    ageNet.delete();
  } catch (err) {
    console.log(
      "Age prediction failed"
    );
  }

  blob.delete();
  faceRGB.delete();
  faceROI.delete();

  return {
    detectedAge,
    detectedGender
  };
}

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((v) =>
        v
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
      .toUpperCase()
  );
}

function getUndertone(
  r,
  b
) {
  const diff = r - b;

  if (diff > 15)
    return "warm";

  if (diff < -15)
    return "cool";

  return "neutral";
}

function extractSkinToneAndCrop(
  src,
  faceRect
) {
  const faceROI =
    src.roi(faceRect);

  const faceData =
    faceROI.data;

  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (
    let i = 0;
    i < faceData.length;
    i += 4
  ) {
    r += faceData[i];
    g += faceData[i + 1];
    b += faceData[i + 2];
    count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  const skinToneHex =
    rgbToHex(r, g, b);

  const undertone =
    getUndertone(r, b);

  const canvas =
    createCanvas(
      faceRect.width,
      faceRect.height
    );

  const ctx =
    canvas.getContext("2d");

  const imageData =
    new ImageData(
      new Uint8ClampedArray(
        faceData
      ),
      faceRect.width,
      faceRect.height
    );

  ctx.putImageData(
    imageData,
    0,
    0
  );

  const tmpDir =
    path.join(
      __dirname,
      "../tmp"
    );

  if (
    !fs.existsSync(tmpDir)
  ) {
    fs.mkdirSync(
      tmpDir,
      { recursive: true }
    );
  }

  const croppedPath =
    path.join(
      tmpDir,
      `face_${Date.now()}.png`
    );

  fs.writeFileSync(
    croppedPath,
    canvas.toBuffer("image/png")
  );

  faceROI.delete();

  return {
    croppedPath,
    skinToneHex,
    undertone
  };
}

module.exports = {
  waitForOpenCV,
  loadAllModels,
  convertImageToMat,
  detectFace,
  predictAgeGender,
  extractSkinToneAndCrop
};