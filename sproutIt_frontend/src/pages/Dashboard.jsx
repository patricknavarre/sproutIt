import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
        const userResponse = await axios.get("/api/auth/user", {
          headers: { "x-auth-token": token },
        });
        setUserZone(userResponse.data.growingZone);

        // Fetch gardens
        const gardensResponse = await axios.get("/api/gardens", {
          headers: { "x-auth-token": token },
        });
        setGardens(gardensResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleCreateGarden = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/api/gardens",
        {
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
        },
        {
          headers: { "x-auth-token": token },
        }
      );

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

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/gardens/${gardenId}`, {
        headers: { "x-auth-token": token },
      });

      setGardens(gardens.filter((garden) => garden._id !== gardenId));
    } catch (err) {
      console.error("Error deleting garden:", err);
      setError(err.response?.data?.message || "Error deleting garden");
    }
  };

  const handleAddBed = async (gardenId) => {
    if (!gardenId) {
      setError("Please select a garden first");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const garden = gardens.find((g) => g._id === gardenId);
      if (!garden) {
        setError("Garden not found");
        return;
      }

      const updatedGarden = {
        ...garden,
        layout: {
          ...garden.layout,
          beds: [
            ...garden.layout.beds,
            {
              width: 4,
              length: 4,
              plants: [],
            },
          ],
        },
      };

      const response = await axios.patch(
        `/api/gardens/${gardenId}`,
        updatedGarden,
        {
          headers: { "x-auth-token": token },
        }
      );

      setGardens(gardens.map((g) => (g._id === gardenId ? response.data : g)));
    } catch (err) {
      console.error("Error adding bed:", err);
      setError(err.response?.data?.message || "Error adding bed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Weather Display */}
      <div className="mb-8">
        <WeatherDisplay userZone={userZone} />
      </div>

      {/* Gardens Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">My Gardens</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowNewGardenForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Create New Garden
            </button>
            {gardens.length > 0 && (
              <button
                onClick={() => handleAddBed(gardens[0]._id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                Add New Bed
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showNewGardenForm && (
          <form
            onSubmit={handleCreateGarden}
            className="mb-6 p-4 bg-green-50 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Garden Name
                </label>
                <input
                  type="text"
                  value={newGardenName}
                  onChange={(e) => setNewGardenName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dimensions (feet)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="20"
                    required
                  />
                  <span className="self-center">×</span>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Garden
              </button>
              <button
                type="button"
                onClick={() => setShowNewGardenForm(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gardens.map((garden) => (
            <div
              key={garden._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow relative group"
            >
              <button
                onClick={() => handleDeleteGarden(garden._id, garden.name)}
                className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {garden.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {garden.layout.beds[0].width}' × {garden.layout.beds[0].length}'
              </p>
              <Link
                to={`/garden/${garden._id}`}
                className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                Plan Garden
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Planting Calendar */}
      {userZone && (
        <div className="mb-8">
          <PlantingCalendar userZone={userZone} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
