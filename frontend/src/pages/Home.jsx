import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Camera,
  Palette,
  Zap,
  ArrowRight,
  Star,
  Aperture,
  Wand2,
  TrendingUp,
  Shield,
  Clock,
} from "lucide-react";

import { useAuthStore } from "../store/useAuthStore";
import Navbar from "../components/Navbar";
import Payment from "../components/Payment"

import Generate from "../pages/Generate"
import Profile from "../pages/Profile"


export default function Home() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const features = [
    {
      icon: Aperture,
      title: "AI-Powered Accuracy",
      desc: "Our ML models analyze thousands of styling data points for perfect color matches.",
    },
    {
      icon: Palette,
      title: "Color Science",
      desc: "Discover if you're warm, cool, or neutral with scientific precision.",
    },
    {
      icon: Wand2,
      title: "Instant Styling",
      desc: "Get curated outfits tailored specifically to you in seconds.",
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      desc: "Stay updated with personalized fashion trends that work for you.",
    },
    {
      icon: Shield,
      title: "100% Private",
      desc: "Your photos and data are never shared.",
    },
    {
      icon: Clock,
      title: "Save Time",
      desc: "No more decision paralysis. Style smarter with AI guidance.",
    },
  ];

  const testimonials = [
    {
      name: "Abhinav",
      role: "Student",
      text: "StyleAI is what we built and we’re proud of it. Absolutely incredible!",
      rating: 5,
    },
    {
      name: "Hardik",
      role: "Fashion Enthusiast",
      text: "The accuracy of the color analysis blew my mind. Styling made simple.",
      rating: 5,
    },
    {
      name: "Vikas",
      role: "Frontend Developer",
      text: "As a designer, I appreciate both the tech and fashion expertise.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-dark-50 flex flex-col overflow-x-hidden">
      <Navbar showProfile={false} />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-br from-ocean-50 via-white to-cyan-light/10">
        
        {/* Background Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ocean-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-accent rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/3"></div>
        </div>

        <div className="relative container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-ocean-100 text-ocean-900 px-4 py-2 rounded-full mb-8 font-bold text-sm shadow-sm border border-ocean-200">
              <Sparkles size={16} className="text-ocean-600" />
              Powered by Advanced AI & Color Science
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-dark-900 tracking-tight mb-6">
              Your Personal <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-700 to-cyan-bright">
                AI Fashion Stylist
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-dark-700 mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
              Upload a photo. Get personalized outfits with advanced color science,
              undertone analysis, and professional styling tips—instantly.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <button
                onClick={() => navigate(user ? "/generate" : "/register")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ocean-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-ocean-700 transition-all shadow-neon hover:scale-105"
              >
                <Sparkles size={20} />
                {user ? "Go to Generator" : "Start Styling Free"}
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate("/generate")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-ocean-900 bg-white border-2 border-ocean-200 hover:border-ocean-600 hover:bg-ocean-50 transition-all"
              >
                Try Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <p className="text-dark-600 text-sm font-bold">
              ✓ No credit card required • ✓ Instant results • ✓ 100% private
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-20 max-w-5xl mx-auto">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "50K+", label: "Outfits Generated" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "98%", label: "Accuracy Rate" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl text-center shadow-ocean border border-ocean-100"
              >
                <div className="text-3xl md:text-4xl font-black text-ocean-700 mb-2">
                  {stat.value}
                </div>
                <p className="text-dark-700 font-bold text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-dark-600 font-medium max-w-2xl mx-auto">
              Three simple steps to discover your perfect style.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Camera,
                title: "Upload Photo",
                desc: "Upload a selfie and let AI analyze your features.",
              },
              {
                icon: Palette,
                title: "Color Analysis",
                desc: "Discover your ideal tones and season palette.",
              },
              {
                icon: Zap,
                title: "Get Outfits",
                desc: "Receive curated outfits instantly.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="text-center group p-6 rounded-2xl hover:bg-ocean-50 transition-all"
                >
                  <div className="w-20 h-20 bg-ocean-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-ocean-600 transition-all">
                    <Icon className="w-10 h-10 text-ocean-600 group-hover:text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-dark-900 mb-3">
                    {item.title}
                  </h3>

                  <p className="text-dark-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-dark-50 border-y border-ocean-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-4">
              Why Choose StyleAI?
            </h2>

            <p className="text-xl text-dark-600 font-medium">
              Advanced technology meets fashion expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;

              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-ocean transition-all border border-ocean-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-ocean-100 rounded-lg text-ocean-700 flex-shrink-0">
                      <Icon size={24} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-dark-900 mb-2">
                        {feature.title}
                      </h3>

                      <p className="text-dark-600 leading-relaxed font-medium">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-dark-900 mb-4">
              Loved by Creators
            </h2>

            <p className="text-xl text-dark-600 font-medium">
              See what users say about StyleAI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-dark-50 p-8 rounded-2xl border border-ocean-100 hover:shadow-ocean transition-all"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star
                      key={j}
                      size={18}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                <p className="text-dark-800 mb-8 italic leading-relaxed text-lg font-medium">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-ocean-600 rounded-full flex items-center justify-center font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-bold text-dark-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-dark-500 font-bold">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-ocean-gradient relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Discover Your Perfect Colors?
          </h2>

          <p className="text-xl text-white mb-10 max-w-2xl mx-auto font-medium">
            Join thousands of users styling with AI-powered fashion analysis.
          </p>

          <button
            onClick={() => navigate(user ? "/generate" : "/register")}
            className="inline-flex items-center bg-white text-ocean-900 px-10 py-4 rounded-full text-lg font-black hover:bg-ocean-50 hover:scale-105 transition-all shadow-neon"
          >
            {user ? "Go to Generator" : "Get Started Free"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>

          <p className="text-cyan-light mt-6 font-bold">
            Free forever • No credit card required • Results in seconds
          </p>
        </div>
      </section>
    

      <section
        id="pricing"
  className="py-0 bg-gradient-to-b from-ocean-900 to-ocean-950 relative overflow-hidden">
         <Payment/>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark-900 text-gray-300 py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-ocean-600 rounded-lg">
                  <Sparkles size={20} className="text-white" />
                </div>

                <span className="text-2xl font-black text-white">
                  StyleAI
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Your AI-powered fashion stylist built with color science.
              </p>
            </div>

            <div>
              <p className="font-black mb-4 text-white uppercase text-xs">
                Product
              </p>

              <ul className="space-y-3 text-sm font-bold">
                <li>
                  <Link
                    to="/generate"
                    className="hover:text-cyan-bright transition-colors"
                  >
                    Generator
                  </Link>
                </li>

                <li>
                  <Link
                    to="/profile"
                    className="hover:text-cyan-bright transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-black mb-4 text-white uppercase text-xs">
                Company
              </p>

              <ul className="space-y-3 text-sm font-bold">
                <li>
                  <a href="#" className="hover:text-cyan-bright">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-bright">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-black mb-4 text-white uppercase text-xs">
                Legal
              </p>

              <ul className="space-y-3 text-sm font-bold">
                <li>
                  <a href="#" className="hover:text-cyan-bright">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-bright">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-700 pt-8 text-center text-gray-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-bold">
              © {new Date().getFullYear()} StyleAI. All rights reserved.
            </p>

            <p className="font-bold">
              Made with ❤️ by the StyleAI Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}