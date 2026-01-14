import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "../config/api";
import { useTheme } from "../App";

const ReportLost = () => {
  const [form, setForm] = useState({
    name: "",
    item: "",
    location: "",
    date: "",
    description: "",
    contact: "",
    category: "",
  });
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + photos.length > 5) {
      alert("Maximum 5 photos allowed");
      return;
    }

    setPhotos((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!form.name || !form.item || !form.location || !form.date || !form.description || !form.contact) {
      alert("Please fill in all required fields");
      return;
    }
    
    if (photos.length === 0) {
      alert("Please upload at least one photo");
      return;
    }
    
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });
    
    // Only send the first photo with the field name "photo" that multer expects
    if (photos.length > 0) {
      formData.append("photo", photos[0]);
    }

    try {
      console.log("Submitting report to:", apiEndpoints.reportLost);
      const response = await fetch(apiEndpoints.reportLost, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Check if response is valid JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid response type:", contentType);
        console.error("Response status:", response.status);
        const responseText = await response.text();
        console.error("Response body:", responseText);
        
        if (response.status === 401) {
          alert("Session expired. Please log in again.");
          navigate("/login");
        } else if (response.status === 403) {
          alert("You don't have permission to submit reports. Please log in.");
          navigate("/login");
        } else {
          alert("Server error. Please try again later.");
        }
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok) {
        alert("Report submitted successfully!");
        setForm({
          name: "",
          item: "",
          location: "",
          date: "",
          description: "",
          contact: "",
          category: "",
        });
        setPhotos([]);
        setPhotoPreviews([]);
        navigate("/lost");
      } else {
        alert(data.message || "Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred. Please check your internet connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    {
      name: "name",
      label: "Your Name",
      type: "text",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      name: "item",
      label: "Item Name",
      type: "text",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      name: "location",
      label: "Last Known Location",
      type: "text",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
    },
    {
      name: "date",
      label: "Date Lost",
      type: "date",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      name: "contact",
      label: "Contact Number",
      type: "text",
      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    },
  ];

  const { isDark } = useTheme();

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
          className={`absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
            isDark ? "opacity-20" : "opacity-10"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse ${
            isDark ? "opacity-20" : "opacity-10"
          }`}
        ></div>
      </div>

      <div className="relative max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${
              isDark
                ? "bg-red-500/20 border-red-500/30"
                : "bg-red-50 border-red-200"
            }`}
          >
            <svg
              className="w-5 h-5 text-red-400"
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
            <span
              className={`text-sm font-medium ${
                isDark ? "text-red-300" : "text-red-600"
              }`}
            >
              Help us find your item
            </span>
          </div>
          <h1
            className={`text-4xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Report{" "}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Lost Item
            </span>
          </h1>
          <p className={isDark ? "text-white/60" : "text-gray-600"}>
            Fill in the details below to report your lost item
          </p>
        </div>

        {/* Form Card */}
        <div
          className={`backdrop-blur-xl rounded-3xl border p-8 ${
            isDark
              ? "bg-white/10 border-white/20"
              : "bg-white border-gray-200 shadow-xl"
          }`}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {inputFields.map((field) => (
              <div key={field.name}>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-white/70" : "text-gray-700"
                  }`}
                >
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                    className={`w-full px-5 py-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all ${
                      isDark
                        ? "bg-white/10 border-white/20 text-white placeholder-white/40"
                        : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                  <svg
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                      isDark ? "text-white/40" : "text-gray-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={field.icon}
                    />
                  </svg>
                </div>
              </div>
            ))}

            {/* Description */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-white/70" : "text-gray-700"
                }`}
              >
                Item Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Describe your item in detail..."
                className={`w-full px-5 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all resize-none ${
                  isDark
                    ? "bg-white/10 border-white/20 text-white placeholder-white/40"
                    : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {/* Category Selection */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-white/70" : "text-gray-700"
                }`}
              >
                Category
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat.name })}
                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                      form.category === cat.name
                        ? "border-red-500 bg-red-500/20 text-white"
                        : isDark
                        ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                    style={
                      form.category === cat.name
                        ? {
                            borderColor: cat.color,
                            backgroundColor: `${cat.color}20`,
                          }
                        : {}
                    }
                  >
                    <span className="text-xl mb-1 block">{cat.icon}</span>
                    <span className="text-xs">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-white/70" : "text-gray-700"
                }`}
              >
                Upload Photos (Max 5)
              </label>

              {/* Photo Previews */}
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {photoPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl border border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        ×
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-red-500/80 rounded text-xs text-white">
                          Main
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  name="photos"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                  accept="image/*"
                  multiple
                  disabled={photos.length >= 5}
                />
                <label
                  htmlFor="photo-upload"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    photos.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                  } ${
                    isDark
                      ? "bg-white/10 border-white/20 hover:bg-white/15 hover:border-red-500/50"
                      : "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-red-400"
                  }`}
                >
                  <svg
                    className={`w-8 h-8 mb-2 ${
                      isDark ? "text-white/40" : "text-gray-400"
                    }`}
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
                  <span
                    className={`text-sm ${
                      isDark ? "text-white/50" : "text-gray-500"
                    }`}
                  >
                    {photos.length >= 5
                      ? "Maximum photos reached"
                      : `Add photos (${photos.length}/5)`}
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white font-semibold shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Report"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLost;
