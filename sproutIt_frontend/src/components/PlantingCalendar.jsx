import React, { useState, useEffect } from "react";
import { getPlantingDates, getPlantingAdvice } from "../utils/plantingCalendar";

const PlantingCalendar = ({ userZone }) => {
  const [selectedCategory, setSelectedCategory] = useState("Leafy Greens");
  const [plantingInfo, setPlantingInfo] = useState({});

  const categories = {
    "Leafy Greens": ["Lettuce", "Spinach", "Kale", "Swiss Chard"],
    "Root Vegetables": ["Carrots", "Beets", "Radishes", "Turnips"],
    Nightshades: ["Tomatoes", "Peppers", "Eggplant"],
    Brassicas: ["Broccoli", "Cauliflower", "Cabbage", "Brussels Sprouts"],
    Legumes: ["Peas", "Green Beans"],
    Cucurbits: ["Cucumber", "Zucchini", "Pumpkin"],
  };

  useEffect(() => {
    // Calculate planting info for selected category
    const info = {};
    categories[selectedCategory].forEach((plant) => {
      info[plant] = getPlantingDates(plant, userZone);
    });
    setPlantingInfo(info);
  }, [selectedCategory, userZone]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        Planting Calendar - Zone {userZone}
      </h2>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(categories).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Planting Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories[selectedCategory].map((plant) => {
          const info = plantingInfo[plant];
          if (!info) return null;

          return (
            <div
              key={plant}
              className={`p-4 rounded-lg border-2 
                ${
                  info.canPlantNow
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
            >
              <h3 className="font-bold text-lg text-gray-800 mb-2">{plant}</h3>
              <p className="text-gray-600 mb-2">
                {getPlantingAdvice(plant, userZone)}
              </p>
              <div className="text-sm text-gray-500">
                <p>Last Frost: {info.lastFrostDate}</p>
                <p>First Frost: {info.firstFrostDate}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlantingCalendar;
