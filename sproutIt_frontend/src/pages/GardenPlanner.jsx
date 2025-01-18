import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, addDays } from "date-fns";

// Vegetable categories based on Johnny's Seeds
const VEGETABLE_CATEGORIES = {
  "Leafy Greens": [
    { name: "Lettuce", emoji: "🥬", daysToMaturity: 45 },
    { name: "Spinach", emoji: "🌿", daysToMaturity: 40 },
    { name: "Kale", emoji: "🥬", daysToMaturity: 50 },
    { name: "Swiss Chard", emoji: "🌿", daysToMaturity: 55 },
  ],
  "Root Vegetables": [
    { name: "Carrots", emoji: "🥕", daysToMaturity: 70 },
    { name: "Beets", emoji: "🫐", daysToMaturity: 55 },
    { name: "Radishes", emoji: "🔴", daysToMaturity: 25 },
    { name: "Turnips", emoji: "⚪", daysToMaturity: 45 },
  ],
  Nightshades: [
    { name: "Tomatoes", emoji: "🍅", daysToMaturity: 75 },
    { name: "Peppers", emoji: "🫑", daysToMaturity: 70 },
    { name: "Eggplant", emoji: "🍆", daysToMaturity: 75 },
  ],
  Brassicas: [
    { name: "Broccoli", emoji: "🥦", daysToMaturity: 65 },
    { name: "Cauliflower", emoji: "🥦", daysToMaturity: 70 },
    { name: "Cabbage", emoji: "🥬", daysToMaturity: 65 },
    { name: "Brussels Sprouts", emoji: "🥬", daysToMaturity: 90 },
  ],
  Legumes: [
    { name: "Peas", emoji: "🫛", daysToMaturity: 60 },
    { name: "Green Beans", emoji: "🫛", daysToMaturity: 55 },
  ],
  Cucurbits: [
    { name: "Cucumber", emoji: "🥒", daysToMaturity: 60 },
    { name: "Zucchini", emoji: "🥒", daysToMaturity: 50 },
    { name: "Pumpkin", emoji: "🎃", daysToMaturity: 100 },
  ],
};

// New herb categories based on Johnny's Seeds
const HERB_CATEGORIES = {
  "Culinary Herbs": [
    { name: "Basil", emoji: "🌿", daysToMaturity: 30, type: "Annual" },
    { name: "Oregano", emoji: "🌿", daysToMaturity: 90, type: "Perennial" },
    { name: "Thyme", emoji: "🌿", daysToMaturity: 90, type: "Perennial" },
    { name: "Rosemary", emoji: "🌿", daysToMaturity: 85, type: "Perennial" },
    { name: "Sage", emoji: "🌿", daysToMaturity: 75, type: "Perennial" },
    { name: "Chives", emoji: "🌿", daysToMaturity: 60, type: "Perennial" },
  ],
  "Medicinal & Tea Herbs": [
    { name: "Chamomile", emoji: "🌼", daysToMaturity: 65, type: "Annual" },
    { name: "Lavender", emoji: "💜", daysToMaturity: 110, type: "Perennial" },
    { name: "Echinacea", emoji: "🌸", daysToMaturity: 95, type: "Perennial" },
    { name: "Lemon Balm", emoji: "🌿", daysToMaturity: 70, type: "Perennial" },
    { name: "Mint", emoji: "🌿", daysToMaturity: 85, type: "Perennial" },
  ],
  "Garnishing Herbs": [
    { name: "Parsley", emoji: "🌿", daysToMaturity: 75, type: "Biennial" },
    { name: "Dill", emoji: "🌿", daysToMaturity: 45, type: "Annual" },
    { name: "Cilantro", emoji: "🌿", daysToMaturity: 50, type: "Annual" },
    { name: "Chervil", emoji: "🌿", daysToMaturity: 60, type: "Annual" },
  ],
  "Companion Herbs": [
    { name: "Borage", emoji: "💠", daysToMaturity: 55, type: "Annual" },
    { name: "Calendula", emoji: "🌼", daysToMaturity: 60, type: "Annual" },
    { name: "Bee Balm", emoji: "🌺", daysToMaturity: 85, type: "Perennial" },
    {
      name: "Anise Hyssop",
      emoji: "💜",
      daysToMaturity: 90,
      type: "Perennial",
    },
  ],
};

