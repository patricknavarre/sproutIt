import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  getPlantingDates,
  PLANTING_GUIDELINES,
} from "../utils/plantingCalendar";

const SEED_STARTING_GUIDE = {
  "Indoor Setup": {
    "Light Requirements": [
      "14-16 hours of light daily",
      "Keep lights 2-4 inches above seedlings",
      "Adjust height as plants grow",
    ],
    "Temperature Range": [
      "Most seeds germinate best at 65-75°F",
      "Use a heat mat for warm-season crops",
      "Maintain consistent temperatures",
    ],
    "Humidity Control": [
      "Cover containers until germination",
      "Remove covers gradually to harden off",
      "Maintain 60-70% humidity",
    ],
  },
  "Common Problems": {
    "Damping Off": [
      "Use sterile potting mix",
      "Provide good air circulation",
      "Avoid overwatering",
    ],
    "Leggy Seedlings": [
      "Ensure adequate light",
      "Maintain proper temperature",
      "Don't start too early",
    ],
    "Poor Germination": [
      "Check seed viability",
      "Maintain proper moisture",
      "Control temperature",
    ],
  },
};

// Group crops by type
const CROP_GROUPS = {
  "Leafy Greens": ["Lettuce", "Spinach", "Kale", "Swiss Chard"],
  "Root Vegetables": ["Carrots", "Beets", "Radishes", "Turnips"],
  Nightshades: ["Tomatoes", "Peppers", "Eggplant"],
  Brassicas: ["Broccoli", "Cauliflower", "Cabbage", "Brussels Sprouts"],
  Legumes: ["Peas", "Green Beans"],
  Cucurbits: ["Cucumber", "Zucchini", "Pumpkin"],
};

const CROP_ICONS = {
  "Leafy Greens": "🥬",
  "Root Vegetables": "🥕",
  Nightshades: "🍅",
  Brassicas: "🥦",
  Legumes: "🫘",
  Cucurbits: "🥒",
};

