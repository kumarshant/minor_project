// src/pages/Generate.jsx
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { Camera, Sparkles, Loader2, LogOut, RefreshCw ,User} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";


export default function Generate() {
  const [image, setImage] = useState(null);
  const [event, setEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultsRef, setResultsRef] = useState(null);

  const { logout, token } = useAuthStore();
  const navigate = useNavigate();

  // Protect Route
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token]);

  // Prevent going back
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handler = () => window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultsRef) {
      resultsRef.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  // Dropzone logic
  const onDrop = (files) => {
    const file = files[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  // Submit
  const handleSubmit = async () => {
    if (!image?.file || !event) {
      toast.error("Upload an image and enter an event!");
      return;
    }

    setLoading(true);
    setResult(null); // Clear previous results

    const form = new FormData();
    form.append("image", image.file);
    form.append("event", event);

    try {
      const res = await api.post("/recommend/generate", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("RESULT RESPONSE:", res.data); // debugging
      const recommendationData = res.data.recommendation;
if (recommendationData) {
  setResult({
    skinTone: recommendationData.skinTone,
    undertone: recommendationData.undertone,
    recommendations: recommendationData.recommendations,
  });
}
      toast.success("Outfits generated!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to generate");
    }

    setLoading(false);
  };

  // Reset form
  const handleReset = () => {
    setImage(null);
    setEvent("");
    setResult(null);
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#7C3AED] p-6">

      <div className="max-w-4xl mx-auto">


{/* Header with Profile & Logout */}
<div className="flex justify-between items-center mb-8">
  <button
    onClick={() => navigate("/")}
    className="flex items-center gap-2 text-white hover:opacity-80 transition"
  >
    <Sparkles className="w-8 h-8" />
    <span className="text-2xl font-bold">StyleAI</span>
  </button>

  <div className="flex items-center gap-4">
    <button
      onClick={() => navigate("/profile")}
      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-white"
      title="Go to Profile"
    >
      <User className="w-6 h-6" />
    </button>

    <button
      onClick={handleLogout}
      className="bg-white text-[#7C3AED] px-4 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-gray-100 transition"
    >
      <LogOut size={18} />
      Logout
    </button>
  </div>
</div>

        {/* Main Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 md:p-10">

          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900">
               <span className="text-primary-600">Outfit Recommendation Generator</span>
            </h2>
            <p className="text-gray-600 mt-2">Upload a photo + event → Get 3 custom outfits</p>
          </div>

          {/* Form Section */}
          <div className="grid md:grid-cols-2 gap-10">

            {/* Image Upload */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Upload your image</p>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition
                  ${
                    isDragActive
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-300 hover:border-primary-600 hover:bg-gray-50"
                  }`}
              >
                <input {...getInputProps()} />

                {image?.preview ? (
                  <div className="flex flex-col items-center">
                    <img src={image.preview} className="max-h-64 rounded-xl mx-auto shadow-md mb-3" />
                    <p className="text-sm text-gray-600">Click or drag to replace</p>
                  </div>
                ) : (
                  <>
                    <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-700 font-medium">Drag & drop or click to upload</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Event Input */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Event</p>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="Wedding, Office, Date Night..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent mb-3 text-black"
              />
              <p className="text-xs text-gray-500">Describe the occasion for better recommendations</p>
            </div>
            
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed transition"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? "Analyzing..." : "Generate Outfits"}
            </button>

            {result && (
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-800 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-300 transition"
              >
                <RefreshCw size={20} />
                New Upload
              </button>
            )}
          </div>

        </div>

        {/* RESULTS SECTION */}
        {result && (
          <div ref={setResultsRef} className="mt-12 bg-white shadow-2xl rounded-2xl p-8 md:p-10">

            {/* Skin + Undertone */}
            <div className="text-center bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-2xl mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Color Profile</h2>

              <div className="flex flex-col md:flex-row justify-center items-center gap-12">
                <div className="flex flex-col items-center">
                  <p className="text-gray-700 font-semibold mb-4">Skin Tone</p>
                  <div
                    className="w-24 h-24 rounded-full shadow-lg border-4 border-white"
                    style={{ backgroundColor: result.skinTone || "#ccc" }}
                    title={result.skinTone}
                  ></div>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 font-semibold mb-4">Undertone</p>
                  <span className="inline-block px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg">
                    {(result.undertone || "N/A").toUpperCase()}
                  </span>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 font-semibold mb-4">Event</p>
                  <span className="inline-block px-8 py-4 bg-gray-200 text-gray-800 rounded-full font-bold text-lg capitalize">
                    {event}
                  </span>
                </div>
              </div>
            </div>

            {/* Outfits Grid */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Your Personalized Outfits</h3>

              <div className="grid md:grid-cols-3 gap-8">
                {result.recommendations && result.recommendations.length > 0 ? (
                  result.recommendations.map((rec, i) => (
                    <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition p-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-primary-600">Outfit {i + 1}</h3>
                        <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                      </div>

                      <div className="border-t-2 border-primary-200 pt-4">
                        <p className="font-semibold text-gray-800 text-lg mb-4">{rec.outfit}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-xl text-gray-600">No outfits returned by API</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full mt-12 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
            >
              Generate Again
            </button>

          </div>
        )}

      </div>
    </div>
  );
}