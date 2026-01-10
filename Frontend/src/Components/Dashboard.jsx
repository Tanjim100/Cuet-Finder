import { useState, useEffect } from "react";
import { apiEndpoints } from "../config/api";
import { useLanguage, useTheme } from "../App";

const Dashboard = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(apiEndpoints.getStats);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    Electronics: "from-blue-500 to-cyan-500",
    Documents: "from-yellow-500 to-orange-500",
    Accessories: "from-purple-500 to-pink-500",
    Clothing: "from-pink-500 to-rose-500",
    Keys: "from-gray-500 to-slate-500",
    Cards: "from-green-500 to-emerald-500",
    Stationery: "from-orange-500 to-red-500",
    Sports: "from-red-500 to-pink-500",
    Other: "from-slate-500 to-gray-500",
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-8 flex items-center gap-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          <span className="text-3xl">📊</span>
          {t("dashboard")}
        </h1>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30"
                : "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
            }`}
          >
            <div className="text-4xl mb-2">📦</div>
            <div
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {stats?.totalLost || 0}
            </div>
            <div
              className={`text-sm ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}
            >
              {t("totalLost")}
            </div>
          </div>

          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30"
                : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            }`}
          >
            <div className="text-4xl mb-2">✅</div>
            <div
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {stats?.totalFound || 0}
            </div>
            <div
              className={`text-sm ${
                isDark ? "text-green-300" : "text-green-600"
              }`}
            >
              {t("totalFound")}
            </div>
          </div>

          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30"
                : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
            }`}
          >
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-3xl font-bold text-white">
              {stats?.totalResolved || 0}
            </div>
            <div className="text-purple-300 text-sm">{t("itemsRecovered")}</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
            <div className="text-4xl mb-2">📈</div>
            <div className="text-3xl font-bold text-white">
              {stats?.successRate || 0}%
            </div>
            <div className="text-yellow-300 text-sm">{t("successRate")}</div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-xl rounded-2xl border border-pink-500/30 p-6">
            <div className="text-4xl mb-2">👥</div>
            <div className="text-3xl font-bold text-white">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-pink-300 text-sm">{t("activeUsers")}</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📅</span> This Week's Activity
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-400">
                  {stats?.recentLost || 0}
                </div>
                <div className="text-gray-400 text-sm">Items Lost</div>
              </div>
              <div className="bg-green-500/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {stats?.recentFound || 0}
                </div>
                <div className="text-gray-400 text-sm">Items Found</div>
              </div>
            </div>
          </div>

          {/* Top Helpers */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>🏆</span> Top Helpers
            </h2>
            <div className="space-y-3">
              {stats?.topHelpers?.length > 0 ? (
                stats.topHelpers.map((helper, index) => (
                  <div
                    key={helper._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-amber-600"
                          : "bg-purple-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{helper.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>🔄 {helper.itemsReturned} returned</span>
                        <span>❤️ {helper.thanksReceived} thanks</span>
                      </div>
                    </div>
                    {helper.averageRating > 0 && (
                      <div className="flex items-center gap-1 text-yellow-400">
                        <span>⭐</span>
                        <span>{helper.averageRating}</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-4">No helpers yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📦</span> Lost Items by Category
            </h2>
            <div className="space-y-3">
              {stats?.lostByCategory?.map((cat) => (
                <div
                  key={cat._id || "Other"}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                      categoryColors[cat._id] || categoryColors.Other
                    } flex items-center justify-center text-white text-xl`}
                  >
                    {cat._id === "Electronics" && "📱"}
                    {cat._id === "Documents" && "📄"}
                    {cat._id === "Accessories" && "👜"}
                    {cat._id === "Clothing" && "👕"}
                    {cat._id === "Keys" && "🔑"}
                    {cat._id === "Cards" && "💳"}
                    {cat._id === "Stationery" && "✏️"}
                    {cat._id === "Sports" && "⚽"}
                    {(!cat._id || cat._id === "Other") && "📦"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-white mb-1">
                      <span>{cat._id || "Other"}</span>
                      <span>{cat.count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${
                          categoryColors[cat._id] || categoryColors.Other
                        }`}
                        style={{
                          width: `${
                            (cat.count / (stats?.totalLost || 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {!stats?.lostByCategory?.length && (
                <p className="text-gray-400 text-center py-4">No data yet</p>
              )}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>✅</span> Found Items by Category
            </h2>
            <div className="space-y-3">
              {stats?.foundByCategory?.map((cat) => (
                <div
                  key={cat._id || "Other"}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                      categoryColors[cat._id] || categoryColors.Other
                    } flex items-center justify-center text-white text-xl`}
                  >
                    {cat._id === "Electronics" && "📱"}
                    {cat._id === "Documents" && "📄"}
                    {cat._id === "Accessories" && "👜"}
                    {cat._id === "Clothing" && "👕"}
                    {cat._id === "Keys" && "🔑"}
                    {cat._id === "Cards" && "💳"}
                    {cat._id === "Stationery" && "✏️"}
                    {cat._id === "Sports" && "⚽"}
                    {(!cat._id || cat._id === "Other") && "📦"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-white mb-1">
                      <span>{cat._id || "Other"}</span>
                      <span>{cat.count}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${
                          categoryColors[cat._id] || categoryColors.Other
                        }`}
                        style={{
                          width: `${
                            (cat.count / (stats?.totalFound || 1)) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {!stats?.foundByCategory?.length && (
                <p className="text-gray-400 text-center py-4">No data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
