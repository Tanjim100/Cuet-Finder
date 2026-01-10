import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiEndpoints, API_BASE_URL } from "../config/api";
import { useLanguage, useTheme } from "../App";

const Lost = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLostItems();
    fetchCategories();
  }, []);

  const fetchLostItems = async () => {
    try {
      const response = await fetch(apiEndpoints.getAllLostPosts);
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching lost items:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(apiEndpoints.getCategories);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const toggleBookmark = async (postId, e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please login to bookmark items");
      return;
    }
    try {
      await fetch(apiEndpoints.toggleBookmark, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, postType: "lost" }),
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || post.category === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;

    let matchesDate = true;
    if (dateRange.from) {
      matchesDate = new Date(post.createdAt) >= new Date(dateRange.from);
    }
    if (dateRange.to && matchesDate) {
      matchesDate = new Date(post.createdAt) <= new Date(dateRange.to);
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const handleCopyContact = (contact, postId, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contact).then(() => {
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    });
  };

  const categoryIcons = {
    Electronics: "📱",
    Documents: "📄",
    Accessories: "👜",
    Clothing: "👕",
    Keys: "🔑",
    Cards: "💳",
    Stationery: "✏️",
    Sports: "⚽",
    Other: "📦",
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-12 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl ${
            isDark ? "opacity-20" : "opacity-10"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl ${
            isDark ? "opacity-20" : "opacity-10"
          } animate-pulse`}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 ${
              isDark
                ? "bg-red-500/20 border-red-500/30"
                : "bg-red-100 border-red-200"
            } px-4 py-2 rounded-full border mb-6`}
          >
            <span className="text-red-400">⚠️</span>
            <span
              className={`${
                isDark ? "text-red-300" : "text-red-600"
              } text-sm font-medium`}
            >
              Help find these items
            </span>
          </div>
          <h1
            className={`text-4xl lg:text-5xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("lost")}{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Items
            </span>
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              isDark ? "text-white/60" : "text-gray-600"
            }`}
          >
            Browse through items reported lost by the CUET community.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder={`${t("search")} lost items...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                🔍
              </span>
            </div>

            <div className="flex gap-3">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-5 py-4 rounded-2xl font-medium transition-all flex items-center gap-2 ${
                  showFilters
                    ? "bg-purple-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <span>🎛️</span>
                {t("filter")}
              </button>

              {/* Report Button */}
              <Link
                to="/reportlost"
                className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all duration-300"
              >
                <span>➕</span>
                Report Lost
              </Link>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === "All"
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {t("all")}
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <span>{categoryIcons[cat.name] || "📦"}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 mb-2 text-sm">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="claimed">Claimed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 mb-2 text-sm">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/60 mb-2 text-sm">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-white/60">
          Showing {filteredPosts.length} of {posts.length} items
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/lost/${post._id}`)}
                  className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${API_BASE_URL}/${post.photo}`}
                      alt={post.item}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 bg-red-500/90 rounded-full text-white text-xs font-medium">
                        Lost
                      </span>
                      {post.category && (
                        <span className="px-3 py-1 bg-purple-500/80 rounded-full text-white text-xs font-medium flex items-center gap-1">
                          {categoryIcons[post.category]} {post.category}
                        </span>
                      )}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleBookmark(post._id, e)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                      🔖
                    </button>

                    {/* Status Badge */}
                    {post.status && post.status !== "active" && (
                      <div className="absolute bottom-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            post.status === "resolved"
                              ? "bg-green-500 text-white"
                              : post.status === "claimed"
                              ? "bg-yellow-500 text-black"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {post.status.toUpperCase()}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3">
                      <h3 className="text-white font-bold text-lg">
                        {post.item}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {new Date(
                          post.date || post.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-4">
                    {/* Owner */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white/50 text-xs">Reported by</p>
                        <p className="text-white font-medium">{post.name}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm line-clamp-2">
                      {post.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span>📍</span>
                      <span className="truncate">{post.location}</span>
                    </div>

                    {/* Contact Button */}
                    <button
                      onClick={(e) =>
                        handleCopyContact(post.contact, post._id, e)
                      }
                      className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        copiedPostId === post._id
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/10"
                      }`}
                    >
                      {copiedPostId === post._id ? (
                        <>
                          <span>✓</span> Copied!
                        </>
                      ) : (
                        <>
                          <span>📞</span> {post.contact}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <span className="text-6xl mb-4 block">🔍</span>
                <p className="text-white/60 text-xl">{t("noResults")}</p>
                <p className="text-white/40 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lost;
