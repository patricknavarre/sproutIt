import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RECIPE_DATABASE = {
  Tomatoes: [
    {
      name: "Fresh Garden Salsa",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "3 ripe tomatoes, diced",
        "1 onion, finely chopped",
        "2 jalapeños, seeded and minced",
        "1/4 cup fresh cilantro",
        "2 limes, juiced",
        "Salt to taste",
      ],
      instructions: [
        "Combine diced tomatoes, onion, and jalapeños in a bowl",
        "Add chopped cilantro",
        "Squeeze in lime juice",
        "Season with salt and mix well",
        "Let sit for 30 minutes before serving",
      ],
      tips: "Use different tomato varieties for unique flavors",
    },
    {
      name: "Homegrown Tomato Sauce",
      difficulty: "medium",
      prepTime: "45 mins",
      ingredients: [
        "6 ripe tomatoes, chopped",
        "3 cloves garlic, minced",
        "1 onion, diced",
        "2 tbsp olive oil",
        "Fresh basil",
        "Salt and pepper",
      ],
      instructions: [
        "Sauté onion and garlic in olive oil",
        "Add chopped tomatoes",
        "Simmer for 30-40 minutes",
        "Add fresh basil and seasonings",
        "Blend if desired",
      ],
      tips: "Great way to preserve excess tomatoes",
    },
    {
      name: "Caprese Salad",
      difficulty: "easy",
      prepTime: "10 mins",
      ingredients: [
        "4 ripe tomatoes, sliced",
        "Fresh mozzarella",
        "Fresh basil leaves",
        "Extra virgin olive oil",
        "Balsamic glaze",
        "Salt and pepper",
      ],
      instructions: [
        "Layer tomato and mozzarella slices",
        "Tuck basil leaves between layers",
        "Drizzle with olive oil and balsamic",
        "Season with salt and pepper",
      ],
      tips: "Use multicolored tomatoes for a beautiful presentation",
    },
  ],
  Peppers: [
    {
      name: "Stuffed Bell Peppers",
      difficulty: "medium",
      prepTime: "40 mins",
      ingredients: [
        "4 large bell peppers",
        "1 cup rice, cooked",
        "1 lb ground meat (optional)",
        "1 onion, diced",
        "2 cups tomato sauce",
        "Cheese for topping",
      ],
      instructions: [
        "Cut peppers in half and remove seeds",
        "Mix rice with cooked meat and seasonings",
        "Stuff peppers with mixture",
        "Top with sauce and cheese",
        "Bake at 350°F for 30 minutes",
      ],
      tips: "Works great with any color bell pepper",
    },
    {
      name: "Roasted Pepper Hummus",
      difficulty: "medium",
      prepTime: "30 mins",
      ingredients: [
        "2 red bell peppers",
        "2 cans chickpeas",
        "1/4 cup tahini",
        "3 cloves garlic",
        "Lemon juice",
        "Olive oil",
      ],
      instructions: [
        "Roast peppers until charred",
        "Peel and seed peppers",
        "Blend with remaining ingredients",
        "Season to taste",
      ],
      tips: "Roast extra peppers and freeze for later use",
    },
  ],
  Lettuce: [
    {
      name: "Garden Fresh Salad",
      difficulty: "easy",
      prepTime: "10 mins",
      ingredients: [
        "Fresh garden lettuce",
        "Cherry tomatoes",
        "Cucumber slices",
        "Red onion",
        "Your favorite dressing",
      ],
      instructions: [
        "Wash and tear lettuce into bite-sized pieces",
        "Add sliced vegetables",
        "Toss with dressing just before serving",
      ],
      tips: "Mix different lettuce varieties for texture",
    },
    {
      name: "Asian Lettuce Wraps",
      difficulty: "medium",
      prepTime: "25 mins",
      ingredients: [
        "Large lettuce leaves",
        "1 lb ground chicken",
        "Diced vegetables",
        "Hoisin sauce",
        "Soy sauce",
        "Ginger and garlic",
      ],
      instructions: [
        "Cook chicken with seasonings",
        "Add diced vegetables",
        "Serve in lettuce leaves",
        "Top with extra sauce",
      ],
      tips: "Use sturdy lettuce varieties like Romaine or Butter lettuce",
    },
  ],
  Cucumbers: [
    {
      name: "Quick Pickles",
      difficulty: "easy",
      prepTime: "20 mins",
      ingredients: [
        "4 cucumbers, sliced",
        "2 cups white vinegar",
        "2 cups water",
        "2 tbsp salt",
        "Dill and garlic to taste",
      ],
      instructions: [
        "Slice cucumbers evenly",
        "Combine vinegar, water, and salt",
        "Pack cucumbers in jars with dill and garlic",
        "Pour brine over cucumbers",
        "Refrigerate for 24 hours",
      ],
      tips: "Will keep in refrigerator for 2 weeks",
    },
    {
      name: "Greek Cucumber Salad",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "2 cucumbers, chopped",
        "Cherry tomatoes",
        "Red onion",
        "Feta cheese",
        "Kalamata olives",
        "Greek dressing",
      ],
      instructions: [
        "Chop cucumbers and tomatoes",
        "Slice red onion thinly",
        "Combine with olives and feta",
        "Dress and toss before serving",
      ],
      tips: "Remove cucumber seeds for a crunchier salad",
    },
  ],
  Carrots: [
    {
      name: "Honey Glazed Carrots",
      difficulty: "easy",
      prepTime: "20 mins",
      ingredients: [
        "1 lb fresh carrots",
        "3 tbsp honey",
        "2 tbsp butter",
        "Fresh thyme",
        "Salt and pepper",
      ],
      instructions: [
        "Cut carrots into even pieces",
        "Steam until tender-crisp",
        "Heat honey and butter",
        "Toss carrots in glaze",
        "Garnish with thyme",
      ],
      tips: "Try multicolored carrots for a beautiful presentation",
    },
    {
      name: "Carrot Ginger Soup",
      difficulty: "medium",
      prepTime: "35 mins",
      ingredients: [
        "6 large carrots",
        "1 onion",
        "Fresh ginger",
        "Vegetable broth",
        "Coconut milk",
        "Spices to taste",
      ],
      instructions: [
        "Sauté onion and ginger",
        "Add chopped carrots and broth",
        "Simmer until tender",
        "Blend until smooth",
        "Stir in coconut milk",
      ],
      tips: "Save carrot tops for garnish or pesto",
    },
  ],
  Herbs: [
    {
      name: "Garden Herb Pesto",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "2 cups fresh basil",
        "1/2 cup pine nuts",
        "2 cloves garlic",
        "1/2 cup olive oil",
        "Parmesan cheese",
        "Salt and pepper",
      ],
      instructions: [
        "Toast pine nuts lightly",
        "Blend herbs and garlic",
        "Add nuts and cheese",
        "Stream in olive oil",
        "Season to taste",
      ],
      tips: "Try mixing different herbs like basil, parsley, and mint",
    },
    {
      name: "Herb Infused Oil",
      difficulty: "easy",
      prepTime: "10 mins",
      ingredients: [
        "Fresh herbs (rosemary, thyme, etc.)",
        "2 cups olive oil",
        "Garlic (optional)",
        "Peppercorns (optional)",
      ],
      instructions: [
        "Clean and dry herbs thoroughly",
        "Place in clean bottle",
        "Cover with oil",
        "Let infuse for 1-2 weeks",
      ],
      tips: "Great for gifting or flavoring dishes",
    },
  ],
  Zucchini: [
    {
      name: "Zucchini Noodles",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "2-3 medium zucchini",
        "Olive oil",
        "Garlic",
        "Your favorite sauce",
        "Fresh herbs",
      ],
      instructions: [
        "Spiralize zucchini into noodles",
        "Heat oil and garlic",
        "Cook zucchini briefly",
        "Toss with sauce",
      ],
      tips: "Don't overcook - they should be al dente",
    },
    {
      name: "Zucchini Bread",
      difficulty: "medium",
      prepTime: "60 mins",
      ingredients: [
        "2 cups grated zucchini",
        "3 cups flour",
        "2 eggs",
        "1 cup sugar",
        "Cinnamon",
        "Nuts (optional)",
      ],
      instructions: [
        "Grate and drain zucchini",
        "Mix wet ingredients",
        "Combine with dry ingredients",
        "Bake at 350°F for 45 mins",
      ],
      tips: "Great way to use oversized zucchini",
    },
  ],
  Pumpkin: [
    {
      name: "Classic Pumpkin Pie",
      difficulty: "medium",
      prepTime: "90 mins",
      ingredients: [
        "2 cups pumpkin puree (fresh or canned)",
        "1 pie crust",
        "3/4 cup brown sugar",
        "2 large eggs",
        "1 cup heavy cream",
        "1 tbsp pumpkin pie spice",
        "1/2 tsp salt",
        "Whipped cream for serving",
      ],
      instructions: [
        "Preheat oven to 425°F",
        "If using fresh pumpkin, roast and puree until smooth",
        "Mix pumpkin puree with sugar, eggs, cream, and spices",
        "Pour into prepared pie crust",
        "Bake 15 mins at 425°F, then reduce to 350°F",
        "Continue baking 40-50 mins until set",
        "Cool completely before serving",
      ],
      tips: "For fresh puree, use sugar pumpkins or pie pumpkins - they're sweeter than carving pumpkins",
    },
    {
      name: "Roasted Pumpkin Seeds",
      difficulty: "easy",
      prepTime: "30 mins",
      ingredients: [
        "Fresh pumpkin seeds",
        "2 tbsp olive oil",
        "1 tsp salt",
        "Optional seasonings (garlic powder, paprika, etc.)",
      ],
      instructions: [
        "Clean seeds and remove pulp",
        "Rinse and dry thoroughly",
        "Toss with oil and seasonings",
        "Spread on baking sheet",
        "Roast at 350°F for 20-25 mins, stirring occasionally",
      ],
      tips: "Try different seasoning combinations - sweet, spicy, or savory all work great",
    },
    {
      name: "Creamy Pumpkin Soup",
      difficulty: "medium",
      prepTime: "45 mins",
      ingredients: [
        "4 cups pumpkin chunks",
        "1 onion, chopped",
        "2 cloves garlic",
        "4 cups vegetable broth",
        "1/2 cup heavy cream",
        "Nutmeg, cinnamon, salt, and pepper",
        "Pumpkin seeds for garnish",
      ],
      instructions: [
        "Sauté onion and garlic until soft",
        "Add pumpkin chunks and broth",
        "Simmer until pumpkin is tender",
        "Blend until smooth",
        "Stir in cream and spices",
        "Garnish with roasted pumpkin seeds",
      ],
      tips: "Save the seeds while preparing the pumpkin to make roasted pumpkin seeds for garnish",
    },
  ],
};

