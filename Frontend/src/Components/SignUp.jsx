import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { apiEndpoints } from '../config/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to an API)
    try {
      const response = await fetch(apiEndpoints.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative">
        {/* Close Button */}
        <Link to="/login" className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </Link>

        {/* Form */}
        <div className="form-value">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

            {/* Name Field */}
            <div className="inputbox relative mb-6">
              <i className="fa-solid fa-user-plus absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Email Field */}
            <div className="inputbox relative mb-6">
              <i className="fa-regular fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Password Field */}
            <div className="inputbox relative mb-6">
              <i className="fa-solid fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Mobile Field */}
            <div className="inputbox relative mb-6">
              <i className="fa-solid fa-phone absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="Mobile"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Address Field */}
            <div className="inputbox relative mb-6">
              <i className="fa-solid fa-location-dot absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Address"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="forgot mb-6">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" />
                Remember Me <a href="#" className="ml-2 text-amber-500 hover:text-amber-600">Forgot password</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
            >
              Signup
            </button>

            {/* Register Link */}
            <div className="register mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-amber-500 hover:text-amber-600">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;