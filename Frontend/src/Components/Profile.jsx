import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoints, API_BASE_URL } from "../config/api";
import { useTheme } from "../App";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [lostPosts, setLostPosts] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editPost, setEditPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("lost");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(apiEndpoints.getProfile(id));
        if (response.data.success) {
          setUser(response.data.user);
          setLostPosts(response.data.lostPosts);
          setFoundPosts(response.data.foundPosts);
        } else {
          console.error("Failed to fetch profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleProfilePictureUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        apiEndpoints.updateProfilePicture(id),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        setUser({ ...user, profilePicture: response.data.profilePicture });
        alert("Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  const filteredLostPosts = lostPosts.filter((post) =>
    post.item.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFoundPosts = foundPosts.filter((post) =>
    post.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeletePost = async (postId, type) => {
    try {
      const endpoint =
        type === "lost"
          ? apiEndpoints.deleteLostPost(postId)
          : apiEndpoints.deleteFoundPost(postId);
      await axios.delete(endpoint);

      if (type === "lost") {
        setLostPosts(lostPosts.filter((post) => post._id !== postId));
      } else {
        setFoundPosts(foundPosts.filter((post) => post._id !== postId));
      }
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const endpoint = editPost.item
        ? apiEndpoints.updateLostPost(editPost._id)
        : apiEndpoints.updateFoundPost(editPost._id);
      const response = await axios.put(endpoint, editPost);

      if (response.data.success) {
        if (editPost.item) {
          setLostPosts(
            lostPosts.map((post) =>
              post._id === editPost._id ? response.data.post : post
            )
          );
        } else {
          setFoundPosts(
            foundPosts.map((post) =>
              post._id === editPost._id ? response.data.post : post
            )
          );
        }
        setIsEditing(false);
        setEditPost(null);
        alert("Post updated successfully!");
      }
    } catch (error) {
      console.error("Error updating post:", error);
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
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={isDark ? "text-white/60" : "text-gray-600"}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark
            ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isDark ? "bg-white/10" : "bg-gray-100"
            }`}
          >
            <svg
              className={`w-12 h-12 ${
                isDark ? "text-white/30" : "text-gray-400"
              }`}
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
          </div>
          <h3
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            User Not Found
          </h3>
          <p className={isDark ? "text-white/60" : "text-gray-600"}>
            The profile you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

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
          className={`absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
            isDark ? "opacity-20" : "opacity-10"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
            isDark ? "opacity-20" : "opacity-10"
          }`}
        ></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Profile Card */}
        <div
          className={`backdrop-blur-xl rounded-3xl border p-8 mb-8 ${
            isDark
              ? "bg-white/10 border-white/20"
              : "bg-white border-gray-200 shadow-xl"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Picture */}
            <label
              htmlFor="profile-picture"
              className="cursor-pointer group relative"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-purple-500 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all">
                <img
                  src={
                    user.profilePicture
                      ? `http://localhost:5001/${user.profilePicture}`
                      : "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                type="file"
                id="profile-picture"
                className="hidden"
                onChange={handleProfilePictureUpdate}
                accept="image/*"
              />
            </label>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h1
                className={`text-3xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {user.name}
              </h1>
              <div
                className={`flex flex-wrap justify-center md:justify-start gap-4 ${
                  isDark ? "text-white/60" : "text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
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
                  <span>{user.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
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
                  </svg>
                  <span>{user.address}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6">
              <div
                className={`text-center p-4 rounded-2xl border ${
                  isDark
                    ? "bg-red-500/20 border-red-500/30"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="text-3xl font-bold text-red-400">
                  {lostPosts.length}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Lost Posts
                </div>
              </div>
              <div
                className={`text-center p-4 rounded-2xl border ${
                  isDark
                    ? "bg-emerald-500/20 border-emerald-500/30"
                    : "bg-emerald-50 border-emerald-200"
                }`}
              >
                <div className="text-3xl font-bold text-emerald-400">
                  {foundPosts.length}
                </div>
                <div
                  className={`text-sm ${
                    isDark ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Found Posts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search your posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-5 py-4 pl-12 backdrop-blur-xl border rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all ${
              isDark
                ? "bg-white/10 border-white/20 text-white placeholder-white/50"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
            }`}
          />
          <svg
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? "text-white/50" : "text-gray-400"
            }`}
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

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("lost")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "lost"
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30"
                : isDark
                ? "bg-white/10 text-white/70 hover:bg-white/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Lost Posts ({filteredLostPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("found")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "found"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30"
                : isDark
                ? "bg-white/10 text-white/70 hover:bg-white/20"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Found Posts ({filteredFoundPosts.length})
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "lost" ? filteredLostPosts : filteredFoundPosts)
            .length > 0 ? (
            (activeTab === "lost" ? filteredLostPosts : filteredFoundPosts).map(
              (post) => (
                <div
                  key={post._id}
                  className={`backdrop-blur-xl rounded-3xl border overflow-hidden group hover:border-purple-500/50 transition-all duration-500 ${
                    isDark
                      ? "bg-white/10 border-white/10"
                      : "bg-white border-gray-200 shadow-lg"
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`http://localhost:5001/${post.photo}`}
                      alt={post.item}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                    <div
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-white text-xs font-medium ${
                        activeTab === "lost"
                          ? "bg-red-500/90"
                          : "bg-emerald-500/90"
                      }`}
                    >
                      {activeTab === "lost" ? "Lost" : "Found"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 space-y-3">
                    <h3
                      className={`text-xl font-bold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {post.item}
                    </h3>
                    <p
                      className={`text-sm line-clamp-2 ${
                        isDark ? "text-white/60" : "text-gray-600"
                      }`}
                    >
                      {post.description}
                    </p>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDark ? "text-white/50" : "text-gray-500"
                      }`}
                    >
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
                      </svg>
                      {post.location}
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        isDark ? "text-white/50" : "text-gray-500"
                      }`}
                    >
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(post.date).toLocaleDateString()}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="flex-1 py-2 bg-purple-500/20 hover:bg-purple-500 border border-purple-500/30 hover:border-transparent rounded-xl text-purple-400 hover:text-white font-medium transition-all duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id, activeTab)}
                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500 border border-red-500/30 hover:border-transparent rounded-xl text-red-400 hover:text-white font-medium transition-all duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="col-span-full text-center py-16">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? "bg-white/10" : "bg-gray-100"
                }`}
              >
                <svg
                  className={`w-10 h-10 ${
                    isDark ? "text-white/30" : "text-gray-400"
                  }`}
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
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                No {activeTab} posts yet
              </h3>
              <p className={isDark ? "text-white/60" : "text-gray-600"}>
                Your {activeTab} posts will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`backdrop-blur-xl rounded-3xl border p-8 w-full max-w-lg ${
              isDark
                ? "bg-slate-800/95 border-white/20"
                : "bg-white border-gray-200"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Edit Post
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-white/70" : "text-gray-700"
                  }`}
                >
                  Item Name
                </label>
                <input
                  type="text"
                  value={editPost.item}
                  onChange={(e) =>
                    setEditPost({ ...editPost, item: e.target.value })
                  }
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-white/70" : "text-gray-700"
                  }`}
                >
                  Description
                </label>
                <textarea
                  value={editPost.description}
                  onChange={(e) =>
                    setEditPost({ ...editPost, description: e.target.value })
                  }
                  rows="4"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none ${
                    isDark
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-gray-50 border-gray-200 text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className={`flex-1 py-3 border rounded-xl font-medium transition-all ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                    : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