// New fruit categories based on Johnny's Seeds
const FRUIT_CATEGORIES = {
  "Berry Fruits": [
    { name: "Strawberry", emoji: "🍓", daysToMaturity: 120, type: "Perennial" },
    { name: "Raspberry", emoji: "🫐", daysToMaturity: 365, type: "Perennial" },
    { name: "Blackberry", emoji: "🫐", daysToMaturity: 365, type: "Perennial" },
    { name: "Blueberry", emoji: "🫐", daysToMaturity: 730, type: "Perennial" },
  ],
  "Melon Fruits": [
    { name: "Cantaloupe", emoji: "🍈", daysToMaturity: 75, type: "Annual" },
    { name: "Honeydew", emoji: "🍈", daysToMaturity: 80, type: "Annual" },
    { name: "Watermelon", emoji: "🍉", daysToMaturity: 85, type: "Annual" },
  ],
  "Other Fruits": [
    { name: "Rhubarb", emoji: "🌿", daysToMaturity: 365, type: "Perennial" },
    { name: "Ground Cherry", emoji: "🟡", daysToMaturity: 70, type: "Annual" },
  ],
};

// Plant care information
const PLANT_CARE_INFO = {
  // Vegetables
  Lettuce: {
    water: "Keep soil consistently moist",
    sun: "Partial shade to full sun",
    spacing: "6-8 inches apart",
    tips: "Harvest outer leaves as needed",
  },
  Tomatoes: {
    water: "1-2 inches per week",
    sun: "Full sun",
    spacing: "24-36 inches apart",
    tips: "Prune suckers, provide support",
  },
  Carrots: {
    water: "1 inch per week",
    sun: "Full sun",
    spacing: "2-3 inches apart",
    tips: "Thin seedlings, keep soil loose",
  },
  // Herbs
  Basil: {
    water: "Water when top soil is dry",
    sun: "Full sun",
    spacing: "12-18 inches apart",
    tips: "Pinch off flower buds to promote leaf growth",
  },
  Mint: {
    water: "Keep soil moist",
    sun: "Partial to full sun",
    spacing: "18-24 inches apart",
    tips: "Plant in containers to prevent spreading",
  },
  // Fruits
  Strawberry: {
    water: "1-2 inches per week",
    sun: "Full sun",
    spacing: "12 inches apart",
    tips: "Remove runners unless propagating",
  },
  // Add more plant care info as needed...
};

