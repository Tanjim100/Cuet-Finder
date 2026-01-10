import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../App";

const Home = () => {
  const { isDark } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ lost: 0, found: 0, reunited: 0 });

  useEffect(() => {
    setIsVisible(true);
    // Animate stats
    const interval = setInterval(() => {
      setStats((prev) => ({
        lost: prev.lost < 150 ? prev.lost + 3 : 150,
        found: prev.found < 120 ? prev.found + 2 : 120,
        reunited: prev.reunited < 95 ? prev.reunited + 2 : 95,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`min-h-screen overflow-hidden ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl ${
            isDark ? "opacity-30" : "opacity-20"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl ${
            isDark ? "opacity-30" : "opacity-20"
          } animate-pulse`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl ${
            isDark ? "opacity-20" : "opacity-10"
          } animate-pulse`}
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div
              className={`inline-flex items-center gap-2 ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-purple-100 border-purple-200"
              } backdrop-blur-sm px-4 py-2 rounded-full border`}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span
                className={`${
                  isDark ? "text-white/80" : "text-purple-700"
                } text-sm`}
              >
                Trusted by CUET Community
              </span>
            </div>

            <h1
              className={`text-5xl lg:text-7xl font-bold leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Lost Something?
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                We&apos;ll Find It.
              </span>
            </h1>

            <p
              className={`text-xl max-w-lg leading-relaxed ${
                isDark ? "text-white/70" : "text-gray-600"
              }`}
            >
              The official lost &amp; found platform for CUET students. Report
              lost items, post found belongings, and reunite with your valuables
              effortlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/reportlost"
                className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Report Lost Item
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                to="/reportfound"
                className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Post Found Item
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div
            className={`relative h-[500px] transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Main Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-80 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl hover:scale-105 transition-transform duration-500">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Quick Recovery
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our smart matching system helps connect lost items with their
                owners faster than ever.
              </p>
              <div className="mt-6 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 border-2 border-white/20"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 border-2 border-white/20"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-400 border-2 border-white/20"></div>
                </div>
                <span className="text-white/50 text-xs">+200 reunited</span>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div
              className="absolute top-10 left-10 w-48 h-24 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    24/7 Active
                  </p>
                  <p className="text-white/50 text-xs">Always monitoring</p>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div
              className="absolute bottom-20 right-5 w-52 h-28 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-xl animate-bounce"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    Item Found!
                  </p>
                  <p className="text-white/50 text-xs">iPhone 15 Pro</p>
                </div>
              </div>
              <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-2">
                {stats.lost}+
              </div>
              <p className="text-white/60">Items Reported Lost</p>
            </div>
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {stats.found}+
              </div>
              <p className="text-white/60">Items Found</p>
            </div>
            <div className="text-center p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                {stats.reunited}%
              </div>
              <p className="text-white/60">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Simple, fast, and effective. Get reunited with your belongings in
              just a few steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Report Your Item
              </h3>
              <p className="text-white/60 leading-relaxed">
                Fill out a simple form with details about your lost or found
                item including photos and location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Smart Matching
              </h3>
              <p className="text-white/60 leading-relaxed">
                Our system automatically matches lost items with found reports
                to speed up the recovery process.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/10 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                3
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Get Reunited
              </h3>
              <p className="text-white/60 leading-relaxed">
                Connect with the finder through our secure platform and arrange
                to get your item back safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 backdrop-blur-xl rounded-3xl border border-white/10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Looking for Something?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Browse through all reported lost and found items in our database.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/lost"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                View Lost Items
              </Link>
              <Link
                to="/found"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                View Found Items
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
