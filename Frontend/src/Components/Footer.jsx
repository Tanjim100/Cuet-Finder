import { Link } from "react-router-dom";
import { useTheme } from "../App";

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`relative border-t ${
        isDark ? "bg-slate-900 border-white/10" : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          isDark ? "from-purple-900/20" : "from-purple-100/50"
        } to-transparent pointer-events-none`}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg
                  className="w-7 h-7 text-white"
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
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CUETFinders
              </span>
            </Link>
            <p
              className={`mb-6 leading-relaxed ${
                isDark ? "text-white/60" : "text-gray-600"
              }`}
            >
              The official lost &amp; found platform for CUET students. Helping
              reunite people with their belongings since 2024.
            </p>
            <div className="flex gap-4">
              {["facebook", "twitter", "linkedin"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 text-white/60 hover:text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {social === "facebook" && (
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    )}
                    {social === "twitter" && (
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    )}
                    {social === "linkedin" && (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`font-semibold text-lg mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Home", path: "/" },
                { label: "Lost Items", path: "/lost" },
                { label: "Found Items", path: "/found" },
                { label: "Report Lost", path: "/reportlost" },
                { label: "Post Found", path: "/reportfound" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`hover:translate-x-1 transition-all duration-300 flex items-center gap-2 ${
                      isDark
                        ? "text-white/60 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4
              className={`font-semibold text-lg mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Support
            </h4>
            <ul className="space-y-4">
              {[
                "Customer Support",
                "Terms & Conditions",
                "Privacy Policy",
                "FAQ",
                "About Us",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className={`hover:translate-x-1 transition-all duration-300 flex items-center gap-2 ${
                      isDark
                        ? "text-white/60 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className={`font-semibold text-lg mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white/50" : "text-gray-500"
                    }`}
                  >
                    Phone
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    +8801516536056
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-pink-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white/50" : "text-gray-500"
                    }`}
                  >
                    Email
                  </p>
                  <a
                    href="mailto:cuetfinder@gmail.com"
                    className={`hover:text-purple-400 transition-colors ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    cuetfinder@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-cyan-400"
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
                <div>
                  <p
                    className={`text-sm ${
                      isDark ? "text-white/50" : "text-gray-500"
                    }`}
                  >
                    Location
                  </p>
                  <p className={isDark ? "text-white" : "text-gray-900"}>
                    CUET, Chittagong
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
            isDark ? "border-white/10" : "border-gray-200"
          }`}
        >
          <p
            className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}
          >
            © {new Date().getFullYear()} CUETFinders. All rights reserved.
          </p>
          <p
            className={`text-sm ${isDark ? "text-white/50" : "text-gray-500"}`}
          >
            Made with <span className="text-red-400">❤</span> by CUET Students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
