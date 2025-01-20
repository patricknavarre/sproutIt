import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import WeatherDisplay from "../components/WeatherDisplay";
import PlantingCalendar from "../components/PlantingCalendar";

const Dashboard = () => {
  const [gardens, setGardens] = useState([]);
  const [showNewGardenForm, setShowNewGardenForm] = useState(false);
  const [newGardenName, setNewGardenName] = useState("");
  const [width, setWidth] = useState(4);
  const [length, setLength] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userZone, setUserZone] = useState(null);
  const [showNewBedModal, setShowNewBedModal] = useState(false);
  const [newBedWidth, setNewBedWidth] = useState(4);
  const [newBedLength, setNewBedLength] = useState(8);
  const [selectedGardenId, setSelectedGardenId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data to get growing zone
        const userResponse = await api.get("/api/auth/user");
        setUserZone(userResponse.data.growingZone);

        // Fetch gardens
        const gardensResponse = await api.get("/api/gardens");
        console.log("Available gardens:", gardensResponse.data);
        setGardens(gardensResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.response?.data?.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreateGarden = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/gardens", {
        name: newGardenName,
        layout: {
          type: "single-bed",
          beds: [
            {
              width: parseInt(width),
              length: parseInt(length),
              plants: [],
            },
          ],
        },
      });

      setGardens([...gardens, response.data]);
      setShowNewGardenForm(false);
      setNewGardenName("");
      setWidth(4);
      setLength(8);
    } catch (err) {
      console.error("Error creating garden:", err);
      setError(err.response?.data?.message || "Error creating garden");
    }
  };

  const handleDeleteGarden = async (gardenId, gardenName) => {
    if (!window.confirm(`Are you sure you want to delete "${gardenName}"?`)) {
      return;
    }

    try {
      // Use PATCH instead of DELETE since we know PATCH works
      await api.patch(`/api/gardens/${gardenId}`, {
        deleted: true,
      });

      // Remove from UI
      setGardens((prevGardens) =>
        prevGardens.filter((g) => g._id !== gardenId)
      );

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50";
      successMessage.textContent = "Garden deleted successfully";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
      console.error("Failed to delete garden:", {
        error: err,
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        gardenId,
        gardenName,
      });

      // Show error message
      const errorMessage = document.createElement("div");
      errorMessage.className =
        "fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50";
      errorMessage.textContent =
        "Failed to delete garden. Please try again later.";
      document.body.appendChild(errorMessage);
      setTimeout(() => errorMessage.remove(), 3000);
    }
  };

  const handleAddBed = async (gardenId) => {
    setSelectedGardenId(gardenId);
    setShowNewBedModal(true);
  };

  const handleCreateBed = async (e) => {
    e.preventDefault();

    try {
      const garden = gardens.find((g) => g._id === selectedGardenId);
      if (!garden) {
        setError("Garden not found");
        return;
      }

      const newBed = {
        width: parseInt(newBedWidth),
        length: parseInt(newBedLength),
        plants: [],
      };

      const updatedGarden = {
        ...garden,
        layout: {
          ...garden.layout,
          beds: [...garden.layout.beds, newBed],
        },
      };

      const response = await api.patch(
        `/api/gardens/${selectedGardenId}`,
        updatedGarden
      );

      setGardens(
        gardens.map((g) => (g._id === selectedGardenId ? response.data : g))
      );
      setShowNewBedModal(false);

      // Show success feedback
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg";
      successMessage.textContent = "New bed added successfully!";
      document.body.appendChild(successMessage);
      setTimeout(() => successMessage.remove(), 3000);
    } catch (err) {
      console.error("Error adding bed:", err);
      setError(err.response?.data?.message || "Error adding bed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather Display */}
        <div className="mb-8 transform hover:scale-[1.02] transition-all duration-300">
          <WeatherDisplay userZone={userZone} />
        </div>

        {/* Gardens Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 backdrop-blur-sm bg-white/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              My Gardens
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowNewGardenForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Create New Garden
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {showNewGardenForm && (
            <div className="mb-8 bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100 shadow-lg">
              <form onSubmit={handleCreateGarden}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Garden Name
                    </label>
                    <input
                      type="text"
                      value={newGardenName}
                      onChange={(e) => setNewGardenName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter garden name..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (feet)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          min="1"
                          max="20"
                          required
                        />
                        <span className="text-sm text-gray-500 mt-1 block">
                          Width
                        </span>
                      </div>
                      <span className="text-2xl text-gray-400">×</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          min="1"
                          max="50"
                          required
                        />
                        <span className="text-sm text-gray-500 mt-1 block">
                          Length
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Create Garden
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewGardenForm(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gardens.map((garden) => (
              <div
                key={garden._id}
                className="group relative bg-gradient-to-br from-white to-green-50 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <button
                  onClick={() => handleDeleteGarden(garden._id, garden.name)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full hover:bg-red-50"
                  title="Delete garden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {garden.name}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-gray-600">
                    {garden.layout.beds[0].width}' ×{" "}
                    {garden.layout.beds[0].length}'
                  </span>
                </div>
                <Link
                  to={`/garden/${garden._id}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Plan Garden
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Planting Calendar */}
        {userZone && (
          <div className="mb-8 transform hover:scale-[1.02] transition-all duration-300">
            <PlantingCalendar userZone={userZone} />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8 bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-white/80">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/seed-database"
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-green-200 hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-300">
                <span className="text-2xl">🌱</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-all duration-300">
                  Seed Database
                </h3>
                <p className="text-sm text-gray-600">
                  Browse seeds and plan your planting schedule
                </p>
              </div>
            </Link>

            <Link
              to="/seed-starting-scheduler"
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-green-200 hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-300">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-all duration-300">
                  Seed Starting Scheduler
                </h3>
                <p className="text-sm text-gray-600">
                  Plan when to start your seeds indoors
                </p>
              </div>
            </Link>

            <Link
              to="/pest-disease-guide"
              className="group flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-green-200 hover:bg-green-50 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-300">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-all duration-300">
                  Pest & Disease Guide
                </h3>
                <p className="text-sm text-gray-600">
                  Identify and treat common garden issues
                </p>
              </div>
            </Link>

            {gardens.length > 0 ? (
              <Link
                to={`/recipe-suggestions/${gardens[0]._id}`}
                className="group flex items-center gap-4 p-4 rounded-xl border-2 border-transparent hover:border-green-200 hover:bg-green-50 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-all duration-300">
                  <span className="text-2xl">🥗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-all duration-300">
                    Recipe Suggestions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Find recipes for your garden harvest
                  </p>
                </div>
              </Link>
            ) : (
              <div className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-not-allowed opacity-60">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🥗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Recipe Suggestions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Create a garden first to get recipe suggestions
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Bed Modal */}
      {showNewBedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Garden Bed
                </h2>
                <button
                  onClick={() => setShowNewBedModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateBed}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bed Dimensions (feet)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={newBedWidth}
                          onChange={(e) => setNewBedWidth(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          min="1"
                          max="20"
                          required
                        />
                        <span className="text-sm text-gray-500 mt-1 block">
                          Width
                        </span>
                      </div>
                      <span className="text-2xl text-gray-400">×</span>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={newBedLength}
                          onChange={(e) => setNewBedLength(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                          min="1"
                          max="50"
                          required
                        />
                        <span className="text-sm text-gray-500 mt-1 block">
                          Length
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Add Bed
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewBedModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