const SeedStartingScheduler = () => {
  const navigate = useNavigate();
  const [userZone, setUserZone] = useState(null);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [tempZone, setTempZone] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/auth/user");
        console.log("User data response:", response.data);
        console.log("Growing zone from response:", response.data.growingZone);
        if (response.data.growingZone) {
          setUserZone(response.data.growingZone);
          console.log("Setting user zone to:", response.data.growingZone);
        } else {
          console.log("No growing zone found in user data");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleCropToggle = (crop) => {
    console.log("Toggling crop:", crop);
    console.log("Current user zone:", userZone);
    console.log("Current selected crops:", selectedCrops);

    setSelectedCrops((prevSelected) => {
      const newSelection = prevSelected.includes(crop)
        ? prevSelected.filter((c) => c !== crop)
        : [...prevSelected, crop];

      console.log("New crop selection:", newSelection);
      if (userZone) {
        updateSchedule(newSelection);
      }
      return newSelection;
    });
  };

  const updateSchedule = (crops) => {
    console.log("Updating schedule for crops:", crops);
    console.log("Using growing zone:", userZone);

    if (!userZone) {
      console.log("No user zone available, cannot update schedule");
      return;
    }

    if (!crops || crops.length === 0) {
      console.log("No crops selected, setting empty schedule");
      setSchedule([]);
      return;
    }

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-11
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const newSchedule = crops.map((crop) => {
      const dates = getPlantingDates(crop, parseInt(userZone));
      console.log(`Planting dates for ${crop}:`, dates);

      // Parse the recommended date
      const [recommendedMonth, recommendedDay] =
        dates.recommendedDate.split(" ");
      const recommendedMonthIndex = months[recommendedMonth];

      // Calculate if we can plant now
      const canPlantNow =
        currentMonth === recommendedMonthIndex &&
        currentDate.getDate() >= parseInt(recommendedDay);

      return {
        crop,
        ...dates,
        canPlantNow,
      };
    });

    console.log("Setting new schedule:", newSchedule);
    setSchedule(
      newSchedule.sort((a, b) => {
        // Convert dates to comparable format (using current year)
        const [monthA, dayA] = a.recommendedDate.split(" ");
        const [monthB, dayB] = b.recommendedDate.split(" ");
        const dateA = new Date(currentYear, months[monthA], parseInt(dayA));
        const dateB = new Date(currentYear, months[monthB], parseInt(dayB));
        return dateA - dateB;
      })
    );
  };

  const handleNextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
      if (activeStep === 2) {
        setShowGuide(true);
      }
    }
  };

  const handlePreviousStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
      if (activeStep === 3) {
        setShowGuide(false);
      }
    }
  };

  const handleZoneSubmit = (e) => {
    e.preventDefault();
    const zoneNum = parseInt(tempZone);
    if (zoneNum >= 1 && zoneNum <= 13) {
      setUserZone(zoneNum);
      updateSchedule(selectedCrops);
      // Clear the input after successful submission
      setTempZone("");
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Step 1: Select Your Crops
            </h2>
            {Object.entries(CROP_GROUPS).map(([group, crops]) => (
              <div key={group} className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span>{CROP_ICONS[group]}</span>
                  {group}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {crops.map((crop) => (
                    <button
                      key={crop}
                      onClick={() => handleCropToggle(crop)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300
                        ${
                          selectedCrops.includes(crop)
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                    >
                      <div className="text-center">
                        <span className="text-lg">
                          {PLANTING_GUIDELINES[crop].frost === "tolerant"
                            ? "❄️"
                            : "🌡️"}
                        </span>
                        <p>{crop}</p>
                        <span className="text-xs text-gray-500">
                          {PLANTING_GUIDELINES[crop].frost === "tolerant"
                            ? "Frost Tolerant"
                            : "Frost Sensitive"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Step 2: Your Seed Starting Schedule
            </h2>
            {selectedCrops.length > 0 ? (
              <div className="space-y-4">
                {schedule.map(
                  ({
                    crop,
                    recommendedDate,
                    canPlantNow,
                    frostTolerant,
                    lastFrostDate,
                    firstFrostDate,
                  }) => (
                    <div
                      key={crop}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-300"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {Object.entries(CROP_GROUPS).find(([_, crops]) =>
                              crops.includes(crop)
                            )?.[0] &&
                              CROP_ICONS[
                                Object.entries(CROP_GROUPS).find(([_, crops]) =>
                                  crops.includes(crop)
                                )[0]
                              ]}
                          </span>
                          <h3 className="font-semibold text-gray-800">
                            {crop}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Start seeds: {recommendedDate}
                        </p>
                        <p className="text-xs text-gray-500">
                          Frost dates: {lastFrostDate} - {firstFrostDate}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {canPlantNow && (
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            🌱 Plant Now
                          </span>
                        )}
                        {frostTolerant && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            ❄️ Frost Tolerant
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-xl p-6">
                <p className="text-yellow-800">
                  Please select some crops in Step 1 to view your planting
                  schedule.
                </p>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Step 3: Indoor Seed Starting Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(SEED_STARTING_GUIDE).map(([section, topics]) => (
                <div key={section}>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {section}
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(topics).map(([topic, tips]) => (
                      <div key={topic} className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">
                          {topic}
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Seed Starting Scheduler
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-700 hover:text-green-800"
            >
              <span>← Back</span>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center w-full max-w-3xl">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex-1">
                  <div
                    className={`relative flex items-center ${
                      step < 3
                        ? 'after:content-[""] after:h-0.5 after:w-full after:bg-gray-200 after:absolute after:left-1/2'
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activeStep >= step
                          ? "bg-green-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {step}
                    </div>
                  </div>
                  <p className="text-sm text-center mt-2">
                    {step === 1
                      ? "Select Crops"
                      : step === 2
                      ? "View Schedule"
                      : "Get Growing Tips"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 max-w-3xl text-center mx-auto">
            Plan your seed starting schedule based on your growing zone and
            frost dates. Get personalized recommendations for when to start
            seeds indoors and transplant.
          </p>
        </div>

        {/* Updated Growing Zone Display */}
        <div className="mb-8 bg-green-50 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                {userZone ? (
                  <>
                    <span>Your Growing Zone: {userZone}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Zone {userZone}
                    </span>
                  </>
                ) : (
                  "Set Your Growing Zone"
                )}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {userZone
                  ? `We'll calculate your planting schedule based on Zone ${userZone}'s frost dates.`
                  : "Enter your USDA growing zone to get accurate planting recommendations."}
              </p>
              <a
                href="https://planthardiness.ars.usda.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 text-sm inline-flex items-center gap-1"
              >
                <span>Find your zone on the USDA map</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <form onSubmit={handleZoneSubmit} className="flex gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="13"
                  value={tempZone}
                  onChange={(e) => setTempZone(e.target.value)}
                  placeholder="Enter zone (1-13)"
                  className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                disabled={
                  !tempZone || parseInt(tempZone) < 1 || parseInt(tempZone) > 13
                }
              >
                Set Zone
              </button>
            </form>
          </div>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousStep}
            className={`px-6 py-3 rounded-lg transition-all duration-300 ${
              activeStep === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            disabled={activeStep === 1}
          >
            ← Previous Step
          </button>
          {activeStep < 3 && (
            <button
              onClick={handleNextStep}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeStep === 1 && selectedCrops.length === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
              disabled={activeStep === 1 && selectedCrops.length === 0}
            >
              Next Step →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeedStartingScheduler;