const GardenPlanner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [garden, setGarden] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeTab, setActiveTab] = useState("vegetables"); // New state for tab control
  const [draggedPlant, setDraggedPlant] = useState(null);
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPlantForPlacement, setSelectedPlantForPlacement] =
    useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedBedIndex, setSelectedBedIndex] = useState(0);
  const [showNewBedDialog, setShowNewBedDialog] = useState(false);
  const [newBedDimensions, setNewBedDimensions] = useState({
    width: 4,
    length: 4,
  });
  const [editingPlant, setEditingPlant] = useState(null);

  useEffect(() => {
    const fetchGarden = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        console.log("Token being used:", token);
        console.log("Fetching garden data...");
        const response = await axios.get(`/api/gardens/${id}`, {
          headers: {
            "x-auth-token": token,
          },
        });

        console.log("API Response:", response);
        if (!response.data) {
          throw new Error("Invalid data received from server");
        }

        console.log("Raw garden data:", response.data);

        // Initialize garden data from response
        let gardenData = response.data;

        // If no data received, create default structure
        if (!gardenData) {
          console.log("No garden data received, creating default structure");
          gardenData = {
            _id: id,
            name: "My Garden",
            layout: {
              type: "single-bed",
              beds: [
                {
                  width: 4,
                  length: 8,
                  plants: [],
                },
              ],
            },
          };
        }

        // Ensure layout structure exists but preserve dimensions if they exist
        if (
          !gardenData.layout ||
          !gardenData.layout.beds ||
          !gardenData.layout.beds[0]
        ) {
          console.log("Garden data missing layout structure, initializing...");
          const existingBed = gardenData.layout?.beds?.[0] || {};
          gardenData = {
            ...gardenData,
            layout: {
              type: "single-bed",
              beds: [
                {
                  width: existingBed.width || 4,
                  length: existingBed.length || 8,
                  plants: existingBed.plants || [],
                },
              ],
            },
          };

          // Update the server with initialized structure
          console.log(
            "Updating server with initialized structure:",
            gardenData
          );
          try {
            const updateResponse = await axios.patch(
              `/api/gardens/${id}`,
              gardenData,
              {
                headers: {
                  "x-auth-token": localStorage.getItem("token"),
                },
              }
            );
            gardenData = updateResponse.data;
          } catch (updateErr) {
            console.error("Error updating garden structure:", updateErr);
          }
        }

        // Ensure bed properties are numbers but preserve original values
        const bed = gardenData.layout.beds[0];
        bed.width = parseInt(bed.width) || bed.width || 4;
        bed.length = parseInt(bed.length) || bed.length || 8;
        bed.plants = Array.isArray(bed.plants) ? bed.plants : [];

        console.log("Final garden data:", gardenData);
        setGarden(gardenData);
        setError(null);
      } catch (err) {
        console.error("Error fetching/updating garden:", err);

        // Handle token expiration
        if (err.response?.status === 401) {
          console.log("Token expired or invalid, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        // Initialize with default data if fetch fails
        const defaultGarden = {
          _id: id,
          name: "My Garden",
          layout: {
            type: "single-bed",
            beds: [
              {
                width: 4,
                length: 8,
                plants: [],
              },
            ],
          },
        };
        console.log("Using default garden data:", defaultGarden);
        setGarden(defaultGarden);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGarden();
  }, [id]);

  const handleSquareClick = async (squareIndex, bedIndex) => {
    if (!garden?.layout?.beds?.[bedIndex]) {
      console.error("Invalid garden data structure:", garden);
      alert("Unable to place plant: Garden layout not properly initialized");
      return;
    }

    console.log("Square clicked:", squareIndex, "in bed:", bedIndex);
    console.log("Selected plant:", selectedPlantForPlacement);

    if (selectedPlantForPlacement) {
      try {
        console.log("Attempting to place plant...");
        const updatedBed = { ...garden.layout.beds[bedIndex] };
        const x = squareIndex % updatedBed.width;
        const y = Math.floor(squareIndex / updatedBed.width);

        console.log("Position:", { x, y });

        // Check if plot is already occupied
        const existingPlant = updatedBed.plants?.find(
          (p) => p.position.x === x && p.position.y === y
        );
        if (existingPlant) {
          if (
            !window.confirm(
              `Replace ${existingPlant.plantName} with ${selectedPlantForPlacement.name}?`
            )
          ) {
            return;
          }
          console.log("Replacing existing plant");
          updatedBed.plants = updatedBed.plants.filter(
            (p) => p.position.x !== x || p.position.y !== y
          );
        }

        const plantDate = new Date();
        const harvestDate = addDays(
          plantDate,
          selectedPlantForPlacement.daysToMaturity
        );

        const newPlant = {
          plantId: selectedPlantForPlacement.name,
          plantName: selectedPlantForPlacement.name,
          emoji: selectedPlantForPlacement.emoji,
          daysToMaturity: selectedPlantForPlacement.daysToMaturity,
          position: { x, y },
          plantedDate: plantDate.toISOString(),
          harvestDate: harvestDate.toISOString(),
          type: selectedPlantForPlacement.type || "annual",
        };

        console.log("New plant data:", newPlant);

        const updatedGarden = {
          ...garden,
          layout: {
            ...garden.layout,
            beds: garden.layout.beds.map((bed, idx) =>
              idx === bedIndex
                ? {
                    ...updatedBed,
                    plants: [...(updatedBed.plants || []), newPlant],
                  }
                : bed
            ),
          },
        };

        console.log("Sending update to server:", updatedGarden);
        const response = await axios.patch(
          `/api/gardens/${id}`,
          updatedGarden,
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Server response:", response.data);
        setGarden(response.data);
        setSelectedPlantForPlacement(null);
      } catch (err) {
        console.error(
          "Error placing plant:",
          err.response?.data || err.message
        );
        alert(
          `Failed to place plant: ${err.response?.data?.message || err.message}`
        );
      }
    }
  };

  const handleDragStart = (plant, e) => {
    console.log("Drag started:", plant);
    e.dataTransfer.effectAllowed = "move";
    setDraggedPlant(plant);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedPlant(null);
  };

  const handleDrop = async (e, squareId) => {
    e.preventDefault();
    const [bedIndex, squareIndex] = squareId.split("-").map(Number);
    console.log("Drop event:", { bedIndex, squareIndex, draggedPlant });

    if (!draggedPlant) {
      console.log("No plant being dragged");
      return;
    }

    try {
      console.log("Attempting to drop plant...");
      const updatedBed = { ...garden.layout.beds[bedIndex] };
      const x = squareIndex % updatedBed.width;
      const y = Math.floor(squareIndex / updatedBed.width);

      console.log("Drop position:", { x, y });

      // Check if plot is already occupied
      const existingPlant = updatedBed.plants?.find(
        (p) => p.position.x === x && p.position.y === y
      );
      if (existingPlant) {
        if (
          !window.confirm(
            `Replace ${existingPlant.plantName} with ${draggedPlant.name}?`
          )
        ) {
          return;
        }
        console.log("Replacing existing plant");
        updatedBed.plants = updatedBed.plants.filter(
          (p) => p.position.x !== x || p.position.y !== y
        );
      }

      const plantDate = new Date();
      const harvestDate = addDays(plantDate, draggedPlant.daysToMaturity);

      const newPlant = {
        plantId: draggedPlant.name,
        plantName: draggedPlant.name,
        emoji: draggedPlant.emoji,
        daysToMaturity: draggedPlant.daysToMaturity,
        position: { x, y },
        plantedDate: plantDate.toISOString(),
        harvestDate: harvestDate.toISOString(),
        type: draggedPlant.type,
      };

      console.log("New plant data:", newPlant);

      const updatedGarden = {
        ...garden,
        layout: {
          ...garden.layout,
          beds: garden.layout.beds.map((bed, idx) =>
            idx === bedIndex
              ? {
                  ...updatedBed,
                  plants: [...(updatedBed.plants || []), newPlant],
                }
              : bed
          ),
        },
      };

      console.log("Sending update to server:", updatedGarden);
      const response = await axios.patch(`/api/gardens/${id}`, updatedGarden, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      });

      console.log("Server response:", response.data);
      setGarden(response.data);
      setDraggedPlant(null);
      setHoveredSquare(null);
      setIsDragging(false);
    } catch (err) {
      console.error("Error dropping plant:", err.response?.data || err.message);
      alert(
        `Failed to place plant: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const getPlantInSquare = (squareIndex) => {
    if (!garden?.layout?.beds?.[selectedBedIndex]?.plants) {
      console.log("No plants array found");
      return null;
    }

    const width = parseInt(garden.layout.beds[selectedBedIndex].width) || 4;
    const x = squareIndex % width;
    const y = Math.floor(squareIndex / width);

    return garden.layout.beds[selectedBedIndex].plants.find(
      (plant) => plant.position.x === x && plant.position.y === y
    );
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleDragOver = (e, squareIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredSquare(squareIndex);
  };

  const handlePlantClick = (plant) => {
    console.log("Plant clicked:", plant);
    setSelectedPlantForPlacement(plant);
  };

  const getPlantTooltip = (plant) => {
    if (!plant) return null;

    const careInfo = PLANT_CARE_INFO[plant.plantName] || {};
    const plantedDate = new Date(plant.plantedDate);
    const harvestDate = new Date(plant.harvestDate);

    return (
      <div
        className="absolute transform transition-all duration-300 w-64 p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-green-200 z-20 group-hover:opacity-100 [&:hover]:opacity-100 [&:hover]:z-30"
        style={{
          top: "-0.5rem",
          left: "calc(100% + 0.5rem)",
        }}
      >
        <div className="absolute left-0 top-4 -translate-x-2 w-4 h-4 rotate-45 bg-white border-l border-b border-green-200"></div>
        <div className="text-lg font-semibold flex items-center gap-2 relative">
          <span className="text-2xl">{plant.emoji}</span>
          <span className="bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
            {plant.plantName}
          </span>
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <span className="font-medium text-green-700">Planted:</span>
            <span className="bg-green-50 px-2 py-0.5 rounded-full text-green-800">
              {format(plantedDate, "MMM d, yyyy")}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium text-green-700">
              Expected Harvest:
            </span>
            <span className="bg-green-50 px-2 py-0.5 rounded-full text-green-800">
              {format(harvestDate, "MMM d, yyyy")}
            </span>
          </p>
          {careInfo.water && (
            <p className="flex items-center gap-2">
              <span className="font-medium text-green-700">Water:</span>
              <span className="text-gray-600">{careInfo.water}</span>
            </p>
          )}
          {careInfo.sun && (
            <p className="flex items-center gap-2">
              <span className="font-medium text-green-700">Sunlight:</span>
              <span className="text-gray-600">{careInfo.sun}</span>
            </p>
          )}
          {careInfo.spacing && (
            <p className="flex items-center gap-2">
              <span className="font-medium text-green-700">Spacing:</span>
              <span className="text-gray-600">{careInfo.spacing}</span>
            </p>
          )}
          {careInfo.tips && (
            <p className="flex items-center gap-2">
              <span className="font-medium text-green-700">Tips:</span>
              <span className="text-gray-600">{careInfo.tips}</span>
            </p>
          )}
        </div>
      </div>
    );
  };

  // Update the getGridDimensions function to be more robust
  const getGridDimensions = () => {
    const defaultDimensions = { width: 4, length: 4 };

    if (!garden?.layout?.beds?.[selectedBedIndex]) {
      console.log(
        "Missing garden structure, using defaults:",
        defaultDimensions
      );
      return defaultDimensions;
    }

    const bed = garden.layout.beds[selectedBedIndex];
    const width = parseInt(bed.width) || defaultDimensions.width;
    const length = parseInt(bed.length) || defaultDimensions.length;

    console.log("Using garden dimensions:", { width, length });
    return { width, length };
  };

  const handleRemovePlant = async (x, y, bedIndex) => {
    try {
      const updatedGarden = { ...garden };
      const bed = updatedGarden.layout.beds[bedIndex];

      // Find and remove the plant at the specified position
      bed.plants = bed.plants.filter(
        (plant) => !(plant.position.x === x && plant.position.y === y)
      );

      // Update the garden in the backend
      const response = await axios.patch(`/api/gardens/${id}`, updatedGarden, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      setGarden(response.data);
    } catch (err) {
      console.error("Error removing plant:", err);
      alert("Failed to remove plant. Please try again.");
    }
  };

  // Add new bed function
  const handleAddBed = async () => {
    try {
      const updatedGarden = { ...garden };
      const newBed = {
        width: parseInt(newBedDimensions.width),
        length: parseInt(newBedDimensions.length),
        plants: [],
      };

      updatedGarden.layout.beds = [...updatedGarden.layout.beds, newBed];

      const response = await axios.patch(`/api/gardens/${id}`, updatedGarden, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      setGarden(response.data);
      setSelectedBedIndex(updatedGarden.layout.beds.length - 1);
      setShowNewBedDialog(false);
      setNewBedDimensions({ width: 4, length: 4 }); // Reset dimensions
    } catch (err) {
      console.error("Error adding new bed:", err);
      alert("Failed to add new bed. Please try again.");
    }
  };

  // Remove bed function
  const handleRemoveBed = async (bedIndex) => {
    if (garden.layout.beds.length <= 1) {
      alert("Cannot remove the last bed.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to remove this bed and all its plants?"
      )
    ) {
      return;
    }

    try {
      const updatedGarden = { ...garden };
      updatedGarden.layout.beds = updatedGarden.layout.beds.filter(
        (_, index) => index !== bedIndex
      );

      const response = await axios.patch(`/api/gardens/${id}`, updatedGarden, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });

      setGarden(response.data);
      setSelectedBedIndex(Math.max(0, bedIndex - 1));
    } catch (err) {
      console.error("Error removing bed:", err);
      alert("Failed to remove bed. Please try again.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const plantsList = garden.layout.beds.reduce((acc, bed, bedIndex) => {
      bed.plants.forEach((plant) => {
        acc.push({
          ...plant,
          bed: bedIndex + 1,
          location: `(${plant.position.x + 1}, ${plant.position.y + 1})`,
        });
      });
      return acc;
    }, []);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${garden.name} - Garden Layout</title>
          <style>
            @media print {
              @page { margin: 1in; }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { color: #166534; margin-bottom: 1rem; }
            h2 { color: #166534; margin-top: 2rem; }
            .garden-info {
              margin-bottom: 2rem;
              padding: 1rem;
              background-color: #f0fdf4;
              border-radius: 8px;
            }
            .bed {
              margin-bottom: 2rem;
              padding: 1rem;
              border: 2px solid #166534;
              border-radius: 8px;
            }
            .bed-title {
              margin-bottom: 1rem;
              color: #166534;
            }
            .grid {
              display: grid;
              gap: 4px;
              margin-bottom: 1rem;
              border: 1px solid #166534;
              padding: 8px;
              background: #f0fdf4;
            }
            .plant-list {
              margin-top: 2rem;
            }
            .plant-item {
              margin-bottom: 0.5rem;
              padding: 0.5rem;
              background-color: #f0fdf4;
              border-radius: 4px;
            }
            .print-date {
              margin-top: 2rem;
              font-size: 0.8rem;
              color: #666;
              text-align: right;
            }
            @media print {
              .no-print { display: none; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px;">
            <button onclick="window.print()" style="padding: 8px 16px; background: #166534; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Garden Layout
            </button>
          </div>

          <h1>${garden.name}</h1>
          
          <div class="garden-info">
            <p><strong>Total Beds:</strong> ${garden.layout.beds.length}</p>
            <p><strong>Total Plants:</strong> ${plantsList.length}</p>
          </div>

          ${garden.layout.beds
            .map(
              (bed, bedIndex) => `
            <div class="bed">
              <h2 class="bed-title">Bed ${bedIndex + 1} (${bed.width} x ${
                bed.length
              })</h2>
              <div class="grid" style="grid-template-columns: repeat(${
                bed.width
              }, 1fr);">
                ${Array.from({ length: bed.width * bed.length })
                  .map((_, i) => {
                    const x = i % bed.width;
                    const y = Math.floor(i / bed.width);
                    const plant = bed.plants.find(
                      (p) => p.position.x === x && p.position.y === y
                    );
                    return `
                    <div style="padding: 8px; border: 1px solid #166534; text-align: center; background: white;">
                      ${
                        plant
                          ? `
                        <div style="font-size: 1.5rem;">${plant.emoji}</div>
                        <div style="font-size: 0.8rem;">${plant.plantName}</div>
                      `
                          : `(${x + 1}, ${y + 1})`
                      }
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
          `
            )
            .join("")}

          <div class="plant-list">
            <h2>Plants List</h2>
            ${plantsList
              .map(
                (plant) => `
              <div class="plant-item">
                <strong>${plant.emoji} ${plant.plantName}</strong> (Bed ${
                  plant.bed
                }, Position ${plant.location})
                <br>
                <small>
                  Planted: ${new Date(
                    plant.plantedDate
                  ).toLocaleDateString()} | 
                  Expected Harvest: ${new Date(
                    plant.harvestDate
                  ).toLocaleDateString()} | 
                  Days to Maturity: ${plant.daysToMaturity}
                </small>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="print-date">
            Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleEditPlant = async (x, y, bedIndex, newName) => {
    try {
      const updatedGarden = { ...garden };
      const bed = updatedGarden.layout.beds[bedIndex];
      const plantIndex = bed.plants.findIndex(
        (plant) => plant.position.x === x && plant.position.y === y
      );

      if (plantIndex !== -1) {
        bed.plants[plantIndex] = {
          ...bed.plants[plantIndex],
          plantName: newName,
        };

        const response = await axios.patch(
          `/api/gardens/${id}`,
          updatedGarden,
          {
            headers: {
              "x-auth-token": localStorage.getItem("token"),
              "Content-Type": "application/json",
            },
          }
        );

        setGarden(response.data);
        setEditingPlant(null);
      }
    } catch (err) {
      console.error("Error updating plant name:", err);
      alert("Failed to update plant name. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100/50 to-green-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Enhanced header with backdrop blur */}
        <div className="sticky top-0 z-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-white/80 backdrop-blur-lg border-b border-green-100 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              {garden?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Print Garden
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 sm:flex-none flex items-center justify-center text-green-700 hover:text-green-800 font-medium text-sm sm:text-base hover:bg-green-50 px-4 py-2 rounded-lg transition-colors duration-300"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced garden controls with glass effect */}
        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-green-100/50 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Garden Beds
            </h2>
            <button
              onClick={() => setShowNewBedDialog(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 transform group-hover:rotate-90 transition-transform duration-300"
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
          </div>

          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {garden?.layout?.beds.map((bed, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer p-4 rounded-xl transition-all duration-300 transform hover:scale-102 ${
                  selectedBedIndex === index
                    ? "bg-gradient-to-br from-green-100 to-green-50 border-2 border-green-500 shadow-md"
                    : "bg-white border-2 border-gray-100 hover:border-green-300 hover:shadow-md"
                }`}
                onClick={() => setSelectedBedIndex(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base sm:text-lg font-medium text-gray-800">
                    Bed {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full">
                    {bed.width} × {bed.length}
                  </span>
                </div>

                {garden.layout.beds.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBed(index);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-1.5 hover:bg-red-100 rounded-full"
                    title="Remove bed"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 transform hover:rotate-90 transition-transform duration-300"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Garden Grid */}
          <div className="lg:col-span-9 order-2 lg:order-1">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 sm:p-8 overflow-auto border border-green-100/50 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-6">
                Garden Layout
              </h2>
              {selectedPlantForPlacement && (
                <div className="mb-6 p-3 bg-gradient-to-r from-green-100 to-green-50 rounded-lg flex items-center gap-3 animate-fadeIn">
                  <span className="text-2xl transform hover:scale-110 transition-transform duration-300">
                    {selectedPlantForPlacement.emoji}
                  </span>
                  <span className="text-sm sm:text-base text-green-800">
                    Click any plot to place {selectedPlantForPlacement.name}
                  </span>
                  <button
                    onClick={() => setSelectedPlantForPlacement(null)}
                    className="ml-auto text-xs sm:text-sm text-green-700 hover:text-green-800 hover:bg-green-200/50 px-2 py-1 rounded-md transition-colors duration-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="grid grid-cols-1 gap-8">
                {garden?.layout?.beds.map((bed, bedIndex) => (
                  <div
                    key={bedIndex}
                    className="flex flex-col items-center w-full animate-fadeIn"
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <h3 className="text-base sm:text-lg font-medium text-gray-800">
                        Bed {bedIndex + 1}{" "}
                        <span className="text-sm text-gray-500 bg-gray-100/80 px-2 py-1 rounded-full ml-2">
                          {bed.width} × {bed.length}
                        </span>
                      </h3>
                    </div>
                    <div className="border-4 border-green-600/20 p-3 sm:p-6 w-full bg-gradient-to-br from-green-50 to-white rounded-xl shadow-inner overflow-auto hover:border-green-600/30 transition-colors duration-300">
                      <div
                        className="grid mx-auto"
                        style={{
                          gridTemplateColumns: `repeat(${bed.width}, minmax(0, 1fr))`,
                          gridTemplateRows: `repeat(${bed.length}, minmax(0, 1fr))`,
                          gap: "0.375rem",
                          padding: "0.375rem",
                          maxWidth: "100%",
                        }}
                      >
                        {Array.from({
                          length: bed.width * bed.length,
                        }).map((_, i) => {
                          const x = i % bed.width;
                          const y = Math.floor(i / bed.width);
                          const plantInSquare = bed.plants?.find(
                            (p) => p.position.x === x && p.position.y === y
                          );
                          const isHovered =
                            hoveredSquare === `${bedIndex}-${i}`;

                          return (
                            <div
                              key={i}
                              className={`aspect-square w-full relative cursor-pointer flex items-center justify-center transition-all duration-300 border-2 group rounded-lg ${
                                selectedPlantForPlacement || isDragging
                                  ? "border-green-400 hover:border-green-500"
                                  : "border-green-300"
                              } ${
                                isHovered
                                  ? "bg-green-100 scale-105 shadow-lg z-10"
                                  : "bg-white hover:bg-green-50"
                              }`}
                              onClick={() => handleSquareClick(i, bedIndex)}
                              onDragOver={(e) =>
                                handleDragOver(e, `${bedIndex}-${i}`)
                              }
                              onDrop={(e) => handleDrop(e, `${bedIndex}-${i}`)}
                              onDragEnter={() =>
                                setHoveredSquare(`${bedIndex}-${i}`)
                              }
                              onDragLeave={() => setHoveredSquare(null)}
                              onMouseEnter={() =>
                                !isDragging &&
                                setHoveredSquare(`${bedIndex}-${i}`)
                              }
                              onMouseLeave={() =>
                                !isDragging && setHoveredSquare(null)
                              }
                            >
                              {plantInSquare && (
                                <>
                                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingPlant({
                                          x,
                                          y,
                                          bedIndex,
                                          currentName: plantInSquare.plantName,
                                        });
                                      }}
                                      className="p-1.5 hover:bg-green-100 rounded-full z-10 transform hover:scale-110"
                                      title="Edit plant name"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 sm:h-4 sm:w-4 text-green-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemovePlant(x, y, bedIndex);
                                      }}
                                      className="p-1.5 hover:bg-red-100 rounded-full z-10 transform hover:rotate-90"
                                      title="Remove plant"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3 w-3 sm:h-4 sm:w-4 text-red-500"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="text-center transform transition-transform duration-300 group-hover:scale-110">
                                    <span className="text-2xl sm:text-4xl block mb-1">
                                      {plantInSquare.emoji}
                                    </span>
                                    {editingPlant?.x === x &&
                                    editingPlant?.y === y &&
                                    editingPlant?.bedIndex === bedIndex ? (
                                      <form
                                        onSubmit={(e) => {
                                          e.preventDefault();
                                          handleEditPlant(
                                            x,
                                            y,
                                            bedIndex,
                                            e.target.plantName.value
                                          );
                                        }}
                                        className="relative z-20"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <input
                                          name="plantName"
                                          type="text"
                                          defaultValue={
                                            editingPlant.currentName
                                          }
                                          className="w-full text-[10px] sm:text-xs px-1.5 py-0.5 rounded border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"
                                          autoFocus
                                          onBlur={(e) => {
                                            if (
                                              e.target.value !==
                                              editingPlant.currentName
                                            ) {
                                              handleEditPlant(
                                                x,
                                                y,
                                                bedIndex,
                                                e.target.value
                                              );
                                            } else {
                                              setEditingPlant(null);
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Escape") {
                                              setEditingPlant(null);
                                            }
                                          }}
                                        />
                                      </form>
                                    ) : (
                                      <div className="text-[10px] sm:text-xs font-medium bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                                        {plantInSquare.plantName}
                                      </div>
                                    )}
                                  </div>
                                  {isHovered && getPlantTooltip(plantInSquare)}
                                </>
                              )}
                              {!plantInSquare && (
                                <div className="text-[10px] sm:text-xs text-gray-400/80">
                                  ({x + 1}, {y + 1})
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Plant Selection */}
          <div className="lg:col-span-3 space-y-4 order-1 lg:order-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-lg p-6 lg:sticky lg:top-4 transition-all duration-300 border border-green-100/50 hover:shadow-xl">
              {/* Enhanced Tabs */}
              <div className="flex space-x-2 mb-6 border-b border-green-100 overflow-x-auto">
                <button
                  className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === "vegetables"
                      ? "text-green-600 border-b-2 border-green-500"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("vegetables")}
                >
                  Vegetables
                </button>
                <button
                  className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === "herbs"
                      ? "text-green-600 border-b-2 border-green-500"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("herbs")}
                >
                  Herbs
                </button>
                <button
                  className={`px-3 sm:px-4 py-2 font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === "fruits"
                      ? "text-green-600 border-b-2 border-green-500"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("fruits")}
                >
                  Fruits
                </button>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {Object.entries(
                  activeTab === "vegetables"
                    ? VEGETABLE_CATEGORIES
                    : activeTab === "herbs"
                    ? HERB_CATEGORIES
                    : FRUIT_CATEGORIES
                ).map(([category, plants]) => (
                  <div
                    key={category}
                    className="rounded-lg overflow-hidden border border-green-100/50 hover:border-green-200 transition-colors duration-300"
                  >
                    <button
                      className="w-full px-4 py-3 text-left bg-gradient-to-r from-green-50 to-transparent hover:from-green-100 flex justify-between items-center text-sm sm:text-base transition-colors duration-300"
                      onClick={() => toggleCategory(category)}
                    >
                      <span className="font-medium text-gray-800">
                        {category}
                      </span>
                      <span className="text-green-600 transform transition-transform duration-300">
                        {expandedCategories[category] ? "−" : "+"}
                      </span>
                    </button>
                    {expandedCategories[category] && (
                      <div className="p-2 space-y-1.5 animate-fadeIn">
                        {plants.map((plant) => (
                          <div
                            key={plant.name}
                            draggable
                            onClick={() => handlePlantClick(plant)}
                            onDragStart={(e) => handleDragStart(plant, e)}
                            onDragEnd={handleDragEnd}
                            className={`w-full text-left p-2.5 rounded-lg hover:bg-green-50 flex items-center space-x-3 cursor-pointer transition-all duration-300 group ${
                              selectedPlantForPlacement?.name === plant.name
                                ? "bg-green-100"
                                : "hover:shadow-sm"
                            }`}
                          >
                            <span className="text-xl sm:text-2xl transform group-hover:scale-110 transition-transform duration-300">
                              {plant.emoji}
                            </span>
                            <div>
                              <div className="font-medium text-sm sm:text-base text-gray-800">
                                {plant.name}
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-500">
                                {plant.daysToMaturity} days to maturity
                                {plant.type && (
                                  <span className="inline-flex items-center ml-2 px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                    {plant.type}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenPlanner;
