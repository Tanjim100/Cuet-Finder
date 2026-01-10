import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../config/api";
import { useTheme } from "../App";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [activeTab, setActiveTab] = useState("overview");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Check if user is admin
    if (!user || user.email !== "admin@cuet.ac.bd") {
      navigate("/");
      return;
    }
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${apiEndpoints.getStats}?range=${timeRange}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const { isDark } = useTheme();

  const StatCard = ({ title, value, change, icon, color }) => (
    <div
      className={`backdrop-blur-xl rounded-2xl border p-6 hover:border-purple-500/50 transition-all ${
        isDark
          ? "bg-white/10 border-white/20"
          : "bg-white border-gray-200 shadow-lg"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-sm mb-1 ${
              isDark ? "text-white/60" : "text-gray-500"
            }`}
          >
            {title}
          </p>
          <h3
            className={`text-3xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </h3>
          {change !== undefined && (
            <p
              className={`text-sm mt-2 ${
                change >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% from last{" "}
              {timeRange}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  const BarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    return (
      <div
        className={`backdrop-blur-xl rounded-2xl border p-6 ${
          isDark
            ? "bg-white/10 border-white/20"
            : "bg-white border-gray-200 shadow-lg"
        }`}
      >
        <h3
          className={`font-semibold mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span
                className={`text-sm w-24 truncate ${
                  isDark ? "text-white/60" : "text-gray-500"
                }`}
              >
                {item.label}
              </span>
              <div
                className={`flex-1 h-8 rounded-lg overflow-hidden ${
                  isDark ? "bg-white/5" : "bg-gray-100"
                }`}
              >
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-500"
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
              <span
                className={`font-semibold w-12 text-right ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DonutChart = ({ data, title }) => {
    const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
    let currentAngle = 0;
    const colors = [
      "#8B5CF6",
      "#EC4899",
      "#10B981",
      "#F59E0B",
      "#3B82F6",
      "#EF4444",
    ];

    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <h3 className="text-white font-semibold mb-6">{title}</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const rotation = currentAngle;
                currentAngle += percentage;
                return (
                  <circle
                    key={index}
                    cx="18"
                    cy="18"
                    r="15.9155"
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset="25"
                    transform={`rotate(${rotation * 3.6} 18 18)`}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-xl">{total}</span>
            </div>
          </div>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-white/70 text-sm">{item.label}</span>
                <span className="text-white font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const ActivityTimeline = ({ activities }) => (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
      <h3 className="text-white font-semibold mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                activity.type === "lost"
                  ? "bg-red-500/20 text-red-400"
                  : activity.type === "found"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : activity.type === "claim"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-purple-500/20 text-purple-400"
              }`}
            >
              {activity.type === "lost" && (
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
              {activity.type === "found" && (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {activity.type === "claim" && (
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              )}
              {activity.type === "user" && (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-white/40 text-xs mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Mock data if stats not loaded
  const mockStats = stats || {
    totalUsers: 156,
    totalLostItems: 89,
    totalFoundItems: 67,
    resolvedItems: 45,
    activeMatches: 12,
    pendingClaims: 8,
    categoryBreakdown: [
      { label: "Electronics", value: 35 },
      { label: "Documents", value: 28 },
      { label: "Accessories", value: 22 },
      { label: "Clothing", value: 15 },
      { label: "Others", value: 10 },
    ],
    statusBreakdown: [
      { label: "Active", value: 56 },
      { label: "Claimed", value: 23 },
      { label: "Resolved", value: 45 },
      { label: "Expired", value: 12 },
    ],
    weeklyActivity: [
      { label: "Mon", value: 12 },
      { label: "Tue", value: 19 },
      { label: "Wed", value: 15 },
      { label: "Thu", value: 22 },
      { label: "Fri", value: 28 },
      { label: "Sat", value: 14 },
      { label: "Sun", value: 9 },
    ],
    recentActivities: [
      {
        type: "lost",
        message: "New lost item reported: MacBook Pro",
        time: "2 minutes ago",
      },
      {
        type: "found",
        message: "Found item posted: Student ID Card",
        time: "15 minutes ago",
      },
      {
        type: "claim",
        message: "Claim submitted for: Blue Backpack",
        time: "32 minutes ago",
      },
      {
        type: "user",
        message: "New user registered: ahmed@cuet.ac.bd",
        time: "1 hour ago",
      },
      {
        type: "found",
        message: "Item resolved: Calculator",
        time: "2 hours ago",
      },
    ],
    topHelpers: [
      { name: "Ahmed Khan", items: 8 },
      { name: "Fatima Rahman", items: 6 },
      { name: "Karim Hassan", items: 5 },
      { name: "Nadia Begum", items: 4 },
      { name: "Rafiq Islam", items: 3 },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Admin{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Analytics
              </span>
            </h1>
            <p className="text-white/60">
              Monitor platform activity and performance
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex bg-white/10 rounded-xl p-1">
            {["day", "week", "month", "year"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? "bg-purple-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["overview", "items", "users", "activity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-white/20 text-white border border-white/20"
                  : "text-white/60 hover:bg-white/10"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Users"
                value={mockStats.totalUsers}
                change={12}
                color="bg-purple-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Lost Items"
                value={mockStats.totalLostItems}
                change={-5}
                color="bg-red-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-red-400"
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
                }
              />
              <StatCard
                title="Found Items"
                value={mockStats.totalFoundItems}
                change={8}
                color="bg-emerald-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-emerald-400"
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
                }
              />
              <StatCard
                title="Resolved"
                value={mockStats.resolvedItems}
                change={15}
                color="bg-blue-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-blue-400"
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
                }
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BarChart
                data={mockStats.weeklyActivity}
                title="Activity This Week"
              />
              <DonutChart
                data={mockStats.categoryBreakdown}
                title="Items by Category"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DonutChart
                data={mockStats.statusBreakdown}
                title="Items by Status"
              />
              <ActivityTimeline activities={mockStats.recentActivities} />
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === "items" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="Active Matches"
                value={mockStats.activeMatches}
                color="bg-yellow-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Pending Claims"
                value={mockStats.pendingClaims}
                color="bg-orange-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                }
              />
              <StatCard
                title="Resolution Rate"
                value={`${Math.round(
                  (mockStats.resolvedItems /
                    (mockStats.totalLostItems + mockStats.totalFoundItems)) *
                    100
                )}%`}
                color="bg-cyan-500/20"
                icon={
                  <svg
                    className="w-6 h-6 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />
            </div>

            <BarChart
              data={mockStats.categoryBreakdown}
              title="Items by Category"
            />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <h3 className="text-white font-semibold mb-6">Top Helpers</h3>
              <div className="space-y-4">
                {mockStats.topHelpers.map((helper, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-amber-600"
                          : "bg-white/10"
                      } text-white font-bold text-sm`}
                    >
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {helper.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{helper.name}</p>
                      <p className="text-white/50 text-sm">
                        {helper.items} items returned
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">{helper.items * 10}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === "activity" && (
          <div className="space-y-6">
            <ActivityTimeline
              activities={[
                ...mockStats.recentActivities,
                {
                  type: "lost",
                  message: "Lost item expired: Umbrella",
                  time: "3 hours ago",
                },
                {
                  type: "user",
                  message: "User profile updated: karim@cuet.ac.bd",
                  time: "4 hours ago",
                },
                {
                  type: "found",
                  message: "New found item: Wallet with student ID",
                  time: "5 hours ago",
                },
                {
                  type: "claim",
                  message: "Claim approved for: Headphones",
                  time: "6 hours ago",
                },
                {
                  type: "user",
                  message: "New user registered: sarah@cuet.ac.bd",
                  time: "8 hours ago",
                },
              ]}
            />
          </div>
        )}

        {/* Export Section */}
        <div className="mt-8 flex justify-end gap-3">
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all flex items-center gap-2">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center gap-2">
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
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
