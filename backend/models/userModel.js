const mongoose=require('mongoose');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    preferences: {
      skinTone: { type: String, enum: ["Fair", "Medium", "Deep"], default: null },
      undertone: { type: String, enum: ["Warm", "Cool", "Neutral"], default: null },
      stylePreferences: [{ type: String }], // e.g., ["casual", "formal", "streetwear"]
      savedPalettes: [{ type: [String] }], // array of hex codes or palette names
    },

    images: [
      {
        url: { type: String, required: true }, 
        uploadedAt: { type: Date, default: Date.now },
        analyzedData: {
          primaryColor: { type: String },
          secondaryColor: { type: String },
          accentColor: { type: String },
          recommendations: [{ type: String }],
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;