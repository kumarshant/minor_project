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
  Sparkles,
  Crown,
  CheckCircle,
  Zap,
  Coins,
  Calendar,
  MessageCircle,
  Edit
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

const BACKEND_URL = "http://localhost:5000";

export default function Account() {
  const navigate = useNavigate();
  const { logout, token } = useAuthStore();

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const isPremium =
    user?.userType === "PREMIUM"

  /*
  ----------------------------------
  AUTH CHECK
  ----------------------------------
  */
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [userRes, historyRes] =
          await Promise.all([
            api.get("/user/me"),
            api.get("/recommend/history")
          ]);

        setUser(userRes.data);

        setHistory(
          historyRes.data.recommendations || []
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed loading account"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);


  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this recommendation?"
      )
    )
      return;

    try {
      setDeleting(true);

      await api.delete(`/recommend/${id}`);

      setHistory((prev) =>
        prev.filter((item) => item._id !== id)
      );

      setSelectedItem(null);

      toast.success(
        "Recommendation deleted"
      );
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

 
  const handleEditProfile = () => {
    navigate("/edit-profile");
  };


  const handleChat = (conversationId) => {
    navigate(`/chat/${conversationId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ocean-gradient flex items-center justify-center">
        <div className="text-white text-2xl flex items-center gap-3">
          <Sparkles className="animate-spin text-cyan-bright" />
          Loading account...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean-gradient relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-bright/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ocean-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

          <button
            onClick={() => navigate("/")}
            className="text-white flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back Home
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleEditProfile}
              className="bg-cyan-bright text-ocean-900 px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <Edit size={18} />
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

        {/* PROFILE CARD */}
        {user && (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10 mb-10">
            <div className="flex flex-col lg:flex-row justify-between gap-8">

              {/* user info */}
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center">
                  <User className="text-cyan-bright w-12 h-12" />
                </div>

                <div>
                  <h1 className="text-3xl font-black text-white">
                    {user.username}
                  </h1>

                  <div className="flex items-center gap-2 text-ocean-200 mt-2">
                    <Mail size={16} />
                    {user.email}
                  </div>
                </div>
              </div>

              {/* membership */}
              <div
                className={`rounded-2xl p-6 min-w-[320px] ${
                  isPremium
                    ? "bg-yellow-500/10 border border-yellow-400/30"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  {isPremium ? (
                    <Crown className="text-yellow-400" />
                  ) : (
                    <Zap className="text-cyan-bright" />
                  )}

                  <h2 className="text-xl font-bold text-white">
                    {isPremium
                      ? "Premium Member"
                      : "Standard Member"}
                  </h2>
                </div>

                {/* credits */}
                <div className="flex items-center gap-2 text-white mb-3">
                  <Coins size={18} className="text-yellow-400" />
                  Credits: {user.credits || 0}
                </div>

                {/* premium expiry */}
                {isPremium && (
                  <div className="flex items-center gap-2 text-white">
                    <Calendar
                      size={18}
                      className="text-cyan-bright"
                    />
                    Expires:{" "}
                    {user.premiumExpiresAt
                      ? new Date(
                          user.premiumExpiresAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </div>
                )}
              </div>
            </div>

            {/* stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10">
              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-bright">
                  {history.length}
                </p>
                <p className="text-ocean-200">
                  Total Recommendations
                </p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-bright">
                  {isPremium ? "∞" : "limited"}
                </p>
                <p className="text-ocean-200">
                  Monthly Limit
                </p>
              </div>

              <div className="text-center">
                <p className="text-4xl font-bold text-cyan-bright">
                  {isPremium ? "AI+" : "Basic"}
                </p>
                <p className="text-ocean-200">
                  Recommendation Tier
                </p>
              </div>
            </div>
          </div>
        )}

        {/* HISTORY */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
          <h2 className="text-3xl font-black text-white mb-8">
            Style History
          </h2>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-ocean-200 mb-6">
                No recommendations yet
              </p>

              <button
                onClick={() => navigate("/generate")}
                className="bg-cyan-bright text-ocean-900 px-8 py-4 rounded-xl font-bold"
              >
                Generate Outfit
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((item) => (
                <div
                  key={item._id}
                  onClick={() =>
                    setSelectedItem(item)
                  }
                  className="bg-ocean-900/40 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition"
                >
                  <img
                    src={`${BACKEND_URL}/${item.imagePath}`}
                    alt="history"
                    className="w-full h-64 object-cover"
                  />

                  <div className="p-4">
                    <p className="text-white font-bold">
                      {item.event}
                    </p>

                    <p className="text-ocean-300 text-sm">
                      {new Date(
                        item.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-6">
          <div className="bg-ocean-900 max-w-2xl w-full rounded-3xl p-8 relative overflow-y-auto max-h-[90vh]">

            <button
              onClick={() =>
                setSelectedItem(null)
              }
              className="absolute top-4 right-4 text-white"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              {selectedItem.event}
            </h2>

            {/* outfits */}
            <div className="space-y-4">
              {selectedItem.recommendations?.map(
                (rec, index) => (
                  <div
                    key={index}
                    className="bg-white/5 p-4 rounded-xl"
                  >
                    <h3 className="text-cyan-bright font-bold">
                      Outfit {index + 1}
                    </h3>

                    <p className="text-white">
                      {rec.outfit}
                    </p>

                    <p className="text-ocean-300 text-sm mt-2">
                      {rec.reason}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* premium context */}
            {selectedItem.recommendationContext && (
              <div className="mt-6 bg-white/5 p-4 rounded-xl">
                <h3 className="text-white font-bold mb-2">
                  AI Style Summary
                </h3>
                <p className="text-ocean-200">
                  {selectedItem.recommendationContext}
                </p>
              </div>
            )}

            {/* chat button */}
            {selectedItem.conversationId && (
              <button
                onClick={() =>
                  handleChat(
                    selectedItem.conversationId
                  )
                }
                className="w-full mt-6 bg-cyan-bright text-ocean-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Continue AI Stylist Chat
              </button>
            )}

            {/* delete */}
            <button
              onClick={() =>
                handleDelete(selectedItem._id)
              }
              disabled={deleting}
              className="w-full mt-4 bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete Recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}