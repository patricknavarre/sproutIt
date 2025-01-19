// AI-driven companion planting recommendation system

/**
 * Calculate companion planting score between two plants
 * @param {string} plant1 - First plant name
 * @param {string} plant2 - Second plant name
 * @param {Object} companionData - Existing companion planting data
 * @returns {number} Compatibility score (-10 to 10)
 */
export const calculateCompanionScore = (plant1, plant2, companionData) => {
  let score = 0;

  // Check direct companion relationship
  if (companionData[plant1]?.companions?.includes(plant2)) {
    score += 7;
  }

  // Check for mutual benefits
  const benefits = companionData[plant1]?.benefits?.[plant2];
  if (benefits) {
    score += 3;
  }

  // Check for negative relationships
  if (companionData[plant1]?.avoid?.includes(plant2)) {
    score -= 5;
  }

  return Math.max(-10, Math.min(10, score));
};

/**
 * Get recommended companions for a given plant
 * @param {string} plantName - Name of the plant
 * @param {Array} availablePlants - List of available plants
 * @param {Object} companionData - Existing companion planting data
 * @returns {Array} Sorted array of recommendations with scores
 */
export const getPlantRecommendations = (
  plantName,
  availablePlants,
  companionData
) => {
  if (!companionData[plantName]) return [];

  const recommendations = [];

  // Add companion plants with their benefits
  if (companionData[plantName].companions) {
    companionData[plantName].companions.forEach((companion) => {
      recommendations.push({
        name: companion,
        score: 7,
        benefits: companionData[plantName].benefits?.[companion] || [],
      });
    });
  }

  // Add plants to avoid
  if (companionData[plantName].avoid) {
    companionData[plantName].avoid.forEach((plant) => {
      recommendations.push({
        name: plant,
        score: -5,
        warnings: [`Avoid planting near ${plantName}`],
      });
    });
  }

  return recommendations.sort((a, b) => b.score - a.score);
};

/**
 * Calculate success probability for a plant combination
 * @param {Array} plants - Array of plant names
 * @param {Object} companionData - Companion planting data
 * @returns {number} Success probability (0-100)
 */
export const calculateSuccessProbability = (plants, companionData) => {
  if (plants.length < 2) return 100;

  let totalScore = 0;
  let comparisons = 0;

  // Calculate scores between all plant pairs
  for (let i = 0; i < plants.length; i++) {
    for (let j = i + 1; j < plants.length; j++) {
      totalScore += calculateCompanionScore(
        plants[i],
        plants[j],
        companionData
      );
      comparisons++;
    }
  }

  // Convert average score (-10 to 10) to probability (0-100)
  const averageScore = totalScore / comparisons;
  const probability = ((averageScore + 10) / 20) * 100;

  return Math.round(Math.max(0, Math.min(100, probability)));
};

/**
 * Generate an optimal garden layout based on companion planting data
 * @param {string} mainPlant - The primary plant to optimize around
 * @param {Array} availablePlants - List of available plants
 * @param {Object} companionData - Companion planting data
 * @param {Object} dimensions - Garden bed dimensions {width, length}
 * @returns {Array} Optimal layout with plant positions
 */
export const generateOptimalLayout = (
  mainPlant,
  availablePlants,
  companionData,
  dimensions
) => {
  const layout = [];
  const { width, length } = dimensions;
  const totalSquares = width * length;

  // Get recommendations for the main plant
  const recommendations = getPlantRecommendations(
    mainPlant,
    availablePlants,
    companionData
  );

  // Sort plants by compatibility score
  const sortedPlants = recommendations
    .filter((rec) => rec.score > 0)
    .sort((a, b) => b.score - a.score);

  // Place main plant in center
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(length / 2);
  layout.push({
    name: mainPlant,
    position: { x: centerX, y: centerY },
  });

  // Place companion plants in a spiral pattern around the main plant
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ]; // right, down, left, up
  let x = centerX;
  let y = centerY;
  let directionIndex = 0;
  let stepsInDirection = 1;
  let stepsTaken = 0;
  let plantIndex = 0;

  while (layout.length < totalSquares && plantIndex < sortedPlants.length) {
    const [dx, dy] = directions[directionIndex];
    x += dx;
    y += dy;
    stepsTaken++;

    // Check if position is within bounds
    if (x >= 0 && x < width && y >= 0 && y < length) {
      layout.push({
        name: sortedPlants[plantIndex].name,
        position: { x, y },
      });
      plantIndex++;
    }

    // Change direction when needed
    if (stepsTaken === stepsInDirection) {
      stepsTaken = 0;
      directionIndex = (directionIndex + 1) % 4;
      if (directionIndex % 2 === 0) {
        stepsInDirection++;
      }
    }
  }

  return layout;
};
