import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format, addDays } from "date-fns";
import CompanionPlantingAI from "../components/CompanionPlantingAI";

// Vegetable categories based on Johnny's Seeds
const VEGETABLE_CATEGORIES = {
  "Leafy Greens": [
    { name: "Lettuce", emoji: "🥬", daysToMaturity: 45 },
    { name: "Spinach", emoji: "🌿", daysToMaturity: 40 },
    { name: "Kale", emoji: "🥬", daysToMaturity: 50 },
    { name: "Swiss Chard", emoji: "🌿", daysToMaturity: 55 },
    { name: "Cabbage", emoji: "🥬", daysToMaturity: 65 },
  ],
  "Root Vegetables": [
    { name: "Carrots", emoji: "🥕", daysToMaturity: 70 },
    { name: "Beets", emoji: "🫐", daysToMaturity: 55 },
    { name: "Radishes", emoji: "🔴", daysToMaturity: 25 },
    { name: "Turnips", emoji: "⚪", daysToMaturity: 45 },
    { name: "Garlic", emoji: "🧄", daysToMaturity: 240 },
    { name: "Potatoes", emoji: "🥔", daysToMaturity: 90 },
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
    { name: "Squash", emoji: "🎃", daysToMaturity: 60 },
    { name: "Watermelon", emoji: "🍉", daysToMaturity: 85 },
  ],
  "Specialty Crops": [
    { name: "Asparagus", emoji: "🌿", daysToMaturity: 730 },
    { name: "Okra", emoji: "🌿", daysToMaturity: 60 },
    { name: "Corn", emoji: "🌽", daysToMaturity: 75 },
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
  Radishes: {
    water: "Keep soil consistently moist, about 1 inch per week",
    sun: "Full sun to partial shade",
    spacing: "2-3 inches apart, rows 12 inches apart",
    tips: "Harvest when roots are about 1 inch in diameter, thin seedlings early for best growth",
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

// Add companion planting data
const COMPANION_PLANTING = {
  // Leafy Greens
  Lettuce: {
    companions: [
      "Carrots",
      "Radishes",
      "Cucumber",
      "Strawberries",
      "Onions",
      "Beets",
    ],
    avoid: ["Broccoli", "Cabbage", "Parsley"],
    benefits: {
      Carrots: "Provides shade",
      Radishes: "Quick-growing companion",
      Cucumber: "Provides shade in summer",
      Strawberries: "Ground cover companion",
      Onions: "Deters pests",
      Beets: "Good use of space",
    },
  },
  // Remove duplicate Spinach entry and keep only one
  Spinach: {
    companions: ["Strawberries", "Peas", "Beans", "Onions", "Brassicas"],
    avoid: ["Potatoes"],
    benefits: {
      Strawberries: "Provides ground cover",
      Peas: "Fixes nitrogen in soil",
      Beans: "Fixes nitrogen in soil",
      Onions: "Deters pests",
      Brassicas: "Good space utilization",
    },
  },
  // Remove duplicate Beets entry and keep only one
  Beets: {
    companions: ["Onions", "Lettuce", "Cabbage", "Garlic"],
    avoid: ["Pole Beans", "Field Mustard"],
    benefits: {
      Onions: "Improves growth",
      Lettuce: "Good use of space",
      Cabbage: "Compatible growth patterns",
      Garlic: "Deters pests",
    },
  },
  Kale: {
    companions: ["Herbs", "Potatoes", "Onions", "Beets"],
    avoid: ["Strawberries", "Beans", "Tomatoes"],
    benefits: {
      Herbs: "Improves flavor and deters pests",
      Potatoes: "Good space utilization",
      Onions: "Deters pests",
      Beets: "Compatible root growth",
    },
  },
  // Root Vegetables
  Carrots: {
    companions: ["Tomatoes", "Onions", "Leeks", "Rosemary", "Sage", "Peas"],
    avoid: ["Dill", "Parsnips", "Celery"],
    benefits: {
      Tomatoes: "Tomatoes provide shade",
      Onions: "Deters carrot flies",
      Leeks: "Deters pests",
      Rosemary: "Improves growth and repels pests",
      Sage: "Repels carrot flies",
      Peas: "Fixes nitrogen in soil",
    },
  },
  // Nightshades
  Tomatoes: {
    companions: [
      "Basil",
      "Carrots",
      "Onions",
      "Marigolds",
      "Parsley",
      "Asparagus",
    ],
    avoid: ["Potatoes", "Cabbage", "Fennel", "Corn", "Dill"],
    benefits: {
      Basil: "Improves growth and flavor, repels pests",
      Carrots: "Breaks up soil for tomato roots",
      Onions: "Deters pests",
      Marigolds: "Repels nematodes and other pests",
      Parsley: "Attracts beneficial insects",
      Asparagus: "Provides nutrients tomatoes need",
    },
  },
  Peppers: {
    companions: ["Basil", "Onions", "Carrots", "Tomatoes"],
    avoid: ["Beans", "Cabbage", "Fennel"],
    benefits: {
      Basil: "Improves flavor and growth",
      Onions: "Deters pests",
      Carrots: "Good use of space",
      Tomatoes: "Similar growing conditions",
    },
  },
  // Brassicas
  Broccoli: {
    companions: ["Onions", "Garlic", "Potatoes", "Celery", "Chamomile"],
    avoid: ["Tomatoes", "Pole Beans", "Strawberries"],
    benefits: {
      Onions: "Deters pests",
      Garlic: "Repels cabbage worms",
      Potatoes: "Good space utilization",
      Celery: "Improves growth and flavor",
      Chamomile: "Improves flavor and growth",
    },
  },
  // Legumes
  "Green Beans": {
    companions: ["Carrots", "Corn", "Strawberries", "Cucumber", "Potatoes"],
    avoid: ["Onions", "Garlic", "Leeks", "Sunflowers"],
    benefits: {
      Carrots: "Fixes nitrogen for carrots",
      Corn: "Corn provides support for climbing",
      Strawberries: "Benefits from nitrogen fixing",
      Cucumber: "Provides ground cover",
      Potatoes: "Good companion when planted after potatoes",
    },
  },
  // Cucurbits
  Cucumber: {
    companions: ["Beans", "Corn", "Peas", "Radishes", "Sunflowers", "Dill"],
    avoid: ["Potatoes", "Sage", "Tomatoes"],
    benefits: {
      Beans: "Fixes nitrogen in soil",
      Corn: "Provides support and shade",
      Peas: "Fixes nitrogen in soil",
      Radishes: "Improves cucumber growth",
      Sunflowers: "Provides support and attracts pollinators",
      Dill: "Attracts beneficial insects",
    },
  },
  Zucchini: {
    companions: ["Nasturtiums", "Corn", "Beans", "Radishes", "Marigolds"],
    avoid: ["Potatoes"],
    benefits: {
      Nasturtiums: "Deters pests and improves growth",
      Corn: "Provides shade and wind protection",
      Beans: "Fixes nitrogen in soil",
      Radishes: "Deters pests",
      Marigolds: "Deters nematodes and other pests",
    },
  },
  Cabbage: {
    companions: ["Onions", "Garlic", "Herbs", "Celery", "Potatoes", "Beets"],
    avoid: ["Tomatoes", "Pole Beans", "Strawberries", "Peppers"],
    benefits: {
      Onions: "Deters cabbage pests",
      Garlic: "Repels cabbage worms and other pests",
      Herbs: "Many herbs improve flavor and deter pests",
      Celery: "Good space utilization",
      Potatoes: "Good companion when planted after potatoes",
      Beets: "Compatible root growth patterns",
    },
  },
  Corn: {
    companions: ["Beans", "Squash", "Pumpkins", "Cucumber", "Melons", "Peas"],
    avoid: ["Tomatoes", "Celery", "Brassicas"],
    benefits: {
      Beans: "Beans fix nitrogen for corn",
      Squash: "Provides ground cover and weed suppression",
      Pumpkins: "Provides ground cover and weed control",
      Cucumber: "Benefits from corn's shade and support",
      Melons: "Benefits from corn's shade and wind protection",
      Peas: "Fixes nitrogen in soil",
    },
  },
  Garlic: {
    companions: [
      "Beets",
      "Cabbage",
      "Carrots",
      "Tomatoes",
      "Peppers",
      "Spinach",
    ],
    avoid: ["Peas", "Beans", "Asparagus"],
    benefits: {
      Beets: "Improves growth and flavor",
      Cabbage: "Deters cabbage pests",
      Carrots: "Deters pests",
      Tomatoes: "Deters spider mites and other pests",
      Peppers: "Improves growth and deters pests",
      Spinach: "Good space utilization",
    },
  },
  Potatoes: {
    companions: ["Beans", "Corn", "Cabbage", "Horseradish", "Marigolds"],
    avoid: ["Tomatoes", "Cucumbers", "Squash", "Sunflowers", "Pumpkins"],
    benefits: {
      Beans: "Fixes nitrogen in soil",
      Corn: "Provides shade in hot weather",
      Cabbage: "Good companion when planted before cabbage",
      Horseradish: "Improves disease resistance",
      Marigolds: "Deters potato beetles",
    },
  },
  Squash: {
    companions: ["Corn", "Beans", "Radishes", "Marigolds", "Nasturtiums"],
    avoid: ["Potatoes", "Pumpkins"],
    benefits: {
      Corn: "Provides support and shade",
      Beans: "Fixes nitrogen in soil",
      Radishes: "Deters squash bugs",
      Marigolds: "Deters nematodes and other pests",
      Nasturtiums: "Deters squash bugs and improves growth",
    },
  },
  Watermelon: {
    companions: ["Corn", "Nasturtiums", "Radishes", "Marigolds", "Oregano"],
    avoid: ["Potatoes", "Herbs"],
    benefits: {
      Corn: "Provides wind protection and partial shade",
      Nasturtiums: "Deters pests and improves growth",
      Radishes: "Deters beetles",
      Marigolds: "Deters nematodes",
      Oregano: "Improves flavor and deters pests",
    },
  },
  Asparagus: {
    companions: ["Tomatoes", "Parsley", "Basil", "Marigolds", "Nasturtiums"],
    avoid: ["Garlic", "Onions", "Potatoes"],
    benefits: {
      Tomatoes: "Deters asparagus beetles",
      Parsley: "Provides nutrients asparagus needs",
      Basil: "Repels asparagus beetles",
      Marigolds: "Deters nematodes",
      Nasturtiums: "Provides ground cover and deters pests",
    },
  },
  Okra: {
    companions: ["Peppers", "Eggplant", "Basil", "Marigolds", "Sweet Potatoes"],
    avoid: ["Brassicas", "Fennel"],
    benefits: {
      Peppers: "Similar growing conditions",
      Eggplant: "Good space utilization",
      Basil: "Improves flavor and deters pests",
      Marigolds: "Deters nematodes",
      "Sweet Potatoes": "Good ground cover companion",
    },
  },
  Radishes: {
    companions: ["Lettuce", "Spinach", "Cucumber", "Beans", "Peas", "Carrots"],
    avoid: ["Cabbage", "Cauliflower", "Brussels Sprouts", "Turnips"],
    benefits: {
      Lettuce: "Radishes help break up soil for lettuce roots",
      Spinach: "Good space utilization, different root depths",
      Cucumber: "Radishes deter cucumber beetles",
      Beans: "Beans fix nitrogen that radishes need",
      Peas: "Peas fix nitrogen and provide ground cover",
      Carrots: "Radishes mark carrot rows and break up soil",
    },
  },
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
  const [showNewBedModal, setShowNewBedModal] = useState(false);
  const [newBedWidth, setNewBedWidth] = useState(4);
  const [newBedLength, setNewBedLength] = useState(8);
  const [editingPlant, setEditingPlant] = useState(null);
  const [selectedPlantForAI, setSelectedPlantForAI] = useState(null);
  const [availablePlants, setAvailablePlants] = useState([]);
  const [bedDimensions, setBedDimensions] = useState({ width: 4, length: 8 });
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  useEffect(() => {
    // Collect all plants from categories
    const plants = [];
    Object.values(VEGETABLE_CATEGORIES).forEach((category) => {
      category.forEach((plant) => plants.push(plant.name));
    });
    Object.values(HERB_CATEGORIES).forEach((category) => {
      category.forEach((plant) => plants.push(plant.name));
    });
    Object.values(FRUIT_CATEGORIES).forEach((category) => {
      category.forEach((plant) => plants.push(plant.name));
    });
    setAvailablePlants(plants);
  }, []);

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
    setSelectedPlant(plant.name);
  };

  const formatDateSafely = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date not set";
      }
      return format(date, "MMM d, yyyy");
    } catch (err) {
      return "Date not set";
    }
  };

  const getPlantTooltip = (plant) => {
    if (!plant) return null;

    const careInfo = PLANT_CARE_INFO[plant.plantName] || {};
    const companionInfo = COMPANION_PLANTING[plant.plantName];

    return (
      <div
        className="absolute transform transition-all duration-300 w-72 p-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-green-200 z-20 group-hover:opacity-100 [&:hover]:opacity-100 [&:hover]:z-30"
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

        {/* Companion Planting Information */}
        {companionInfo && (
          <div className="mt-3 space-y-2 text-sm border-t border-green-100 pt-2">
            {companionInfo.companions?.length > 0 && (
              <div className="text-green-600">
                <span className="font-medium">Good companions:</span>{" "}
                {companionInfo.companions.join(", ")}
              </div>
            )}
            {companionInfo.avoid?.length > 0 && (
              <div className="text-red-500">
                <span className="font-medium">Avoid planting near:</span>{" "}
                {companionInfo.avoid.join(", ")}
              </div>
            )}
          </div>
        )}

        {/* Care Information */}
        <div className="mt-3 space-y-2 text-sm border-t border-green-100 pt-2">
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

        {/* Dates */}
        <div className="mt-3 flex flex-wrap gap-2 border-t border-green-100 pt-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
            🌱 Planted: {formatDateSafely(plant.plantedDate)}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            🌾 Harvest: {formatDateSafely(plant.harvestDate)}
          </span>
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

  const handleAddBed = async () => {
    setShowNewBedModal(true);
  };

  const handleCreateBed = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
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

      const response = await axios.patch(
        `/api/gardens/${garden._id}`,
        updatedGarden,
        {
          headers: { "x-auth-token": token },
        }
      );

      setGarden(response.data);
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

  const getCompanionInfo = (plantName) => {
    const companionData = COMPANION_PLANTING[plantName];
    if (!companionData) return null;

    const nearbyPlants = getNearbyPlants(selectedBedIndex, selectedSquare);
    const goodCompanions = nearbyPlants.filter((p) =>
      companionData.companions.includes(p)
    );
    const badCompanions = nearbyPlants.filter((p) =>
      companionData.avoid.includes(p)
    );

    return {
      goodCompanions,
      badCompanions,
      benefits: goodCompanions
        .map((p) => companionData.benefits[p])
        .filter(Boolean),
    };
  };

  const getNearbyPlants = (bedIndex, squareIndex) => {
    const bed = garden.layout.beds[bedIndex];
    if (!bed) return [];

    const nearby = [];
    // Check adjacent squares (up, down, left, right)
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dx, dy] of directions) {
      const newX = (squareIndex % bed.width) + dx;
      const newY = Math.floor(squareIndex / bed.width) + dy;
      const newIndex = newY * bed.width + newX;

      if (newX >= 0 && newX < bed.width && newY >= 0 && newY < bed.length) {
        const plant = bed.plants.find((p) => p.position === newIndex);
        if (plant) nearby.push(plant.name);
      }
    }

    return nearby;
  };

  const renderSquare = (
    bedIndex,
    squareIndex,
    x,
    y,
    isHovered,
    plantInSquare
  ) => {
    return (
      <div
        key={squareIndex}
        className={`aspect-square w-full relative cursor-pointer flex items-center justify-center transition-all duration-300 border group rounded-md ${
          selectedPlantForPlacement || isDragging
            ? "border-green-400 hover:border-green-500"
            : "border-green-300"
        } ${
          isHovered
            ? "bg-green-100 scale-105 shadow-lg z-10"
            : "bg-white hover:bg-green-50"
        }`}
        onClick={() => handleSquareClick(squareIndex, bedIndex)}
        onDragOver={(e) => handleDragOver(e, `${bedIndex}-${squareIndex}`)}
        onDrop={(e) => handleDrop(e, `${bedIndex}-${squareIndex}`)}
        onDragEnter={() => setHoveredSquare(`${bedIndex}-${squareIndex}`)}
        onDragLeave={() => setHoveredSquare(null)}
        onMouseEnter={() =>
          !isDragging && setHoveredSquare(`${bedIndex}-${squareIndex}`)
        }
        onMouseLeave={() => !isDragging && setHoveredSquare(null)}
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
                  className="h-4 w-4 text-green-600"
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
                  className="h-4 w-4 text-red-500"
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
              <span className="text-2xl block mb-1">{plantInSquare.emoji}</span>
              {editingPlant?.x === x &&
              editingPlant?.y === y &&
              editingPlant?.bedIndex === bedIndex ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditPlant(x, y, bedIndex, e.target.plantName.value);
                  }}
                  className="relative z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    name="plantName"
                    type="text"
                    defaultValue={editingPlant.currentName}
                    className="w-full text-xs px-1.5 py-0.5 rounded border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none bg-white"
                    autoFocus
                    onBlur={(e) => {
                      if (e.target.value !== editingPlant.currentName) {
                        handleEditPlant(x, y, bedIndex, e.target.value);
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
                <div className="text-xs font-medium bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                  {plantInSquare.plantName}
                </div>
              )}
            </div>
            {isHovered && getPlantTooltip(plantInSquare)}
          </>
        )}
        {!plantInSquare && (
          <div className="text-xs text-gray-400/80">
            ({x + 1}, {y + 1})
          </div>
        )}
      </div>
    );
  };

  const getCurrentCategories = () => {
    switch (activeTab) {
      case "vegetables":
        return VEGETABLE_CATEGORIES;
      case "herbs":
        return HERB_CATEGORIES;
      case "fruits":
        return FRUIT_CATEGORIES;
      default:
        return VEGETABLE_CATEGORIES;
    }
  };

  const gridStyle = {
    gridTemplateColumns: `repeat(${getGridDimensions().width}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${getGridDimensions().length}, minmax(0, 1fr))`,
  };

  const renderGrid = () => {
    const { width, length } = getGridDimensions();
    const totalSquares = width * length;
    return Array.from({ length: totalSquares }).map((_, squareIndex) => {
      const x = squareIndex % width;
      const y = Math.floor(squareIndex / width);
      const isHovered = hoveredSquare === `${selectedBedIndex}-${squareIndex}`;
      const plantInSquare = getPlantInSquare(squareIndex);

      return renderSquare(
        selectedBedIndex,
        squareIndex,
        x,
        y,
        isHovered,
        plantInSquare
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-green-700 hover:text-green-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-green-700">
            {garden?.name || "Garden"}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Print Garden
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Garden Beds Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Garden Beds
              </h2>
              <button
                onClick={handleAddBed}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                <span>Add New Bed</span>
              </button>
            </div>
            <div className="flex gap-4 flex-wrap">
              {garden?.layout?.beds?.map((bed, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedBedIndex(index)}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedBedIndex === index
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-200"
                  }`}
                >
                  Bed {index + 1} ({bed.width}x{bed.length})
                </button>
              ))}
            </div>
          </div>

          {/* Garden Layout Section */}
          {selectedBedIndex !== null &&
            garden?.layout?.beds?.[selectedBedIndex] && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Garden Layout
                </h2>
                <div className="mb-2">
                  <h3 className="text-lg text-gray-700">
                    Bed {selectedBedIndex + 1} (
                    {garden.layout.beds[selectedBedIndex].width}x
                    {garden.layout.beds[selectedBedIndex].length})
                  </h3>
                </div>
                <div
                  className="grid gap-4 max-w-[1000px] mx-auto"
                  style={gridStyle}
                >
                  {renderGrid()}
                </div>
              </div>
            )}
        </div>

        {/* Right Sidebar - Hide on mobile */}
        {!isMobileView && (
          <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
            {/* Plant Selection Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "vegetables"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setActiveTab("vegetables")}
              >
                Vegetables
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "herbs"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setActiveTab("herbs")}
              >
                Herbs
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "fruits"
                    ? "text-green-600 border-b-2 border-green-500"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setActiveTab("fruits")}
              >
                Fruits
              </button>
            </div>

            {/* Plant Categories */}
            <div className="space-y-4">
              {Object.entries(getCurrentCategories()).map(
                ([category, plants]) => (
                  <div
                    key={category}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      <h3 className="text-sm font-medium text-gray-800">
                        {category}
                      </h3>
                      <button className="p-1 hover:bg-gray-100 rounded-full">
                        <span className="text-xl text-gray-500">
                          {expandedCategories[category] ? "−" : "+"}
                        </span>
                      </button>
                    </div>

                    {expandedCategories[category] && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {plants.map((plant) => (
                          <button
                            key={plant.name}
                            className={`text-left p-2 rounded-lg transition-colors ${
                              selectedPlant === plant.name
                                ? "bg-green-100"
                                : "hover:bg-green-50"
                            }`}
                            onClick={() => handlePlantClick(plant)}
                            draggable
                            onDragStart={(e) => handleDragStart(plant, e)}
                            onDragEnd={handleDragEnd}
                          >
                            <span className="mr-2">{plant.emoji}</span>
                            <span className="text-sm">{plant.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Mobile Plant Selection Menu */}
        {isMobileView && showMobileMenu && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[80vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">Select Plant</h3>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
              <div className="p-4">
                {/* Plant Selection Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  <button
                    className={`px-4 py-2 font-medium whitespace-nowrap ${
                      activeTab === "vegetables"
                        ? "text-green-600 border-b-2 border-green-500"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("vegetables")}
                  >
                    Vegetables
                  </button>
                  <button
                    className={`px-4 py-2 font-medium whitespace-nowrap ${
                      activeTab === "herbs"
                        ? "text-green-600 border-b-2 border-green-500"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("herbs")}
                  >
                    Herbs
                  </button>
                  <button
                    className={`px-4 py-2 font-medium whitespace-nowrap ${
                      activeTab === "fruits"
                        ? "text-green-600 border-b-2 border-green-500"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("fruits")}
                  >
                    Fruits
                  </button>
                </div>

                {/* Plant Categories */}
                <div className="space-y-4">
                  {Object.entries(getCurrentCategories()).map(
                    ([category, plants]) => (
                      <div
                        key={category}
                        className="border-b border-gray-100 pb-4 last:border-0"
                      >
                        <div
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => toggleCategory(category)}
                        >
                          <h3 className="text-sm font-medium text-gray-800">
                            {category}
                          </h3>
                          <button className="p-1 hover:bg-gray-100 rounded-full">
                            <span className="text-xl text-gray-500">
                              {expandedCategories[category] ? "−" : "+"}
                            </span>
                          </button>
                        </div>

                        {expandedCategories[category] && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {plants.map((plant) => (
                              <button
                                key={plant.name}
                                className={`text-left p-2 rounded-lg transition-colors ${
                                  selectedPlant === plant.name
                                    ? "bg-green-100"
                                    : "hover:bg-green-50"
                                }`}
                                onClick={() => {
                                  handlePlantClick(plant);
                                  setSelectedPlantForPlacement(plant);
                                  setShowMobileMenu(false);
                                }}
                              >
                                <span className="mr-2">{plant.emoji}</span>
                                <span className="text-sm">{plant.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Floating Action Button */}
        {isMobileView && !showMobileMenu && (
          <button
            onClick={() => setShowMobileMenu(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white z-50 hover:bg-green-700 active:transform active:scale-95 transition-all"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        )}

        {/* Selected Plant Indicator on Mobile */}
        {isMobileView && selectedPlantForPlacement && (
          <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-lg p-3 z-50 flex items-center gap-2">
            <span className="text-xl">{selectedPlantForPlacement.emoji}</span>
            <span className="font-medium">
              {selectedPlantForPlacement.name}
            </span>
            <button
              onClick={() => setSelectedPlantForPlacement(null)}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
        )}
      </div>

      {/* Add Bed Modal */}
      {showNewBedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Add New Garden Bed</h2>
            <div className="flex gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={newBedWidth}
                  onChange={(e) => setNewBedWidth(parseInt(e.target.value))}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  value={newBedLength}
                  onChange={(e) => setNewBedLength(parseInt(e.target.value))}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowNewBedModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBed}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Create Bed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GardenPlanner;
