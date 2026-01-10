import { useState, useEffect } from "react";
import { apiEndpoints } from "../config/api";
import { useLanguage, useTheme } from "../App";

const Notifications = ({ user }) => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(apiEndpoints.getNotifications, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch(apiEndpoints.markNotificationsRead, {
        method: "PUT",
        credentials: "include",
      });
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return "💬";
      case "match":
        return "🔍";
      case "claim":
        return "📋";
      case "rating":
        return "⭐";
      case "bookmark_update":
        return "🔖";
      case "expiry_warning":
        return "⏰";
      default:
        return "🔔";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "message":
        return "from-blue-500 to-cyan-500";
      case "match":
        return "from-purple-500 to-pink-500";
      case "claim":
        return "from-yellow-500 to-orange-500";
      case "rating":
        return "from-yellow-400 to-amber-500";
      case "bookmark_update":
        return "from-green-500 to-emerald-500";
      case "expiry_warning":
        return "from-red-500 to-orange-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
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
          Please login to view notifications
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className={`text-3xl font-bold flex items-center gap-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            <span className="text-3xl">🔔</span>
            {t("notifications")}
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className={`px-4 py-2 rounded-lg transition-all ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-purple-100 hover:bg-purple-200 text-purple-700"
              }`}
            >
              {t("markAllRead")}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🔔</span>
            <p className="text-gray-400 text-xl">No notifications yet</p>
            <p className="text-gray-500 mt-2">
              You'll see updates here when something happens
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 transition-all hover:border-purple-500/50 ${
                  !notification.read ? "border-l-4 border-l-purple-500" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getNotificationColor(
                      notification.type
                    )} flex items-center justify-center text-2xl flex-shrink-0`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`font-semibold ${
                          notification.read ? "text-gray-300" : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      {notification.message}
                    </p>
                    {notification.relatedUser && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>From:</span>
                        <span className="text-purple-400">
                          {notification.relatedUser.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {!notification.read && (
                    <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
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

export default Notifications;
