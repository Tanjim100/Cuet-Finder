import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiEndpoints } from "../config/api";
import { useTheme } from "../App";

const Found = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch found items
        const postsResponse = await fetch(apiEndpoints.getAllFoundPosts);
        const postsData = await postsResponse.json();
        if (postsData.success) {
          setPosts(postsData.posts);
        }

        // Fetch categories
        const categoriesResponse = await fetch(apiEndpoints.getCategories);
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          setCategories(categoriesData.categories);
        }

        // Fetch user bookmarks
        if (user) {
          const bookmarksResponse = await fetch(
            `${apiEndpoints.getBookmarks}?type=found`,
            {
              credentials: "include",
            }
          );
          const bookmarksData = await bookmarksResponse.json();
          if (bookmarksData.success) {
            setBookmarkedPosts(
              bookmarksData.bookmarks.map((b) => b.post?._id || b.post)
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.item?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;

    let matchesDate = true;
    if (dateRange.start || dateRange.end) {
      const postDate = new Date(post.date || post.createdAt);
      if (dateRange.start)
        matchesDate = matchesDate && postDate >= new Date(dateRange.start);
      if (dateRange.end)
        matchesDate = matchesDate && postDate <= new Date(dateRange.end);
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const handleCopyContact = (contact, postId) => {
    navigator.clipboard
      .writeText(contact)
      .then(() => {
        setCopiedPostId(postId);
        setTimeout(() => setCopiedPostId(null), 2000);
      })
      .catch((error) => {
        console.error("Failed to copy contact:", error);
      });
  };

  const handleBookmark = async (postId, e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const isBookmarked = bookmarkedPosts.includes(postId);

      await fetch(apiEndpoints.toggleBookmark, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId, postType: "found" }),
      });

      if (isBookmarked) {
        setBookmarkedPosts((prev) => prev.filter((id) => id !== postId));
      } else {
        setBookmarkedPosts((prev) => [...prev, postId]);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const getCategoryInfo = (categoryName) => {
    const category = categories.find((c) => c.name === categoryName);
    return category || { icon: "📦", color: "#6B7280" };
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
          className={`absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl ${
            isDark ? "opacity-20" : "opacity-10"
          } animate-pulse`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl ${
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
                ? "bg-emerald-500/20 border-emerald-500/30"
                : "bg-emerald-100 border-emerald-200"
            } px-4 py-2 rounded-full border mb-6`}
          >
            <svg
              className={`w-5 h-5 ${
                isDark ? "text-emerald-400" : "text-emerald-600"
              }`}
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
            <span className="text-emerald-300 text-sm font-medium">
              Items waiting for their owners
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Found{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Items
            </span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Browse through items found by the CUET community. Claim yours if you
            see it!
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-emerald-500 text-white"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === cat.name
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
              style={
                selectedCategory === cat.name
                  ? { backgroundColor: cat.color }
                  : {}
              }
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search found items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
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

          {/* Filter Toggle & Post Button */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-4 rounded-2xl font-medium transition-all duration-300 ${
                showFilters
                  ? "bg-emerald-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filters
            </button>
            <Link
              to="/reportfound"
              className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl text-white font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Post Found Item
            </Link>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="all" className="bg-slate-800">
                    All Status
                  </option>
                  <option value="active" className="bg-slate-800">
                    Active
                  </option>
                  <option value="claimed" className="bg-slate-800">
                    Claimed
                  </option>
                  <option value="resolved" className="bg-slate-800">
                    Resolved
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedStatus("active");
                  setDateRange({ start: "", end: "" });
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-white/60">
            Showing{" "}
            <span className="text-emerald-400 font-semibold">
              {filteredPosts.length}
            </span>{" "}
            items
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                onClick={() => navigate(`/found/${post._id}`)}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={`http://localhost:5001/${
                      post.photo || (post.photos && post.photos[0])
                    }`}
                    alt={post.item}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {post.category && (
                      <span
                        className="px-2 py-1 rounded-full text-white text-xs font-medium"
                        style={{
                          backgroundColor: getCategoryInfo(post.category).color,
                        }}
                      >
                        {getCategoryInfo(post.category).icon} {post.category}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-emerald-500/90 rounded-full text-white text-xs font-medium">
                      Found
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleBookmark(post._id, e)}
                    className="absolute top-3 left-3 p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
                  >
                    <svg
                      className={`w-5 h-5 ${
                        bookmarkedPosts.includes(post._id)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-white"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
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
                  {/* Finder */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white/50 text-xs">Found by</p>
                      <p className="text-white font-medium">{post.name}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-white/50 text-xs mb-1">Description</p>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {post.description}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-white/60">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm">{post.location}</span>
                  </div>

                  {/* Contact Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyContact(post.contact, post._id);
                    }}
                    className="relative w-full py-3 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500 hover:to-cyan-500 border border-emerald-500/30 hover:border-transparent rounded-xl text-white font-medium transition-all duration-300 group/btn"
                  >
                    <span className="flex items-center justify-center gap-2">
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {copiedPostId === post._id ? "Copied!" : post.contact}
                    </span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white/30"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Found Items Yet
              </h3>
              <p className="text-white/60">
                {selectedCategory !== "all" || searchQuery
                  ? "Try adjusting your filters or search"
                  : "Check back later or post if you found something"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Found;
