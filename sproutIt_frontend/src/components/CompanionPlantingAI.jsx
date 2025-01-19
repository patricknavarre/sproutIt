import React, { useState, useEffect } from "react";
import {
  calculateCompanionScore,
  getPlantRecommendations,
  calculateSuccessProbability,
} from "../utils/companionAI";

const CompanionPlantingAI = ({
  selectedPlant,
  availablePlants,
  companionData,
  bedDimensions,
  onLayoutGenerated,
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [successProbability, setSuccessProbability] = useState(0);
  const [isGeneratingLayout, setIsGeneratingLayout] = useState(false);

  useEffect(() => {
    if (selectedPlant && companionData) {
      const plantData = companionData[selectedPlant];
      if (plantData) {
        const recs = [];

        // Add good companions with benefits
        if (plantData.companions) {
          plantData.companions.forEach((companion) => {
            recs.push({
              plant: companion,
              score: 7,
              type: "good",
              benefits:
                plantData.benefits?.[companion] || "Compatible companion plant",
            });
          });
        }

        // Add plants to avoid with warnings
        if (plantData.avoid) {
          plantData.avoid.forEach((plant) => {
            recs.push({
              plant,
              score: -5,
              type: "bad",
              warning: "Not compatible - avoid planting together",
            });
          });
        }

        setRecommendations(recs);

        // Calculate success probability based on ratio of good to bad companions
        const goodCount = plantData.companions?.length || 0;
        const badCount = plantData.avoid?.length || 0;
        const probability = (goodCount / (goodCount + badCount)) * 100;
        setSuccessProbability(Math.round(probability));
      }
    }
  }, [selectedPlant, companionData]);

  const handleGenerateLayout = () => {
    setIsGeneratingLayout(true);
    // Generate optimal layout based on companion planting data
    const layout = generateOptimalLayout(
      selectedPlant,
      availablePlants,
      companionData,
      bedDimensions
    );
    onLayoutGenerated(layout);
    setIsGeneratingLayout(false);
  };

  const getScoreColor = (score) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-500";
    return "text-gray-600";
  };

  return (
    <div className="space-y-4">
      {/* Info Section */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <div className="flex items-start gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">How Companion Planting Works:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Green tags show beneficial relationships</li>
              <li>Red tags indicate plants to avoid</li>
              <li>Score indicates compatibility (+7 to -5)</li>
              <li>Success % shows overall garden harmony</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-800">
            Companion Planting AI
          </h3>
          <p className="text-xs text-gray-600">
            Selected:{" "}
            <span className="font-medium text-green-700">{selectedPlant}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
          <span className="text-xs text-gray-600">Garden Harmony:</span>
          <span
            className={`text-sm font-medium ${
              successProbability >= 75
                ? "text-green-600"
                : successProbability >= 50
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {successProbability}%
          </span>
        </div>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                rec.type === "good" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{rec.plant}</span>
                <span className={`${getScoreColor(rec.score)} font-semibold`}>
                  {rec.score > 0 ? "+" : ""}
                  {rec.score}
                </span>
              </div>
              <p
                className={`text-sm mt-1 ${
                  rec.type === "good" ? "text-green-600" : "text-red-500"
                }`}
              >
                {rec.benefits || rec.warning}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            No companion planting data available for this plant.
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanionPlantingAI;
