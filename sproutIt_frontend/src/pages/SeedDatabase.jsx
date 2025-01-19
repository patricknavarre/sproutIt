import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SEED_DATABASE = {
  Tomatoes: {
    varieties: [
      {
        name: "Beefsteak",
        type: "Indeterminate",
        daysToMaturity: "80-90",
        seedViability: "4-5 years",
        plantingDepth: "1/4 inch",
        spacingInRow: "24-36 inches",
        rowSpacing: "4-5 feet",
        soilTemp: "70-80°F",
        seedStartIndoors: "6-8 weeks before last frost",
        directSow: "After all danger of frost",
        notes: "Heavy feeder, needs support",
        companionPlants: ["Basil", "Marigolds", "Carrots"],
        avoidPlanting: ["Potatoes", "Corn", "Brassicas"],
      },
      {
        name: "Cherry",
        type: "Indeterminate",
        daysToMaturity: "60-70",
        seedViability: "4-5 years",
        plantingDepth: "1/4 inch",
        spacingInRow: "24-36 inches",
        rowSpacing: "4-5 feet",
        soilTemp: "70-80°F",
        seedStartIndoors: "6-8 weeks before last frost",
        directSow: "After all danger of frost",
        notes: "Prolific producer, great for containers",
        companionPlants: ["Basil", "Marigolds", "Onions"],
        avoidPlanting: ["Potatoes", "Cabbage", "Fennel"],
      },
    ],
    generalCare:
      "Regular watering, support structures needed, prune suckers for better airflow",
  },
  Peppers: {
    varieties: [
      {
        name: "Bell Pepper",
        type: "Sweet",
        daysToMaturity: "70-80",
        seedViability: "2-3 years",
        plantingDepth: "1/4 inch",
        spacingInRow: "18-24 inches",
        rowSpacing: "2-3 feet",
        soilTemp: "70-85°F",
        seedStartIndoors: "8-10 weeks before last frost",
        directSow: "Not recommended in most regions",
        notes: "Need warm soil, benefit from calcium",
        companionPlants: ["Basil", "Onions", "Carrots"],
        avoidPlanting: ["Beans", "Brassicas"],
      },
    ],
    generalCare:
      "Even moisture, avoid overwatering, may need support as fruits develop",
  },
  Lettuce: {
    varieties: [
      {
        name: "Butterhead",
        type: "Head lettuce",
        daysToMaturity: "55-60",
        seedViability: "1 year",
        plantingDepth: "1/8 inch",
        spacingInRow: "6-8 inches",
        rowSpacing: "12-18 inches",
        soilTemp: "40-75°F",
        seedStartIndoors: "4-6 weeks before last frost",
        directSow: "As soon as soil can be worked",
        notes: "Succession plant every 2 weeks",
        companionPlants: ["Carrots", "Radishes", "Cucumbers"],
        avoidPlanting: ["Broccoli", "Cabbage"],
      },
    ],
    generalCare: "Keep soil moist, provide afternoon shade in hot weather",
  },
  Carrots: {
    varieties: [
      {
        name: "Nantes",
        type: "Root vegetable",
        daysToMaturity: "65-75",
        seedViability: "3 years",
        plantingDepth: "1/4 inch",
        spacingInRow: "2-3 inches",
        rowSpacing: "12-18 inches",
        soilTemp: "45-85°F",
        seedStartIndoors: "Not recommended",
        directSow: "2-3 weeks before last frost",
        notes:
          "Needs loose, well-draining soil. Thin seedlings to prevent crowding.",
        companionPlants: ["Tomatoes", "Onions", "Peas"],
        avoidPlanting: ["Dill", "Parsley", "Queen Anne's Lace"],
      },
      {
        name: "Danvers",
        type: "Root vegetable",
        daysToMaturity: "70-80",
        seedViability: "3 years",
        plantingDepth: "1/4 inch",
        spacingInRow: "2-3 inches",
        rowSpacing: "12-18 inches",
        soilTemp: "45-85°F",
        seedStartIndoors: "Not recommended",
        directSow: "2-3 weeks before last frost",
        notes: "Excellent storage variety, tolerates heavy soil",
        companionPlants: ["Rosemary", "Beans", "Leeks"],
        avoidPlanting: ["Dill", "Parsnips"],
      },
    ],
    generalCare:
      "Keep soil consistently moist, mulch to retain moisture and prevent green shoulders",
  },
  Cucumbers: {
    varieties: [
      {
        name: "Straight Eight",
        type: "Slicing",
        daysToMaturity: "55-65",
        seedViability: "5 years",
        plantingDepth: "1 inch",
        spacingInRow: "12 inches",
        rowSpacing: "5-6 feet",
        soilTemp: "70-95°F",
        seedStartIndoors: "3-4 weeks before last frost",
        directSow: "1-2 weeks after last frost",
        notes:
          "Trellising recommended for straight fruits and disease prevention",
        companionPlants: ["Corn", "Peas", "Radishes"],
        avoidPlanting: ["Potatoes", "Aromatic Herbs"],
      },
      {
        name: "Boston Pickling",
        type: "Pickling",
        daysToMaturity: "50-60",
        seedViability: "5 years",
        plantingDepth: "1 inch",
        spacingInRow: "12 inches",
        rowSpacing: "5-6 feet",
        soilTemp: "70-95°F",
        seedStartIndoors: "3-4 weeks before last frost",
        directSow: "1-2 weeks after last frost",
        notes: "Ideal for pickling, harvest when 2-6 inches long",
        companionPlants: ["Sunflowers", "Beans", "Marigolds"],
        avoidPlanting: ["Potatoes", "Melons"],
      },
    ],
    generalCare:
      "Regular watering, especially during flowering and fruiting. Mulch to retain moisture and prevent soil-borne diseases.",
  },
  Beans: {
    varieties: [
      {
        name: "Blue Lake Bush",
        type: "Bush Bean",
        daysToMaturity: "55-65",
        seedViability: "3 years",
        plantingDepth: "1 inch",
        spacingInRow: "4-6 inches",
        rowSpacing: "18-24 inches",
        soilTemp: "65-85°F",
        seedStartIndoors: "Not recommended",
        directSow: "After all danger of frost",
        notes: "Productive bush variety, good for freezing and canning",
        companionPlants: ["Carrots", "Corn", "Potatoes"],
        avoidPlanting: ["Onions", "Garlic", "Sunflowers"],
      },
      {
        name: "Kentucky Wonder",
        type: "Pole Bean",
        daysToMaturity: "65-75",
        seedViability: "3 years",
        plantingDepth: "1 inch",
        spacingInRow: "4-6 inches",
        rowSpacing: "30-36 inches",
        soilTemp: "65-85°F",
        seedStartIndoors: "Not recommended",
        directSow: "After all danger of frost",
        notes: "Classic pole variety, needs strong support",
        companionPlants: ["Corn", "Sunflowers", "Nasturtiums"],
        avoidPlanting: ["Onions", "Beets", "Garlic"],
      },
    ],
    generalCare:
      "Do not overwater, avoid working with wet plants to prevent disease spread",
  },
  Pumpkins: {
    varieties: [
      {
        name: "Sugar Pie",
        type: "Pie Pumpkin",
        daysToMaturity: "100-110",
        seedViability: "4 years",
        plantingDepth: "1 inch",
        spacingInRow: "4-6 feet",
        rowSpacing: "6-8 feet",
        soilTemp: "70-95°F",
        seedStartIndoors: "3-4 weeks before last frost",
        directSow: "After soil warms and frost danger passes",
        notes: "Sweet flesh perfect for pies, manageable size",
        companionPlants: ["Corn", "Beans", "Radishes"],
        avoidPlanting: ["Potatoes", "Brassicas"],
      },
      {
        name: "Jack O'Lantern",
        type: "Carving Pumpkin",
        daysToMaturity: "95-100",
        seedViability: "4 years",
        plantingDepth: "1 inch",
        spacingInRow: "5-6 feet",
        rowSpacing: "6-8 feet",
        soilTemp: "70-95°F",
        seedStartIndoors: "3-4 weeks before last frost",
        directSow: "After soil warms and frost danger passes",
        notes: "Classic carving pumpkin, strong stems",
        companionPlants: ["Corn", "Marigolds", "Nasturtiums"],
        avoidPlanting: ["Potatoes", "Root Vegetables"],
      },
    ],
    generalCare:
      "Heavy feeders, need lots of space and consistent moisture. Protect from squash vine borers.",
  },
};

