// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { Sparkles, User } from 'lucide-react';

export default function Navbar({ showProfile = false }) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - Clickable to Home */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <Sparkles className="w-8 h-8 text-[#7C3AED]" />
          <span className="text-2xl font-bold text-gray-900">StyleAI</span>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {showProfile && (
            <button
              onClick={() => navigate("/profile")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Go to Profile"
            >
              <User className="w-6 h-6 text-[#7C3AED]" />
            </button>
          )}

          <button
            onClick={() => navigate("/login")}
            className="text-gray-900 font-semibold hover:text-[#7C3AED] transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-[#7C3AED] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#6D28D9] transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}