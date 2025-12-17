import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from '../config/api';

const ReportLost = () => {
  const [form, setForm] = useState({
    name: "",
    item: "",
    location: "",
    date: "",
    description: "",
    contact: "",
  });

  const [photo, setPhoto] = useState(null); // State for the photo file
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setPhoto(file); // Update the photo state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("item", form.item);
    formData.append("location", form.location);
    formData.append("date", form.date);
    formData.append("description", form.description);
    formData.append("contact", form.contact);
    if (photo) {
      formData.append("photo", photo); // Append the photo file
    }

    try {
      const response = await fetch(apiEndpoints.reportLost, {
        method: "POST",
        body: formData, // Send FormData directly
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report submitted successfully!");
        navigate("/lost"); // Redirect to the lost items page
      } else {
        alert(data.message || "Failed to submit report. Please log in.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="p-8 bg-gray-100 min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Report Lost Item
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md"
        encType="multipart/form-data" // Ensure the form supports file uploads
      >
        <div id="input-box" className="space-y-6">
          {/* Name Field */}
          <div className="name">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Name :
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Item Field */}
          <div className="item">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Item :
            </label>
            <input
              type="text"
              name="item"
              value={form.item}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Location Field */}
          <div className="location">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Location :
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Date Field */}
          <div className="date">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Date :
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Description Field */}
          <div className="description">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Item Description :
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="4"
            />
          </div>

          {/* Photo Upload Field */}
          <div className="photoup">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Upload Photo :
            </label>
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Contact Field */}
          <div className="contact">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Contact :
            </label>
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 text-white p-3 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
    </section>
  );
};

export default ReportLost;