const GROWING_ZONES = {
  "1-2": {
    lastFrostDate: "June 1-15",
    firstFrostDate: "August 15-31",
    notes: "Very short growing season",
  },
  "3-4": {
    lastFrostDate: "May 15-31",
    firstFrostDate: "September 15-30",
    notes: "Short growing season",
  },
  "5-6": {
    lastFrostDate: "April 15-30",
    firstFrostDate: "October 15-31",
    notes: "Average growing season",
  },
  "7-8": {
    lastFrostDate: "March 15-30",
    firstFrostDate: "November 15-30",
    notes: "Long growing season",
  },
  "9-10": {
    lastFrostDate: "Year-round",
    firstFrostDate: "None",
    notes: "Year-round growing possible",
  },
};

const getPlantingDates = (zone, seedStartIndoors, directSow) => {
  const zoneData = GROWING_ZONES[zone];
  if (!zoneData) return null;

  const getDateFromDescription = (baseDate, offsetDescription) => {
    if (!offsetDescription || !baseDate) return null;

    const weekMatch = offsetDescription.match(
      /(\d+)-?(\d+)? weeks? (before|after)/
    );
    if (!weekMatch) return null;

    const weeks = weekMatch[2]
      ? Math.floor((parseInt(weekMatch[1]) + parseInt(weekMatch[2])) / 2)
      : parseInt(weekMatch[1]);
    const isBefore = weekMatch[3] === "before";

    const [month, day] = baseDate.split("-").map((num) => parseInt(num));
    const date = new Date(new Date().getFullYear(), month - 1, day);

    if (isBefore) {
      date.setDate(date.getDate() - weeks * 7);
    } else {
      date.setDate(date.getDate() + weeks * 7);
    }

    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  };

  const lastFrostDate = zoneData.lastFrostDate.split("-")[0]; // Use first date of range

  return {
    indoorStart: getDateFromDescription(lastFrostDate, seedStartIndoors),
    outdoorStart: getDateFromDescription(lastFrostDate, directSow),
    lastFrost: zoneData.lastFrostDate,
    firstFrost: zoneData.firstFrostDate,
  };
};

