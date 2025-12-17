import React, { useState } from "react";
import { Link,useNavigate,useLocation } from "react-router-dom";
import { apiEndpoints } from '../config/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  // Get the "from" path or default to home ("/")
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiEndpoints.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data); // Log response to check success
      if (data.success) {
        navigate(from, { replace: true });
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative">
        {/* Close Button */}
        <Link to="/" className="absolute top-4 right-4 text-gray-600 hover:text-gray-900">
          <i className="fa-solid fa-xmark text-2xl"></i>
        </Link>

        {/* Form */}
        <div className="form-value">
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            {/* Email Field */}
            <div className="inputbox relative mb-6">
              <i className="fa-regular fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
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
                placeholder="Password"
                required
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
              Login
            </button>

            {/* Register Link */}
            <div className="register mt-4 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-amber-500 hover:text-amber-600">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;