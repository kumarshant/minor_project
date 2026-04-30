import { useEffect } from "react";
import {
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  Sparkles,
  User,
  LogOut,
  Crown,
  Wand2,
  Coins
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    user,
    token,
    logout,
    fetchCurrentUser
  } = useAuthStore();

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
  }, [token]);

  const isPremium =
    user?.userType === "PREMIUM";

  const creditsLeft =
    user?.credits || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handlePricingScroll = () => {
    if (location.pathname === "/") {
      const pricing =
        document.getElementById(
          "pricing"
        );

      pricing?.scrollIntoView({
        behavior: "smooth"
      });
    } else {
      navigate("/");

      setTimeout(() => {
        const pricing =
          document.getElementById(
            "pricing"
          );

        pricing?.scrollIntoView({
          behavior: "smooth"
        });
      }, 300);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-gradient-to-r from-ocean-500 to-ocean-700">
            <Sparkles className="text-white w-5 h-5" />
          </div>

          <div>
            <h1 className="text-xl font-black text-ocean-900">
              StyleAI
            </h1>

            <p className="text-xs text-ocean-600 hidden md:block">
              AI Fashion Stylist
            </p>
          </div>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-3">

          {!user ? (
            <>
              <button
                onClick={() =>
                  navigate("/login")
                }
                className="px-4 py-2 rounded-xl hover:bg-gray-100"
              >
                Login
              </button>

              <button
                onClick={() =>
                  navigate("/register")
                }
                className="px-5 py-2 rounded-xl bg-ocean-600 text-white font-bold"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {/* Username */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="font-bold text-ocean-900">
                  {user.username}
                </span>

                <span className="text-xs text-gray-500">
                  Welcome back
                </span>
              </div>

              {/* Credits */}
              <div className="hidden md:flex items-center gap-2 bg-ocean-50 px-4 py-2 rounded-xl">
                <Coins size={16} />

                <span className="font-semibold text-ocean-900">
                  {creditsLeft} Credits
                </span>
              </div>

              {/* Premium badge */}
              {isPremium ? (
                <div className="hidden md:flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-xl border border-yellow-300 text-yellow-700 font-semibold">
                  <Crown size={16} />
                  Premium
                </div>
              ) : (
                <button
                  onClick={
                    handlePricingScroll
                  }
                  className="hidden md:flex items-center gap-2 bg-cyan-400 px-4 py-2 rounded-xl font-bold"
                >
                  <Crown size={16} />
                  Upgrade
                </button>
              )}

              {/* Generate */}
              <button
                onClick={() =>
                  navigate("/generate")
                }
                className="hidden md:flex items-center gap-2 bg-ocean-600 text-white px-4 py-2 rounded-xl"
              >
                <Wand2 size={16} />
                Generate
              </button>

              {/* Profile */}
              <button
                onClick={() =>
                  navigate("/profile")
                }
                className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200"
              >
                <User size={18} />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}