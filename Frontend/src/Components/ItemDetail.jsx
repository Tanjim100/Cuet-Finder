import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiEndpoints, API_BASE_URL } from "../config/api";
import { useLanguage, useTheme } from "../App";

const ItemDetail = ({ user, type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [claimForm, setClaimForm] = useState({ proofDescription: "" });
  const [ratingForm, setRatingForm] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchItem();
    if (user) {
      checkBookmark();
      fetchMatches();
      fetchClaims();
    }
  }, [id, user]);

  const fetchItem = async () => {
    try {
      const endpoint =
        type === "lost"
          ? apiEndpoints.getAllLostPosts
          : apiEndpoints.getAllFoundPosts;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        const foundItem = data.posts.find((p) => p._id === id);
        setItem(foundItem);
      }
    } catch (error) {
      console.error("Error fetching item:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const endpoint =
        type === "lost"
          ? apiEndpoints.getMatchesForLost(id)
          : apiEndpoints.getMatchesForFound(id);
      const res = await fetch(endpoint, { credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await fetch(apiEndpoints.getClaimsForPost(id), {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setClaims(data.claims);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    }
  };

  const checkBookmark = async () => {
    try {
      const res = await fetch(apiEndpoints.checkBookmark(id), {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark:", error);
    }
  };

  const toggleBookmark = async () => {
    try {
      const res = await fetch(apiEndpoints.toggleBookmark, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: id, postType: type }),
      });
      const data = await res.json();
      if (data.success) {
        setIsBookmarked(data.bookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const submitClaim = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("postId", id);
      formData.append("postType", type);
      formData.append("proofDescription", claimForm.proofDescription);

      const res = await fetch(apiEndpoints.submitClaim, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setShowClaimModal(false);
        setClaimForm({ proofDescription: "" });
        fetchClaims();
        alert("Claim submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(apiEndpoints.submitRating, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          toUserId: item.user,
          rating: ratingForm.rating,
          comment: ratingForm.comment,
          postId: id,
          postType: type,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowRatingModal(false);
        alert("Rating submitted!");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const sendThanks = async () => {
    try {
      const res = await fetch(apiEndpoints.sendThanks(item.user), {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        alert("Thanks sent! 🎉");
      }
    } catch (error) {
      console.error("Error sending thanks:", error);
    }
  };

  const startConversation = async () => {
    try {
      const res = await fetch(apiEndpoints.createConversation, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          participantId: item.user,
          postId: id,
          postType: type,
        }),
      });
      const data = await res.json();
      if (data.success) {
        navigate("/messages");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const updateClaimStatus = async (claimId, status) => {
    try {
      const res = await fetch(apiEndpoints.updateClaim(claimId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchClaims();
        fetchItem();
      }
    } catch (error) {
      console.error("Error updating claim:", error);
    }
  };

  const { isDark } = useTheme();

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

  if (!item) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
        }`}
      >
        <div className={`text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
          Item not found
        </div>
      </div>
    );
  }

  const isOwner = user && item.user === user.id;

  return (
    <div
      className={`min-h-screen py-8 px-4 pt-24 ${
        isDark
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`mb-6 flex items-center gap-2 transition-all ${
            isDark
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>←</span> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div
              className={`backdrop-blur-xl rounded-2xl border overflow-hidden ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <div className="relative">
                <img
                  src={
                    item.photo
                      ? `${API_BASE_URL}/${item.photo}`
                      : "/placeholder.png"
                  }
                  alt={item.item}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      type === "lost"
                        ? "bg-red-500/80 text-white"
                        : "bg-green-500/80 text-white"
                    }`}
                  >
                    {type === "lost" ? "📦 Lost" : "✅ Found"}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-purple-500/80 text-white">
                    {item.category || "Other"}
                  </span>
                </div>
                {user && (
                  <button
                    onClick={toggleBookmark}
                    className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${
                      isBookmarked
                        ? "bg-yellow-500 text-white"
                        : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                    }`}
                  >
                    {isBookmarked ? "⭐" : "☆"}
                  </button>
                )}
                {item.status !== "active" && (
                  <div className="absolute bottom-4 left-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        item.status === "resolved"
                          ? "bg-green-500 text-white"
                          : item.status === "claimed"
                          ? "bg-yellow-500 text-black"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {item.status?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {["details", "matches", "claims"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      : isDark
                      ? "bg-white/10 text-gray-300 hover:bg-white/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab === "details" && "📋 Details"}
                  {tab === "matches" && `🔍 Matches (${matches.length})`}
                  {tab === "claims" && `📝 Claims (${claims.length})`}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div
              className={`backdrop-blur-xl rounded-2xl border p-6 ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              {activeTab === "details" && (
                <div className="space-y-6">
                  <h1
                    className={`text-3xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {item.item}
                  </h1>
                  <p
                    className={`text-lg ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`rounded-xl p-4 ${
                        isDark ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        📍 Location
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.location}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl p-4 ${
                        isDark ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        📅 Date
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.date}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl p-4 ${
                        isDark ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        👤 Posted by
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.name}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl p-4 ${
                        isDark ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        📞 Contact
                      </p>
                      <p
                        className={`font-medium ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {item.contact}
                      </p>
                    </div>
                  </div>

                  {item.expiresAt && (
                    <div className="bg-yellow-500/20 rounded-xl p-4 flex items-center gap-3">
                      <span className="text-2xl">⏰</span>
                      <div>
                        <p className="text-yellow-400 font-medium">
                          Expires on
                        </p>
                        <p className="text-white">
                          {new Date(item.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "matches" && (
                <div>
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    🔍 Potential Matches
                  </h2>
                  {matches.length === 0 ? (
                    <p
                      className={`text-center py-10 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No matches found yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <div
                          key={match._id}
                          className={`rounded-xl p-4 flex gap-4 ${
                            isDark ? "bg-white/5" : "bg-gray-50"
                          }`}
                        >
                          <img
                            src={
                              match.photo
                                ? `${API_BASE_URL}/${match.photo}`
                                : "/placeholder.png"
                            }
                            alt={match.item}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3
                                className={`font-medium ${
                                  isDark ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {match.item}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-bold ${
                                  match.matchScore >= 70
                                    ? "bg-green-500/20 text-green-400"
                                    : match.matchScore >= 40
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-gray-500/20 text-gray-400"
                                }`}
                              >
                                {match.matchScore}% Match
                              </span>
                            </div>
                            <p
                              className={`text-sm mt-1 line-clamp-2 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              {match.description}
                            </p>
                            <p
                              className={`text-sm mt-2 ${
                                isDark ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              📍 {match.location}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "claims" && (
                <div>
                  <h2
                    className={`text-xl font-bold mb-4 ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    📝 Claims
                  </h2>
                  {claims.length === 0 ? (
                    <p
                      className={`text-center py-10 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No claims yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {claims.map((claim) => (
                        <div
                          key={claim._id}
                          className={`rounded-xl p-4 ${
                            isDark ? "bg-white/5" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                {claim.claimant?.name?.charAt(0)}
                              </div>
                              <div>
                                <p
                                  className={`font-medium ${
                                    isDark ? "text-white" : "text-gray-900"
                                  }`}
                                >
                                  {claim.claimant?.name}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                >
                                  {claim.claimant?.email}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                claim.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : claim.status === "approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : claim.status === "rejected"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {claim.status}
                            </span>
                          </div>
                          <p
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {claim.proofDescription}
                          </p>

                          {isOwner && claim.status === "pending" && (
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() =>
                                  updateClaimStatus(claim._id, "approved")
                                }
                                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-all"
                              >
                                ✓ Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateClaimStatus(claim._id, "rejected")
                                }
                                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                              >
                                ✗ Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {user && !isOwner && (
              <div
                className={`backdrop-blur-xl rounded-2xl border p-6 space-y-4 ${
                  isDark
                    ? "bg-white/10 border-white/20"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                <h3
                  className={`font-semibold mb-4 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Actions
                </h3>

                <button
                  onClick={startConversation}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>💬</span> Message Owner
                </button>

                {item.status === "active" && (
                  <button
                    onClick={() => setShowClaimModal(true)}
                    className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                      isDark
                        ? "bg-white/10 text-white hover:bg-white/20"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    <span>📋</span> Submit Claim
                  </button>
                )}

                <button
                  onClick={sendThanks}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <span>❤️</span> Send Thanks
                </button>

                <button
                  onClick={() => setShowRatingModal(true)}
                  className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  <span>⭐</span> Rate User
                </button>
              </div>
            )}

            {/* Stats */}
            <div
              className={`backdrop-blur-xl rounded-2xl border p-6 ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <h3
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Views
                  </span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    {item.views || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Bookmarks
                  </span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    {item.bookmarkCount || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Claims
                  </span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    {claims.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Matches
                  </span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>
                    {matches.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Share */}
            <div
              className={`backdrop-blur-xl rounded-2xl border p-6 ${
                isDark
                  ? "bg-white/10 border-white/20"
                  : "bg-white border-gray-200 shadow-lg"
              }`}
            >
              <h3
                className={`font-semibold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Share
              </h3>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-all">
                  WhatsApp
                </button>
                <button className="flex-1 py-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all">
                  Facebook
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(window.location.href)
                  }
                  className="flex-1 py-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-md ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Submit Claim
            </h2>
            <form onSubmit={submitClaim} className="space-y-4">
              <div>
                <label
                  className={`block mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Proof of Ownership
                </label>
                <textarea
                  value={claimForm.proofDescription}
                  onChange={(e) =>
                    setClaimForm({
                      ...claimForm,
                      proofDescription: e.target.value,
                    })
                  }
                  placeholder="Describe how you can prove this item is yours..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 h-32 ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                  required
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowClaimModal(false)}
                  className={`flex-1 py-3 rounded-xl transition-all ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl p-6 w-full max-w-md ${
              isDark ? "bg-slate-800" : "bg-white"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Rate User
            </h2>
            <form onSubmit={submitRating} className="space-y-4">
              <div>
                <label
                  className={`block mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRatingForm({ ...ratingForm, rating: star })
                      }
                      className={`text-3xl ${
                        star <= ratingForm.rating
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className={`block mb-2 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Comment (optional)
                </label>
                <textarea
                  value={ratingForm.comment}
                  onChange={(e) =>
                    setRatingForm({ ...ratingForm, comment: e.target.value })
                  }
                  placeholder="Leave a comment..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:border-purple-500 h-24 ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white placeholder-gray-400"
                      : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                  }`}
                ></textarea>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className={`flex-1 py-3 rounded-xl transition-all ${
                    isDark
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
