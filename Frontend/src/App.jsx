import { useEffect, useState, createContext, useContext } from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home";
import Lost from "./Components/Lost";
import Found from "./Components/Found";
import ReportLost from "./Components/ReportLost";
import ReportFound from "./Components/ReportFound";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import Admin from "./Components/Admin";
import Profile from "./Components/Profile";
import Messages from "./Components/Messages";
import Dashboard from "./Components/Dashboard";
import Bookmarks from "./Components/Bookmarks";
import Notifications from "./Components/Notifications";
import Settings from "./Components/Settings";
import ItemDetail from "./Components/ItemDetail";
import AdminAnalytics from "./Components/AdminAnalytics";
import { apiEndpoints } from "./config/api";

// Inline Theme Context
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

// Inline Language Context
const translations = {
  en: {
    home: "Home",
    lost: "Lost Items",
    found: "Found Items",
    reportLost: "Report Lost",
    reportFound: "Report Found",
    login: "Login",
    signup: "Sign Up",
    logout: "Logout",
    profile: "Profile",
    messages: "Messages",
    notifications: "Notifications",
    bookmarks: "Bookmarks",
    dashboard: "Dashboard",
    settings: "Settings",
    search: "Search",
    all: "All",
    electronics: "Electronics",
    documents: "Documents",
    accessories: "Accessories",
    clothing: "Clothing",
    keys: "Keys",
    cards: "Cards",
    stationery: "Stationery",
    sports: "Sports",
    other: "Other",
  },
  bn: {
    home: "হোম",
    lost: "হারানো জিনিস",
    found: "পাওয়া জিনিস",
    reportLost: "হারানো রিপোর্ট",
    reportFound: "পাওয়া রিপোর্ট",
    login: "লগইন",
    signup: "সাইন আপ",
    logout: "লগআউট",
    profile: "প্রোফাইল",
    messages: "বার্তা",
    notifications: "বিজ্ঞপ্তি",
    bookmarks: "বুকমার্ক",
    dashboard: "ড্যাশবোর্ড",
    settings: "সেটিংস",
    search: "অনুসন্ধান",
    all: "সব",
    electronics: "ইলেকট্রনিক্স",
    documents: "ডকুমেন্টস",
    accessories: "আনুষাঙ্গিক",
    clothing: "পোশাক",
    keys: "চাবি",
    cards: "কার্ড",
    stationery: "স্টেশনারি",
    sports: "খেলাধুলা",
    other: "অন্যান্য",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang) setLanguage(savedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || key;
  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// Inner component that uses contexts
function AppContent() {
  const [user, setUser] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(apiEndpoints.validate, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-100 via-purple-100 to-gray-100"
      }`}
    >
      <Navbar user={user} setUser={setUser} />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lost" element={<Lost user={user} />} />
          <Route path="/found" element={<Found user={user} />} />
          <Route
            path="/lost/:id"
            element={<ItemDetail user={user} type="lost" />}
          />
          <Route
            path="/found/:id"
            element={<ItemDetail user={user} type="found" />}
          />
          <Route path="/reportlost" element={<ReportLost />} />
          <Route path="/reportfound" element={<ReportFound />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/messages" element={<Messages user={user} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookmarks" element={<Bookmarks user={user} />} />
          <Route
            path="/notifications"
            element={<Notifications user={user} />}
          />
          <Route path="/settings" element={<Settings user={user} />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

// Main App component that sets up providers
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
