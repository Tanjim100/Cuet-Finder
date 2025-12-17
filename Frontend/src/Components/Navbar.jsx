import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiEndpoints } from '../config/api';

function Navbar({ user, setUser }) {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate();

  // Function to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if the user is logged in
  const checkUserLoggedIn = async () => {
    try {
      const response = await fetch(apiEndpoints.validate, {
        credentials: "include", // Include cookies
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error checking user login status:", error);
      return false;
    }
  };

  // Handle navigation to "Report Lost" page
  const handleReportLostClick = async (e) => {
    e.preventDefault(); // Prevent default navigation
    const isLoggedIn = await checkUserLoggedIn();
    if (isLoggedIn) {
      navigate("/reportlost"); // Navigate to the "Report Lost" page
    } else {
      alert("You must be Logged In before making a Post")
      navigate("/login"); // Redirect to the login page if not logged in
    }
  };


    // Handle navigation to "Post Found" page
    const handleReportFoundClick = async (e) => {
      e.preventDefault(); // Prevent default navigation
      const isLoggedIn = await checkUserLoggedIn();
      if (isLoggedIn) {
        navigate("/reportfound"); // Navigate to the "Report Lost" page
      } else {
        alert("You must be Logged In before making a Post")
        navigate("/login"); // Redirect to the login page if not logged in
      }
    };
  

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch(apiEndpoints.logout, {
        method: "POST",
        credentials: "include", // Include cookies
      });
      setUser(null); // Clear user data
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleAdmin = (email,id) => {
    if (email === "Admin@gmail.com") navigate("/admin");
    else {
      navigate(`profile/${id}`);
    }
  };

  return (
    <>
      <div className="w-full h-20 bg-amber-500 flex justify-between shadow-lg">
        <div className="h-full flex justify-center items-center mx-4">
          <img className="h-20" src="/Logo 1.png" alt="Logo 1" />
          <img className="h-10" src="/CuetFinders.png" alt="CuetFinders" />
        </div>

        <div className="h-full mr-6">
          <ul className="h-full flex items-center">
            <li
              className={`font-bold mx-4 text-2xl hover:underline cursor-pointer hover:text-red-600 transition-shadow ${
                isActive("/") ? "text-white underline" : ""
              }`}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={`font-bold mx-4 text-2xl hover:underline cursor-pointer hover:text-red-600 transition-shadow ${
                isActive("/lost") ? "text-white underline" : ""
              }`}
            >
              <Link to="/lost">Lost</Link>
            </li>
            <li
              className={`font-bold mx-4 text-2xl hover:underline cursor-pointer hover:text-red-600 transition-shadow ${
                isActive("/reportlost") ? "text-white underline" : ""
              }`}
            >
              <Link to="/reportlost" onClick={handleReportLostClick}>
                Report Lost
              </Link>
            </li>
            <li
              className={`font-bold mx-4 text-2xl hover:underline cursor-pointer hover:text-red-600 transition-shadow ${
                isActive("/found") ? "text-white underline" : ""
              }`}
            >
              <Link to="/found">Found</Link>
            </li>
            <li
              onClick={handleReportFoundClick}
              className={`font-bold mx-4 text-2xl hover:underline cursor-pointer hover:text-red-600 transition-shadow ${
                isActive("/reportfound") ? "text-white underline" : ""
              }`}
            >
              <Link to="/reportfound">Report Found</Link>
            </li>

            {user ? (
              <li className="relative group">
                {/* Welcome message */}
                <div
                  onClick={() => handleAdmin(user.email,user.id)}
                  className="text-2xl mx-4 font-semibold font-serif cursor-pointer"
                >
                  <h1 className="text-center text-amber-700">Welcome,</h1>
                  <h1 className="text-center text-amber-700">{user.name}</h1>
                </div>
                {/* Logout button */}
                <div className="absolute top-full left-0 mt-2 w-full bg-white shadow-lg rounded-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </li>
            ) : (
              <li
                className={`font-bold mx-4 text-2xl bg-[#17a747] px-4 py-2 rounded-md text-white cursor-pointer hover:text-[#ccc] duration-75 transition-shadow ${
                  isActive("/profile") ? "text-white underline" : ""
                }`}
              >
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;