// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { LogOut, Trash2, X, ArrowLeft, User, Mail, Calendar } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const { logout, token } = useAuthStore();
  const navigate = useNavigate();

  // Protect Route
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token]);

  // Fetch user info and history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user info
        const userRes = await api.get("/auth/me");
        setUser(userRes.data.user);

        // Fetch recommendation history
        const historyRes = await api.get("/recommend/history?limit=100");
        setHistory(historyRes.data.items);

      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete recommendation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recommendation?")) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/recommend/${id}`);
      setHistory(history.filter(item => item._id !== id));
      setSelectedItem(null);
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Go Home
  const goHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#7C3AED] via-[#4F46E5] to-[#7C3AED] p-6">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={goHome}
            className="flex items-center gap-2 bg-white text-[#7C3AED] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            className="bg-white text-[#7C3AED] px-6 py-2 rounded-lg flex items-center gap-2 font-semibold hover:bg-gray-100 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* User Info Card */}
        {user && (
          <div className="bg-white shadow-2xl rounded-2xl p-10 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-16 h-16 text-white" />
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{user.name}</h1>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#7C3AED]" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#7C3AED]" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="border-t-2 border-gray-200 mt-8 pt-8">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-[#7C3AED]">{history.length}</p>
                  <p className="text-gray-600 mt-2">Total Outfits Generated</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#7C3AED]">
                    {history.length > 0 ? (history.length / 3).toFixed(1) : 0}
                  </p>
                  <p className="text-gray-600 mt-2">Style Sessions</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[#7C3AED]">⭐ Premium</p>
                  <p className="text-gray-600 mt-2">Account Status</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Style History</h2>

          {history.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition cursor-pointer"
                >
                  {/* Image */}
                  {item.imagePath && (
                    <div className="w-full h-48 bg-gray-300 overflow-hidden">
                      <img
                        src={`http://localhost:5000/${item.imagePath}`}
                        alt="Generated outfit"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Card Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 capitalize">
                          {item.event || "Event"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: item.skinTone || "#ccc" }}
                      ></div>
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {item.undertone || "N/A"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600">
                      Click to view details and recommendations
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-600 mb-6">No style history yet</p>
              <button
                onClick={() => navigate("/generate")}
                className="bg-[#7C3AED] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6D28D9] transition"
              >
                Generate Your First Outfit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Detail View */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

            {/* Close Button */}
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedItem.event ? `${selectedItem.event} - Outfit Recommendations` : "Outfit Recommendations"}
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">

              {/* Image */}
              {selectedItem.imagePath && (
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img
                    src={`http://localhost:5000/${selectedItem.imagePath}`}
                    alt="Generated outfit"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Color Profile */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Color Profile</h3>
                <div className="flex flex-col md:flex-row justify-around items-center gap-6">
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold mb-2">Skin Tone</p>
                    <div
                      className="w-20 h-20 rounded-full shadow-lg border-4 border-white mx-auto"
                      style={{ backgroundColor: selectedItem.skinTone || "#ccc" }}
                    ></div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold mb-2">Undertone</p>
                    <span className="inline-block px-6 py-3 bg-[#7C3AED] text-white rounded-full font-bold">
                      {(selectedItem.undertone || "N/A").toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold mb-2">Created</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">Personalized Outfits</h3>
                <div className="space-y-6">
                  {selectedItem.recommendations && selectedItem.recommendations.length > 0 ? (
                    selectedItem.recommendations.map((rec, i) => (
                      <div key={i} className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
                        <h4 className="text-lg font-bold text-[#7C3AED] mb-3">Outfit {i + 1}</h4>
                        <p className="font-semibold text-gray-800 mb-2">{rec.outfit}</p>
                        <p className="text-gray-700">{rec.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No recommendations available</p>
                  )}
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(selectedItem._id)}
                disabled={deleting}
                className="w-full mt-8 bg-red-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-red-600 disabled:opacity-70 disabled:cursor-not-allowed transition"
              >
                <Trash2 size={20} />
                {deleting ? "Deleting..." : "Delete This Recommendation"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}