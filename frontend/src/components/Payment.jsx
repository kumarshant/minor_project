import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Crown,
  Sparkles,
  Coins,
  Lock,
  X,
  Loader2,
  Gift
} from "lucide-react";

import api from "../services/api";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

export default function Payment() {
  const navigate = useNavigate();

  const { user, fetchProfile } =
    useAuthStore();

  const [showModal, setShowModal] =
    useState(false);

  const [referralCode, setReferralCode] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // backend uses credits
  const userCredits = user?.credits || 0;

  const handleStandard = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate("/generate");
    }
  };

  //-----------------------------------
  // Premium unlock API
  //-----------------------------------
  const handlePremiumUnlock = async () => {
    if (!user) {
      navigate("/register");
      return;
    }

    if (userCredits < 500) {
      toast.error(
        "Not enough credits to unlock premium"
      );
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
        "/user/getPremium",
        {
          referralCode
        }
      );

      toast.success(
        data.message ||
          "Premium unlocked successfully!"
      );

      // refresh latest user data
      await fetchProfile();

      setShowModal(false);
      setReferralCode("");

      navigate("/generate");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to unlock premium"
      );
    } finally {
      setLoading(false);
    }
  };

  const standardFeatures = [
    "3 outfit recommendations",
    "Event-based styling",
    "Basic AI suggestions",
    "Limited history",
    "Free forever"
  ];

  const premiumFeatures = [
    "Advanced face analysis",
    "AI stylist chat",
    "Shopping recommendations",
    "Style memory",
    "Premium recommendation history",
    "Priority processing",
    "Unlimited premium styling"
  ];

  return (
    <>
      <section className="py-24 bg-gradient-to-b from-ocean-900 to-ocean-950 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-bright/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-ocean-500/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-cyan-bright/10 text-cyan-bright px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              Upgrade Plans
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Upgrade Your Style Journey
            </h2>

            <p className="text-ocean-200 text-lg max-w-2xl mx-auto">
              Use your earned credits to unlock premium styling features.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* Standard */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Standard
              </h3>

              <p className="text-ocean-300 mb-6">
                Perfect for casual styling
              </p>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">
                  Free
                </span>
              </div>

              <ul className="space-y-4 mb-8">
                {standardFeatures.map(
                  (feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-ocean-100"
                    >
                      <Check
                        className="text-green-400"
                        size={18}
                      />
                      {feature}
                    </li>
                  )
                )}
              </ul>

              <button
                onClick={handleStandard}
                className="w-full py-4 rounded-xl bg-white text-ocean-900 font-bold hover:scale-105 transition"
              >
                Continue Free
              </button>
            </div>

            {/* Premium */}
            <div className="relative bg-gradient-to-br from-cyan-bright/10 to-ocean-700/20 border border-cyan-bright/30 rounded-3xl p-8 shadow-neon-lg">

              <div className="absolute -top-4 right-6 bg-cyan-bright text-ocean-900 px-4 py-2 rounded-full text-sm font-bold">
                Premium Access
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown
                    className="text-yellow-400"
                    size={22}
                  />
                  <h3 className="text-2xl font-bold text-white">
                    Premium
                  </h3>
                </div>

                <p className="text-cyan-100">
                  Unlock using credits
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <Coins className="text-yellow-400" />

                  <span className="text-5xl font-bold text-white">
                    500
                  </span>
                </div>

                <span className="text-cyan-200">
                  credits required
                </span>
              </div>

              {/* Current balance */}
              <div className="mb-6 bg-white/10 rounded-xl p-4 text-center">
                <p className="text-ocean-200 text-sm">
                  Your Balance
                </p>

                <p className="text-2xl font-bold text-yellow-400">
                  {userCredits} Credits
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {premiumFeatures.map(
                  (feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 text-white"
                    >
                      <Check
                        className="text-cyan-bright"
                        size={18}
                      />
                      {feature}
                    </li>
                  )
                )}
              </ul>

              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="w-full py-4 rounded-xl bg-cyan-bright text-ocean-900 font-bold hover:shadow-neon-lg hover:scale-105 transition flex items-center justify-center gap-2"
              >
                <Lock size={18} />
                Unlock Premium
              </button>
            </div>
          </div>

          <div className="text-center mt-12 text-ocean-300">
            Earn credits through activity • No real money needed • Unlock anytime
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">

          <div className="bg-ocean-900 w-full max-w-md rounded-3xl p-8 relative border border-white/10">

            {/* Close */}
            <button
              onClick={() =>
                setShowModal(false)
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <Gift
                className="mx-auto text-yellow-400 mb-3"
                size={40}
              />

              <h2 className="text-2xl font-bold text-white">
                Confirm Premium Upgrade
              </h2>

              <p className="text-ocean-300 mt-2">
                500 credits will be deducted
              </p>
            </div>

            {/* Referral input */}
            <input
              type="text"
              value={referralCode}
              onChange={(e) =>
                setReferralCode(
                  e.target.value
                )
              }
              placeholder="Referral code (optional)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white mb-6"
            />

            <button
              onClick={handlePremiumUnlock}
              disabled={loading}
              className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown size={18} />
                  Confirm Upgrade
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}