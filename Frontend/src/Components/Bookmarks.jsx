import { useState, useEffect } from "react";
import { apiEndpoints, API_BASE_URL } from "../config/api";
import { useLanguage, useTheme } from "../App";

const Bookmarks = ({ user }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [bookmarks, setBookmarks] = useState({ lost: [], found: [] });
  const [activeTab, setActiveTab] = useState("lost");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(apiEndpoints.getBookmarks, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (postId, postType) => {
    try {
      const res = await fetch(apiEndpoints.toggleBookmark, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, postType }),
      });
      const data = await res.json();
      if (data.success) {
        fetchBookmarks();
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
        }`}
      >
        <div className={`text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
          Please login to view bookmarks
        </div>
      </div>
    );
  }

  const currentItems = activeTab === "lost" ? bookmarks.lost : bookmarks.found;

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-6 flex items-center gap-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <span className="text-3xl">🔖</span>
          {t("bookmarks")}
        </h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("lost")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "lost"
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                : isDark
                ? "bg-white/10 text-gray-300 hover:bg-white/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📦 Lost Items ({bookmarks.lost?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "found"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                : isDark
                ? "bg-white/10 text-gray-300 hover:bg-white/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            ✅ Found Items ({bookmarks.found?.length || 0})
          </button>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : currentItems?.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔖</span>
            <p className="text-gray-400 text-xl">{t("noBookmarks")}</p>
            <p className="text-gray-500 mt-2">
              Start bookmarking items to track them!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((item) => (
              <div
                key={item._id}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden group hover:border-purple-500/50 transition-all"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      item.photo
                        ? `${API_BASE_URL}/${item.photo}`
                        : "/placeholder.png"
                    }
                    alt={item.item}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        activeTab === "lost"
                          ? "bg-red-500/80 text-white"
                          : "bg-green-500/80 text-white"
                      }`}
                    >
                      {item.category || "Other"}
                    </span>
                  </div>
                  <button
                    onClick={() => removeBookmark(item._id, activeTab)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-yellow-400 hover:bg-white/30 transition-all"
                  >
                    ⭐
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-white font-bold text-lg mb-2">
                    {item.item}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{formatDate(item.date || item.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <span>{item.contact}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {item.status && item.status !== "active" && (
                    <div
                      className={`mt-3 px-3 py-1 rounded-full text-sm font-medium inline-block ${
                        item.status === "resolved"
                          ? "bg-green-500/20 text-green-400"
                          : item.status === "claimed"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
