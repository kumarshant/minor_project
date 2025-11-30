// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import {
  LogOut,
  Trash2,
  X,
  ArrowLeft,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const BACKEND_URL = "http://localhost:5000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { logout, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Please log in");
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);

        const [userRes, historyRes] = await Promise.all([
          api.get("/user/me"),           // or "/user/profile"
          api.get("/recommend/history"),
        ]);

        setUser(userRes.data);
        setHistory(
          historyRes.data.recommendations ||
            historyRes.data.items ||
            historyRes.data ||
            []
        );
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this recommendation permanently?")) return;

    try {
      setDeleting(true);
      await api.delete(`/recommend/${id}`);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      setSelectedItem(null);
      toast.success("Deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Loading your style profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#7C3AED]">
      <div className="w-full px-4 py-6 md:px-8 lg:px-12">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white/10 backdrop-blur text-white px-6 py-3 rounded-xl font-medium hover:bg-white/20 transition"
          >
            <ArrowLeft size={20} /> Back to Home
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-full flex items-center justify-center shadow-xl">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {user.username || user.email.split("@")[0]}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text18 text-gray-600">
                  <Mail size={18} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t-2 border-gray-200 text-center">
              <div>
                <p className="text-4xl font-bold text-[#7C3AED]">{history.length}</p>
                <p className="text-gray-600 mt-2">Total Outfits</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#7C3AED]">{user.images?.length || 0}</p>
                <p className="text-gray-600 mt-2">Photos Uploaded</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#7C3AED]">Premium</p>
                <p className="text-gray-600 mt-2">Your Style Journey</p>
              </div>
            </div>
          </div>
        )}

        {/* Style History Only */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Style History</h2>

          {history.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-600 mb-8">No style history yet</p>
              <button
                onClick={() => navigate("/generate")}
                className="bg-[#7C3AED] text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-[#6D28D9] transition shadow-lg"
              >
                Generate Your First Outfit
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer border border-gray-100"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={`${BACKEND_URL}/uploads/${item.imagePath}`}
                      alt="Your uploaded photo"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image";
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-bold text-lg text-gray-900 truncate">
                      {item.event || "Custom Style"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-3 mt-4">
                      <div
                        className="w-10 h-10 rounded-full border-4 border-white shadow"
                        style={{ backgroundColor: item.skinTone || "#ccc" }}
                      />
                      <span className="px-4 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                        {item.undertone?.toUpperCase() || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Detailed View */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Outfit Recommendations</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-3 hover:bg-gray-100 rounded-xl transition"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-8">
              <img
                src={`${BACKEND_URL}/uploads/${selectedItem.imagePath}`}
                alt="Your photo"
                className="w-full max-h-96 object-contain rounded-2xl shadow-xl bg-gray-50 mb-8"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=Image+Not+Found";
                }}
              />

              <div className="grid grid-cols-3 gap-8 mb-10 text-center">
                <div>
                  <p className="text-gray-600 mb-3">Skin Tone</p>
                  <div
                    className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-white"
                    style={{ backgroundColor: selectedItem.skinTone || "#ccc" }}
                  />
                </div>
                <div>
                  <p className="text-gray-600 mb-3">Undertone</p>
                  <span className="inline-block px-8 py-4 bg-[#7C3AED] text-white rounded-full font-bold text-xl">
                    {selectedItem.undertone?.toUpperCase() || "N/A"}
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 mb-3">Date</p>
                  <p className="font-bold text-xl">
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center mb-8">Recommended Outfits</h3>
              <div className="space-y-8">
                {selectedItem.recommendations?.map((rec, i) => (
                  <div key={i} className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200">
                    <h4 className="text-xl font-bold text-[#7C3AED] mb-4">Outfit {i + 1}</h4>
                    <p className="text-2xl font-bold text-gray-900 mb-3">{rec.outfit}</p>
                    <p className="text-gray-700 leading-relaxed">{rec.reason}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleDelete(selectedItem._id)}
                disabled={deleting}
                className="w-full mt-12 bg-red-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 disabled:opacity-60 transition flex items-center justify-center gap-3"
              >
                <Trash2 size={24} />
                {deleting ? "Deleting..." : "Delete This Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}