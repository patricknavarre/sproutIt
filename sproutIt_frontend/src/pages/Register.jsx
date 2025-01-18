import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    zone: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting registration with data:", formData);
      const response = await axios.post("/api/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Registration response:", response.data);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config,
      });

      // Handle duplicate username error
      if (
        err.response?.data?.includes("duplicate key error") ||
        err.response?.data?.includes('username: "testing"')
      ) {
        setError(
          "Username already exists. Please choose a different username."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8 relative">
        {/* Decorative Elements */}
        <div className="absolute -left-16 -top-12 w-32 h-32 text-6xl animate-bounce-slow opacity-50">
          🌱
        </div>
        <div className="absolute -right-12 top-24 w-24 h-24 text-5xl animate-pulse opacity-50">
          🌿
        </div>

        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 relative z-10 border-t-4 border-green-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Join Our Garden
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start planning your perfect garden today
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="zone"
                className="block text-sm font-medium text-gray-700"
              >
                Growing Zone
              </label>
              <div className="mt-1">
                <select
                  id="zone"
                  name="zone"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  value={formData.zone}
                  onChange={handleChange}
                >
                  <option value="">Select your zone</option>
                  {[...Array(13)].map((_, i) => (
                    <option key={i} value={`${i + 1}`}>
                      Zone {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Not sure?{" "}
                <a
                  href="https://planthardiness.ars.usda.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-500"
                >
                  Find your zone
                </a>
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition hover:scale-105"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Creating your garden...
                  </span>
                ) : (
                  "Start Growing"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="font-medium text-green-600 hover:text-green-500"
              >
                Sign in to your garden
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
