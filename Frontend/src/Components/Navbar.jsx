import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiEndpoints } from "../config/api";
import { useLanguage, useTheme } from "../App";

function Navbar({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (user) {
      fetchCounts();
      const interval = setInterval(fetchCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchCounts = async () => {
    try {
      const [notifRes, msgRes] = await Promise.all([
        fetch(apiEndpoints.getNotificationCount, { credentials: "include" }),
        fetch(apiEndpoints.getUnreadCount, { credentials: "include" }),
      ]);
      const notifData = await notifRes.json();
      const msgData = await msgRes.json();
      if (notifData.success) setNotificationCount(notifData.count);
      if (msgData.success) setMessageCount(msgData.count);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const checkUserLoggedIn = async () => {
    try {
      const response = await fetch(apiEndpoints.validate, {
        credentials: "include",
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error checking user login status:", error);
      return false;
    }
  };

  const handleReportLostClick = async (e) => {
    e.preventDefault();
    const isLoggedIn = await checkUserLoggedIn();
    if (isLoggedIn) {
      navigate("/reportlost");
    } else {
      alert("You must be Logged In before making a Post");
      navigate("/login");
    }
  };

  const handleReportFoundClick = async (e) => {
    e.preventDefault();
    const isLoggedIn = await checkUserLoggedIn();
    if (isLoggedIn) {
      navigate("/reportfound");
    } else {
      alert("You must be Logged In before making a Post");
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(apiEndpoints.logout, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAdmin = (email, id) => {
    if (email === "Admin@gmail.com") navigate("/admin");
    else {
      navigate(`profile/${id}`);
    }
  };

  const navLinks = [
    { path: "/", label: "Home", onClick: null },
    { path: "/lost", label: "Lost", onClick: null },
    {
      path: "/reportlost",
      label: "Report Lost",
      onClick: handleReportLostClick,
    },
    { path: "/found", label: "Found", onClick: null },
    {
      path: "/reportfound",
      label: "Report Found",
      onClick: handleReportFoundClick,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
        isDark
          ? "bg-slate-900/80 border-white/10"
          : "bg-white/80 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={link.onClick}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : isDark
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="relative group ml-4">
                <button
                  onClick={() => handleAdmin(user.email, user.id)}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? "bg-white/10 border-white/20 hover:bg-white/20"
                      : "bg-gray-100 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span
                    className={`font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user.name}
                  </span>
                  <svg
                    className={`w-4 h-4 ${
                      isDark ? "text-white/60" : "text-gray-500"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`absolute top-full right-0 mt-2 w-56 backdrop-blur-xl rounded-xl border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 overflow-hidden ${
                    isDark
                      ? "bg-slate-800/95 border-white/10"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>👤</span>
                    {t("profile")}
                  </Link>
                  <Link
                    to="/messages"
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>💬</span>
                    {t("messages")}
                    {messageCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-purple-500 text-white text-xs rounded-full">
                        {messageCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/notifications"
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>🔔</span>
                    {t("notifications")}
                    {notificationCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/bookmarks"
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>🔖</span>
                    {t("bookmarks")}
                  </Link>
                  <Link
                    to="/dashboard"
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>📊</span>
                    {t("dashboard")}
                  </Link>
                  <Link
                    to="/settings"
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>⚙️</span>
                    {t("settings")}
                  </Link>
                  <div
                    className={`border-t my-1 ${
                      isDark ? "border-white/10" : "border-gray-200"
                    }`}
                  ></div>
                  <button
                    onClick={toggleTheme}
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>{isDark ? "☀️" : "🌙"}</span>
                    {isDark ? t("lightMode") : t("darkMode")}
                  </button>
                  <button
                    onClick={toggleLanguage}
                    className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-2 ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <span>🌐</span>
                    {language === "en" ? "বাংলা" : "English"}
                  </button>
                  <div
                    className={`border-t my-1 ${
                      isDark ? "border-white/10" : "border-gray-200"
                    }`}
                  ></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                  >
                    <span>🚪</span>
                    {t("logout")}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDark
                ? "text-white/70 hover:text-white hover:bg-white/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`lg:hidden py-4 border-t ${
              isDark ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    if (link.onClick) link.onClick(e);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : isDark
                      ? "text-white/70 hover:text-white hover:bg-white/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <button
                    onClick={() => {
                      handleAdmin(user.email, user.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`px-4 py-3 text-left rounded-xl transition-colors ${
                      isDark
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Profile ({user.name})
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold text-center"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
