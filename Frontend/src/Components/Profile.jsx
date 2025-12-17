import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoints, API_BASE_URL } from '../config/api';

function Profile() {
  const { id } = useParams(); // Get the user ID from the URL
  const [user, setUser] = useState(null);
  const [lostPosts, setLostPosts] = useState([]);
  const [foundPosts, setFoundPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // For search functionality
  const [editPost, setEditPost] = useState(null); // For editing a post
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode

  // Fetch user profile and posts
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

  // Handle profile picture update
  const handleProfilePictureUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post(
        apiEndpoints.updateProfilePicture(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUser({ ...user, profilePicture: response.data.profilePicture });
        alert("Profile picture updated successfully!");
      } else {
        console.error("Failed to update profile picture:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  // Handle search functionality
  const filteredLostPosts = lostPosts.filter((post) =>
    post.item.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFoundPosts = foundPosts.filter((post) =>
    post.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle post deletion
  const handleDeletePost = async (postId, type) => {
    try {
      const endpoint = type === "lost" ? apiEndpoints.deleteLostPost(postId) : apiEndpoints.deleteFoundPost(postId);
      await axios.delete(endpoint);

      // Update state to remove the deleted post
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

  // Handle post editing
  const handleEditPost = (post) => {
    setEditPost(post);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const endpoint = editPost.item ? apiEndpoints.updateLostPost(editPost._id) : apiEndpoints.updateFoundPost(editPost._id);
      const response = await axios.put(
        endpoint,
        editPost
      );

      if (response.data.success) {
        // Update the posts in the state
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

  if (loading) {
    return <div className="text-center text-lg font-semibold py-20">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-lg font-semibold py-20">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Profile Section */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Profile Picture */}
          <label htmlFor="profile-picture" className="cursor-pointer">
            <img
              src={
                user.profilePicture
                  ? `http://localhost:5001/${user.profilePicture}`
                  : "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#088178]"
            />
            <input
              type="file"
              id="profile-picture"
              className="hidden"
              onChange={handleProfilePictureUpdate}
            />
          </label>

          {/* User Details */}
          <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.mobile}</p>
          <p className="text-gray-600">{user.address}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mt-8">
        <input
          type="text"
          placeholder="Search your posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>

      {/* Lost Posts Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Lost Posts</h2>
        {filteredLostPosts.length > 0 ? (
          filteredLostPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-6 mb-6"
            >
              <img
                src={`http://localhost:5001/${post.photo}`}
                alt={post.item}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mt-4">{post.item}</h3>
              <p className="text-gray-600">{post.description}</p>
              <p className="text-gray-600">{post.location}</p>
              <p className="text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-600">{post.contact}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEditPost(post)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post._id, "lost")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No lost posts found.</p>
        )}
      </div>

      {/* Found Posts Section */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Found Posts</h2>
        {filteredFoundPosts.length > 0 ? (
          filteredFoundPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden p-6 mb-6"
            >
              <img
                src={`http://localhost:5001/${post.photo}`}
                alt={post.item}
                className="w-full h-60 object-cover rounded-lg"
              />
              <h3 className="text-xl font-bold text-gray-800 mt-4">{post.item}</h3>
              <p className="text-gray-600">{post.description}</p>
              <p className="text-gray-600">{post.location}</p>
              <p className="text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
              <p className="text-gray-600">{post.contact}</p>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEditPost(post)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post._id, "found")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No found posts found.</p>
        )}
      </div>

      {/* Edit Post Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-1/2">
            <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
            <input
              type="text"
              value={editPost.item}
              onChange={(e) => setEditPost({ ...editPost, item: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <textarea
              value={editPost.description}
              onChange={(e) => setEditPost({ ...editPost, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <button
              onClick={handleSaveEdit}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;