const SeedDatabase = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedZone, setSelectedZone] = useState("");
  const [inventory, setInventory] = useState({});
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [showPlantingCalendar, setShowPlantingCalendar] = useState(false);

  useEffect(() => {
    // Load saved inventory from localStorage
    const savedInventory = localStorage.getItem("seedInventory");
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  const updateInventory = (type, variety, count) => {
    const newInventory = {
      ...inventory,
      [type]: {
        ...inventory[type],
        [variety]: count,
      },
    };
    setInventory(newInventory);
    localStorage.setItem("seedInventory", JSON.stringify(newInventory));
  };

  const filteredSeeds = Object.entries(SEED_DATABASE).filter(([type, data]) => {
    const matchesSearch =
      type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data.varieties.some((v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesType = selectedType === "All" || type === selectedType;
    return matchesSearch && matchesType;
  });

  const plantingDates =
    selectedSeed && selectedZone
      ? getPlantingDates(
          selectedZone,
          selectedSeed.seedStartIndoors,
          selectedSeed.directSow
        )
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Seed Database & Planner
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-700 hover:text-green-800"
            >
              <span>← Back</span>
            </button>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Search our comprehensive seed database, track your inventory, and
            get detailed planting instructions for your growing zone.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search seeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="All">All Types</option>
            {Object.keys(SEED_DATABASE).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select Growing Zone</option>
            {Object.keys(GROWING_ZONES).map((zone) => (
              <option key={zone} value={zone}>
                Zone {zone}
              </option>
            ))}
          </select>
        </div>

        {/* Zone Information */}
        {selectedZone && (
          <div className="mb-8 bg-green-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Growing Zone {selectedZone}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Frost Dates</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>
                    Last Frost: {GROWING_ZONES[selectedZone].lastFrostDate}
                  </li>
                  <li>
                    First Frost: {GROWING_ZONES[selectedZone].firstFrostDate}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Season Notes</h3>
                <p className="text-sm text-gray-600">
                  {GROWING_ZONES[selectedZone].notes}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Seed List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSeeds.map(([type, data]) =>
            data.varieties.map((variety) => (
              <div
                key={`${type}-${variety.name}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {variety.name}
                    </h3>
                    <p className="text-sm text-gray-600">{type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateInventory(
                          type,
                          variety.name,
                          (inventory[type]?.[variety.name] || 0) - 1
                        )
                      }
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">
                      {inventory[type]?.[variety.name] || 0}
                    </span>
                    <button
                      onClick={() =>
                        updateInventory(
                          type,
                          variety.name,
                          (inventory[type]?.[variety.name] || 0) + 1
                        )
                      }
                      className="p-1 text-green-500 hover:bg-green-50 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Days to Maturity: {variety.daysToMaturity}</p>
                  <p>Seed Viability: {variety.seedViability}</p>
                  <button
                    onClick={() => setSelectedSeed({ type, ...variety })}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Seed Detail Modal */}
        {selectedSeed && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedSeed.name}
                    </h2>
                    <p className="text-gray-600">{selectedSeed.type}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSeed(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
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

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Planting Details</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>Days to Maturity: {selectedSeed.daysToMaturity}</li>
                        <li>Seed Viability: {selectedSeed.seedViability}</li>
                        <li>Planting Depth: {selectedSeed.plantingDepth}</li>
                        <li>Spacing: {selectedSeed.spacingInRow}</li>
                        <li>Row Spacing: {selectedSeed.rowSpacing}</li>
                        <li>Soil Temperature: {selectedSeed.soilTemp}</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Timing</h3>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>Start Indoors: {selectedSeed.seedStartIndoors}</li>
                        <li>Direct Sow: {selectedSeed.directSow}</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Companion Planting</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-600">
                          Good Companions:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {selectedSeed.companionPlants.map((plant) => (
                            <li key={plant}>{plant}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600">
                          Avoid Planting With:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {selectedSeed.avoidPlanting.map((plant) => (
                            <li key={plant}>{plant}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Growing Notes</h3>
                    <p className="text-sm text-gray-700">
                      {selectedSeed.notes}
                    </p>
                  </div>

                  {/* Planting Calendar */}
                  {selectedZone && plantingDates && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Planting Calendar</h3>
                      <div className="space-y-2 text-sm">
                        {plantingDates.indoorStart && (
                          <p>
                            <span className="font-medium">Start Indoors:</span>{" "}
                            {plantingDates.indoorStart}
                          </p>
                        )}
                        {plantingDates.outdoorStart && (
                          <p>
                            <span className="font-medium">
                              Direct Sow/Transplant:
                            </span>{" "}
                            {plantingDates.outdoorStart}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Based on your zone's last frost date:{" "}
                          {plantingDates.lastFrost}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeedDatabase;
