import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiEndpoints } from '../config/api';

const Lost = () => {
  const [posts, setPosts] = useState([]); // State to store lost items
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [copiedPostId, setCopiedPostId] = useState(null); // State to track which post's contact was copied

  // Fetch lost items from the backend
  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const response = await fetch(apiEndpoints.getAllLostPosts);
        const data = await response.json();
        if (data.success) {
          setPosts(data.posts); // Set the fetched posts
        } else {
          console.error("Failed to fetch lost posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    fetchLostItems();
  }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter(
    (post) =>
      post.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to copy contact number
  const handleCopyContact = (contact, postId) => {
    navigator.clipboard
      .writeText(contact)
      .then(() => {
        setCopiedPostId(postId); // Set the post ID to show feedback
        setTimeout(() => setCopiedPostId(null), 2000); // Reset after 2 seconds
      })
      .catch((error) => {
        console.error("Failed to copy contact:", error);
      });
  };

  return (
    <section id="lost-contents" className="p-8 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Lost Items
      </h1>

      {/* Search and Report Section */}
      <div className="search-container flex flex-col sm:flex-row justify-between items-center mb-8">
        {/* Search Bar */}
        <div className="flex items-center bg-white rounded-lg shadow-md w-full sm:w-1/2 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            className="text-xl bg-amber-500 p-3 rounded-r-lg hover:bg-amber-600 transition-colors"
          >
            🔍
          </button>
        </div>

        {/* Report Button */}
        <Link
          to="/reportlost"
          className="report-lost-btn flex items-center bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          <p className="mr-2">Report</p>
          <img
            src="/lost item icon.png"
            alt="Lost Icon"
            className="h-6 w-6"
          />
        </Link>
      </div>

      {/* Post Container */}
      <div
        id="post-container"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="post-box bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Item Header */}
              <div className="item-header flex items-center p-4 border-b">
                <img
                  src="/Initial.png"
                  alt="No icon found"
                  className="h-10 bg-amber-600 w-10 rounded-full"
                />
                <div className="ml-4">
                  <h5 className="text-lg font-semibold text-gray-800">
                    {post.item}
                  </h5>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(post.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Item Image */}
              <div className="item-img p-4">
                <img
                  src={`http://localhost:5001/${post.photo}`}
                  alt="Don't have image"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Owner Info */}
              <div className="Owner-info p-4 border-b">
                <h5 className="text-lg font-semibold text-gray-800">
                  Owner Name
                </h5>
                <p className="text-sm text-gray-600">{post.name}</p>
              </div>

              {/* Item Description */}
              <div className="item-desc p-4 border-b">
                <h5 className="text-lg font-semibold text-gray-800">
                  Description
                </h5>
                <p className="text-sm text-gray-600">{post.description}</p>
              </div>

              {/* Location */}
              <div className="item-desc p-4 border-b">
                <h5 className="text-lg font-semibold text-gray-800">
                  Location
                </h5>
                <p className="text-sm text-gray-600">{post.location}</p>
              </div>

              {/* Contact Button */}
              <div className="relative">
                <button
                  className="cont-btn w-full bg-amber-500 text-white p-3 hover:bg-amber-600 transition-colors"
                  onMouseEnter={() => handleCopyContact(post.contact, post._id)}
                  title="Hover to copy contact number"
                >
                  Contact: {post.contact}
                </button>
                {copiedPostId === post._id && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 rounded-lg text-sm">
                    Copied!
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div id="no-post" className="text-center col-span-full">
            <p className="text-xl text-gray-600">No posts found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Lost;