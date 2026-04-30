import { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

import {
  Sparkles,
  Loader2,
  User,
  Crown,
  UploadCloud,
  RefreshCw
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

export default function Generate() {
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  const { token, logout, user, fetchProfile } =
    useAuthStore();

  //-----------------------------------
  // State
  //-----------------------------------
  const [image, setImage] = useState(null);
  const [event, setEvent] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // PREMIUM ONLY
  const [userQuery, setUserQuery] = useState("");
  const [preferences, setPreferences] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  //-----------------------------------
  // Premium check
  //-----------------------------------
  const isPremium =
    user?.userType === "PREMIUM" 

  //-----------------------------------
  // Auth check
  //-----------------------------------
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  //-----------------------------------
  // Fetch fresh profile if needed
  //-----------------------------------
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
  }, [token, user, fetchProfile]);

  //-----------------------------------
  // Scroll to results
  //-----------------------------------
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [result]);

  //-----------------------------------
  // Dropzone
  //-----------------------------------
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setImage({
      file,
      preview: URL.createObjectURL(file)
    });
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({
    onDrop,
    accept: {
      "image/*": []
    },
    maxFiles: 1
  });

  //-----------------------------------
  // Submit
  //-----------------------------------
  const handleSubmit = async () => {
    if (!image?.file) {
      toast.error("Please upload image");
      return;
    }

    if (!event.trim()) {
      toast.error("Please enter event");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();

      //-----------------------------------
      // BASE PAYLOAD
      //-----------------------------------
      formData.append("image", image.file);
      formData.append("event", event);
      formData.append("age", age);
      formData.append("gender", gender);

      //-----------------------------------
      // PREMIUM PAYLOAD
      //-----------------------------------
      if (isPremium) {
        formData.append("userQuery", userQuery);
        formData.append(
          "preferences",
          preferences
        );

        console.log(
          "Sending premium payload"
        );
      }

      console.log("Submitting recommendation...");

      const res = await api.post(
        "/recommend/generate",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      );

      const recommendation =
        res.data.recommendation;

      setResult(recommendation);

      toast.success(
        "Recommendations generated!"
      );

    } catch (error) {
      console.log(
        "Generation error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Generation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  //-----------------------------------
  // Reset
  //-----------------------------------
  const handleReset = () => {
    setImage(null);
    setEvent("");
    setAge("");
    setGender("");
    setUserQuery("");
    setPreferences("");
    setResult(null);
  };

  //-----------------------------------
  // Logout
  //-----------------------------------
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-ocean-gradient relative overflow-hidden">

      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-white"
          >
            <Sparkles className="text-cyan-bright" />
            <span className="font-bold text-xl">
              StyleAI
            </span>
          </button>

          <div className="flex gap-4 items-center">
            {!isPremium && (
              <button className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                <Crown size={18} />
                Upgrade
              </button>
            )}

            <button
              onClick={() =>
                navigate("/profile")
              }
              className="bg-white/10 p-3 rounded-xl text-white"
            >
              <User size={18} />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-xl text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8">

          <h1 className="text-4xl font-black text-white text-center mb-8">
            AI Outfit Generator
          </h1>

          <div className="grid lg:grid-cols-2 gap-10">

            {/* Upload */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer ${
                isDragActive
                  ? "border-cyan-bright bg-cyan-bright/10"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <input {...getInputProps()} />

              {image?.preview ? (
                <img
                  src={image.preview}
                  alt="preview"
                  className="w-full max-h-80 object-cover rounded-2xl"
                />
              ) : (
                <>
                  <UploadCloud
                    className="mx-auto text-cyan-bright mb-4"
                    size={50}
                  />
                  <p className="text-white">
                    Upload your image
                  </p>
                </>
              )}
            </div>

            {/* Form */}
            <div className="space-y-5">

              <input
                value={event}
                onChange={(e) =>
                  setEvent(e.target.value)
                }
                placeholder="Wedding, office, date..."
                className="w-full px-4 py-3 rounded-xl bg-ocean-900/40 text-white"
              />

              <input
                value={age}
                onChange={(e) =>
                  setAge(e.target.value)
                }
                placeholder="Age"
                className="w-full px-4 py-3 rounded-xl bg-ocean-900/40 text-white"
              />

              <select
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-ocean-900/40 text-white"
              >
                <option value="">
                  Select Gender
                </option>
                <option value="male">
                  Male
                </option>
                <option value="female">
                  Female
                </option>
              </select>

              {/* PREMIUM FIELDS */}
              {isPremium && (
                <>
                  <textarea
                    value={userQuery}
                    onChange={(e) =>
                      setUserQuery(
                        e.target.value
                      )
                    }
                    placeholder="What style do you want? (e.g streetwear, luxury formal, casual korean)"
                    className="w-full px-4 py-3 rounded-xl bg-ocean-900/40 text-white"
                  />

                  <textarea
                    value={preferences}
                    onChange={(e) =>
                      setPreferences(
                        e.target.value
                      )
                    }
                    placeholder="Your preferences (colors, brands, vibes)"
                    className="w-full px-4 py-3 rounded-xl bg-ocean-900/40 text-white"
                  />
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-ocean-500 to-ocean-700 py-4 rounded-xl text-white font-bold flex justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}

                {loading
                  ? "Analyzing..."
                  : "Generate Outfits"}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div
            ref={resultsRef}
            className="mt-10 space-y-6"
          >
            <div className="bg-white/10 rounded-3xl p-8">
              <h2 className="text-white text-2xl font-bold mb-4">
                Your Analysis
              </h2>

              <p className="text-white">
                Skin Tone: {result.skinTone}
              </p>

              <p className="text-white">
                Undertone: {result.undertone}
              </p>

              {result.recommendationContext && (
                <p className="text-ocean-200 mt-4">
                  {result.recommendationContext}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {result.recommendations?.map(
                (rec, i) => (
                  <div
                    key={i}
                    className="bg-white/10 rounded-2xl p-6"
                  >
                    <h3 className="text-cyan-bright font-bold">
                      Outfit {i + 1}
                    </h3>

                    <p className="text-white mt-2">
                      {rec.outfit}
                    </p>

                    <p className="text-ocean-200 text-sm mt-2">
                      {rec.reason}
                    </p>
                  </div>
                )
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-white/10 py-4 rounded-xl text-white"
            >
              <RefreshCw className="inline mr-2" />
              Generate Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}