const RecipeSuggestions = () => {
  const navigate = useNavigate();
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100/50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Garden to Table Recipes
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-700 hover:text-green-800"
            >
              <span>← Back</span>
            </button>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Discover delicious recipes using vegetables from your garden. From
            simple salads to preserving techniques, make the most of your
            harvest.
          </p>
        </div>

        {/* Vegetable Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {Object.keys(RECIPE_DATABASE).map((vegetable) => (
            <button
              key={vegetable}
              onClick={() => {
                setSelectedVegetable(vegetable);
                setSelectedRecipe(null);
              }}
              className={`p-4 rounded-lg text-left transition-all ${
                selectedVegetable === vegetable
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-white border-2 border-transparent hover:border-green-200"
              }`}
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {vegetable}
              </h3>
              <p className="text-sm text-gray-600">
                {RECIPE_DATABASE[vegetable].length} recipes available
              </p>
            </button>
          ))}
        </div>

        {/* Recipe List */}
        {selectedVegetable && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recipes for {selectedVegetable}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECIPE_DATABASE[selectedVegetable].map((recipe) => (
                <div
                  key={recipe.name}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedRecipe(recipe)}
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center gap-1">
                        <span>🕒</span> {recipe.prepTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📊</span> {recipe.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {recipe.ingredients.length} ingredients
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedRecipe.name}
                  </h2>
                  <button
                    onClick={() => setSelectedRecipe(null)}
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
                  {/* Recipe Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span>🕒</span> {selectedRecipe.prepTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📊</span> {selectedRecipe.difficulty}
                    </span>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Ingredients
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      Instructions
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                      {selectedRecipe.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Tips */}
                  {selectedRecipe.tips && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-1">
                        Pro Tip
                      </h3>
                      <p className="text-green-700">{selectedRecipe.tips}</p>
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

export default RecipeSuggestions;
