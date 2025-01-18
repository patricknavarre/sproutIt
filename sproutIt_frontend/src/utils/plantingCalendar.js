import { addWeeks, isBefore, isAfter, format } from "date-fns";

// Growing season data by zone
const ZONE_DATA = {
  1: { lastFrost: "06-01", firstFrost: "09-01" }, // Very short season
  2: { lastFrost: "05-15", firstFrost: "09-15" },
  3: { lastFrost: "05-15", firstFrost: "09-30" },
  4: { lastFrost: "05-01", firstFrost: "10-15" },
  5: { lastFrost: "04-15", firstFrost: "10-31" },
  6: { lastFrost: "04-01", firstFrost: "11-15" }, // Medium season
  7: { lastFrost: "03-15", firstFrost: "11-30" },
  8: { lastFrost: "03-01", firstFrost: "12-15" },
  9: { lastFrost: "02-15", firstFrost: "12-31" },
  10: { lastFrost: "01-31", firstFrost: "12-31" }, // Year-round growing
  11: { lastFrost: "01-31", firstFrost: "12-31" },
  12: { lastFrost: "01-31", firstFrost: "12-31" },
  13: { lastFrost: "01-31", firstFrost: "12-31" },
};

// Planting guidelines relative to last frost date
const PLANTING_GUIDELINES = {
  // Leafy Greens
  Lettuce: { weeks: -3, frost: "tolerant" },
  Spinach: { weeks: -4, frost: "tolerant" },
  Kale: { weeks: -4, frost: "tolerant" },
  "Swiss Chard": { weeks: -2, frost: "tolerant" },

  // Root Vegetables
  Carrots: { weeks: -3, frost: "tolerant" },
  Beets: { weeks: -4, frost: "tolerant" },
  Radishes: { weeks: -4, frost: "tolerant" },
  Turnips: { weeks: -3, frost: "tolerant" },

  // Nightshades
  Tomatoes: { weeks: 2, frost: "sensitive" },
  Peppers: { weeks: 2, frost: "sensitive" },
  Eggplant: { weeks: 2, frost: "sensitive" },

  // Brassicas
  Broccoli: { weeks: -4, frost: "tolerant" },
  Cauliflower: { weeks: -4, frost: "tolerant" },
  Cabbage: { weeks: -4, frost: "tolerant" },
  "Brussels Sprouts": { weeks: -4, frost: "tolerant" },

  // Legumes
  Peas: { weeks: -4, frost: "tolerant" },
  "Green Beans": { weeks: 1, frost: "sensitive" },

  // Cucurbits
  Cucumber: { weeks: 2, frost: "sensitive" },
  Zucchini: { weeks: 2, frost: "sensitive" },
  Pumpkin: { weeks: 2, frost: "sensitive" },
};

export const getPlantingDates = (plantName, zone) => {
  const currentYear = new Date().getFullYear();
  const zoneInfo = ZONE_DATA[zone];
  const plantInfo = PLANTING_GUIDELINES[plantName];

  if (!zoneInfo || !plantInfo) {
    return null;
  }

  // Parse frost dates for current year
  const lastFrost = new Date(`${currentYear}-${zoneInfo.lastFrost}`);
  const firstFrost = new Date(`${currentYear}-${zoneInfo.firstFrost}`);

  // Calculate recommended planting date
  const plantingDate = addWeeks(lastFrost, plantInfo.weeks);

  // Calculate if it's currently a good time to plant
  const now = new Date();
  const canPlantNow =
    plantInfo.frost === "tolerant"
      ? true // Frost tolerant plants can be planted anytime during growing season
      : isAfter(now, lastFrost) && isBefore(now, firstFrost);

  return {
    recommendedDate: format(plantingDate, "MMM d"),
    canPlantNow,
    frostTolerant: plantInfo.frost === "tolerant",
    lastFrostDate: format(lastFrost, "MMM d"),
    firstFrostDate: format(firstFrost, "MMM d"),
  };
};

export const getPlantingAdvice = (plantName, zone) => {
  const dates = getPlantingDates(plantName, zone);
  if (!dates) return "";

  const {
    recommendedDate,
    canPlantNow,
    frostTolerant,
    lastFrostDate,
    firstFrostDate,
  } = dates;

  if (canPlantNow) {
    return `✅ Good to plant now! Best time is around ${recommendedDate}.`;
  } else if (frostTolerant) {
    return `🌱 Plant around ${recommendedDate}. Frost tolerant!`;
  } else {
    return `⏳ Wait until after last frost (${lastFrostDate}) to plant.`;
  }
};
