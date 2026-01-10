import { useState } from "react";
import { useLanguage, useTheme } from "../App";

const Settings = ({ user }) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, isDark } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          theme,
          preferredLanguage: language,
          pushNotifications,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-100 via-purple-100 to-gray-100"
      }`}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className={`text-3xl font-bold mb-8 flex items-center gap-3 ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          <span className="text-3xl">⚙️</span>
          {t("settings")}
        </h1>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-white/10 border-white/20"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              <span>🎨</span> Appearance
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDark ? "text-white" : "text-gray-800"}>
                    Theme
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Choose your preferred color scheme
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      theme === "dark"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : isDark
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    🌙 Dark
                  </button>
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      theme === "light"
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : isDark
                        ? "bg-white/10 text-gray-300 hover:bg-white/20"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    ☀️ Light
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-white/10 border-white/20"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              <span>🌐</span> {t("language")}
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className={isDark ? "text-white" : "text-gray-800"}>
                  Display Language
                </p>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Select your preferred language
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    language === "en"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : isDark
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => setLanguage("bn")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    language === "bn"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : isDark
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  🇧🇩 বাংলা
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-white/10 border-white/20"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              <span>🔔</span> {t("notifications")}
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className={isDark ? "text-white" : "text-gray-800"}>
                    Push Notifications
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Receive notifications for matches and messages
                  </p>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`w-14 h-8 rounded-full transition-all relative ${
                    pushNotifications
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : isDark
                      ? "bg-white/20"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                      pushNotifications ? "right-1" : "left-1"
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div
            className={`backdrop-blur-xl rounded-2xl border p-6 ${
              isDark
                ? "bg-white/10 border-white/20"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-xl font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              <span>ℹ️</span> About
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Version
                </span>
                <span className={isDark ? "text-white" : "text-gray-800"}>
                  2.0.0
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Platform
                </span>
                <span className={isDark ? "text-white" : "text-gray-800"}>
                  CUET Lost & Found
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                  Contact
                </span>
                <span className="text-purple-400">support@cuetfinder.com</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {user && (
            <button
              onClick={handleSave}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <span>✓</span> Saved!
                </>
              ) : (
                <>
                  <span>💾</span> Save Preferences
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
