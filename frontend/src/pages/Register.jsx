// src/pages/Register.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../lib/validation";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

import {
  Sparkles,
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowRight
} from "lucide-react";

export default function Register() {
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const success = await registerUser(data);

    if (success) {
      navigate("/generate");
    }
  };

  return (
    <div className="min-h-screen bg-ocean-gradient relative overflow-hidden flex items-center justify-center px-6 py-12">

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-bright/20 rounded-full blur-3xl animate-pulse-cyan"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-ocean-400/20 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-3 group"
          >
            <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl group-hover:shadow-neon-lg transition-all duration-300">
              <Sparkles size={24} className="text-cyan-bright" />
            </div>

            <span className="text-3xl font-black text-white tracking-tight">
              StyleAI
            </span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-ocean-xl">

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              Create Account
            </h1>

            <p className="text-cyan-light">
              Join the future of AI-powered fashion styling
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-ocean-100 mb-2">
                Username
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-300 w-5 h-5" />

                <input
                  {...register("username")}
                  type="text"
                  placeholder="stylish_you"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-ocean-900/40 border border-ocean-600 text-white placeholder-ocean-300 focus:outline-none focus:ring-2 focus:ring-cyan-bright focus:border-transparent transition-all"
                />
              </div>

              {errors.username && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-ocean-100 mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-300 w-5 h-5" />

                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-ocean-900/40 border border-ocean-600 text-white placeholder-ocean-300 focus:outline-none focus:ring-2 focus:ring-cyan-bright focus:border-transparent transition-all"
                />
              </div>

              {errors.email && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-ocean-100 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-300 w-5 h-5" />

                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-ocean-900/40 border border-ocean-600 text-white placeholder-ocean-300 focus:outline-none focus:ring-2 focus:ring-cyan-bright focus:border-transparent transition-all"
                />
              </div>

              {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-ocean-100 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean-300 w-5 h-5" />

                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-ocean-900/40 border border-ocean-600 text-white placeholder-ocean-300 focus:outline-none focus:ring-2 focus:ring-cyan-bright focus:border-transparent transition-all"
                />
              </div>

              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 bg-gradient-to-r from-ocean-500 to-ocean-700 text-white py-3.5 rounded-xl font-bold hover:shadow-neon-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />

              {isSubmitting ? "Creating Account..." : "Create Account"}

              {!isSubmitting && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-ocean-700"></div>
            <span className="text-sm text-ocean-300">or</span>
            <div className="flex-1 h-px bg-ocean-700"></div>
          </div>

          {/* Login */}
          <p className="text-center text-ocean-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-cyan-bright hover:text-cyan-light transition"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer text */}
        <p className="text-center text-ocean-300 text-sm mt-6">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}