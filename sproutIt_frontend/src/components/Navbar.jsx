import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching user with token:", token);
        const response = await axios.get("/api/auth/user", {
          headers: {
            "x-auth-token": token,
          },
        });
        console.log("User data received:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err.response || err);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  if (isLoading) {
    return (
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold flex items-center">
                🌱 SproutIt
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold flex items-center">
              🌱 SproutIt
            </Link>
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link
                  to="/dashboard"
                  className="text-white hover:text-green-200 transition-colors"
                >
                  My Gardens
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-green-200">
                  Welcome, {user.username} (Zone {user.zone})
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-green-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
