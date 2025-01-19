/**
 * @license MIT
 * @copyright (c) 2024 Patrick Navarre
 *
 * SproutIt Recipe Suggestions Component
 *
 * This component provides recipe suggestions based on vegetables currently growing in the user's garden.
 * It includes a comprehensive recipe database and dynamic filtering based on garden contents.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * @version 1.0.0
 * @author Patrick Navarre
 * @description A React component that provides recipe suggestions based on garden contents
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

/**
 * Recipe database containing detailed recipes for various vegetables
 * Each recipe includes:
 * - name: String - The name of the recipe
 * - difficulty: String - Easy/Medium/Hard difficulty rating
 * - prepTime: String - Preparation time
 * - ingredients: Array<String> - List of required ingredients
 * - instructions: Array<String> - Step-by-step cooking instructions
 * - tips: String (optional) - Helpful tips for best results
 */
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
      name: "Grilled Zucchini",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "2 medium zucchini",
        "2 tbsp olive oil",
        "2 cloves garlic, minced",
        "Italian herbs",
        "Salt and pepper",
      ],
      instructions: [
        "Slice zucchini lengthwise",
        "Brush with olive oil and garlic",
        "Season with herbs and salt",
        "Grill until tender with nice marks",
      ],
      tips: "Don't overcook - they should still have some bite",
    },
    {
      name: "Zucchini Bread",
      difficulty: "medium",
      prepTime: "1 hour",
      ingredients: [
        "2 cups grated zucchini",
        "3 cups flour",
        "2 eggs",
        "1 cup sugar",
        "1/2 cup oil",
        "Cinnamon and nutmeg",
      ],
      instructions: [
        "Grate and drain zucchini",
        "Mix wet and dry ingredients separately",
        "Combine and fold in zucchini",
        "Bake at 350°F for 50-60 minutes",
      ],
      tips: "Squeeze excess moisture from zucchini before adding",
    },
    {
      name: "Zucchini Noodles with Pesto",
      difficulty: "easy",
      prepTime: "20 mins",
      ingredients: [
        "3 medium zucchini",
        "1/2 cup pesto",
        "Cherry tomatoes",
        "Pine nuts",
        "Parmesan cheese",
      ],
      instructions: [
        "Spiralize zucchini into noodles",
        "Toss with fresh pesto",
        "Add halved tomatoes",
        "Top with pine nuts and cheese",
      ],
      tips: "Don't cook the noodles - serve fresh for best texture",
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
  "Green Beans": [
    {
      name: "Garlic Parmesan Green Beans",
      ingredients: [
        "1 lb fresh green beans, trimmed",
        "3 cloves garlic, minced",
        "2 tbsp olive oil",
        "1/4 cup grated Parmesan cheese",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Steam green beans until tender-crisp, about 5 minutes",
        "Heat olive oil in a large skillet over medium heat",
        "Add garlic and sauté until fragrant",
        "Add green beans and toss to coat",
        "Season with salt and pepper",
        "Sprinkle with Parmesan cheese before serving",
      ],
      difficulty: "Easy",
      prepTime: "20 minutes",
    },
    {
      name: "Asian-Style Green Beans",
      ingredients: [
        "1 lb green beans",
        "2 tbsp soy sauce",
        "1 tbsp sesame oil",
        "2 cloves garlic, minced",
        "1 tbsp ginger, minced",
        "Sesame seeds for garnish",
      ],
      instructions: [
        "Blanch green beans in boiling water for 3 minutes",
        "Heat sesame oil in a wok or large skillet",
        "Add garlic and ginger, stir-fry until fragrant",
        "Add green beans and soy sauce",
        "Stir-fry until beans are coated and heated through",
        "Garnish with sesame seeds",
      ],
      difficulty: "Easy",
      prepTime: "15 minutes",
    },
  ],
  "Brussels Sprouts": [
    {
      name: "Roasted Honey Balsamic Brussels Sprouts",
      ingredients: [
        "1 lb Brussels sprouts, halved",
        "2 tbsp olive oil",
        "2 tbsp balsamic vinegar",
        "1 tbsp honey",
        "Salt and pepper to taste",
        "Optional: chopped bacon",
      ],
      instructions: [
        "Preheat oven to 400°F",
        "Toss Brussels sprouts with olive oil, salt, and pepper",
        "Roast for 20-25 minutes until crispy on outside",
        "Whisk together balsamic vinegar and honey",
        "Drizzle over roasted sprouts",
        "Add bacon if desired",
      ],
      difficulty: "Easy",
      prepTime: "30 minutes",
    },
    {
      name: "Shaved Brussels Sprout Salad",
      ingredients: [
        "1 lb Brussels sprouts, shaved thin",
        "1/4 cup dried cranberries",
        "1/4 cup toasted almonds",
        "1/4 cup Parmesan cheese",
        "Lemon vinaigrette",
      ],
      instructions: [
        "Shave Brussels sprouts thinly using a mandoline or knife",
        "Make vinaigrette with lemon juice, olive oil, and seasonings",
        "Toss shaved sprouts with vinaigrette",
        "Add cranberries and almonds",
        "Top with shaved Parmesan",
      ],
      difficulty: "Medium",
      prepTime: "20 minutes",
    },
  ],
  Peas: [
    {
      name: "Minted Fresh Peas",
      ingredients: [
        "2 cups fresh peas",
        "2 tbsp butter",
        "2 tbsp fresh mint, chopped",
        "Salt and pepper to taste",
        "1 tsp lemon zest",
      ],
      instructions: [
        "Shell fresh peas if needed",
        "Boil peas for 3-4 minutes until tender",
        "Drain and return to pan",
        "Add butter, mint, and lemon zest",
        "Season with salt and pepper",
      ],
      difficulty: "Easy",
      prepTime: "15 minutes",
    },
    {
      name: "Pea and Prosciutto Pasta",
      ingredients: [
        "2 cups fresh peas",
        "8 oz pasta",
        "4 oz prosciutto, torn",
        "1/2 cup cream",
        "Parmesan cheese",
        "Fresh herbs",
      ],
      instructions: [
        "Cook pasta according to package directions",
        "Add peas in last 3 minutes of cooking",
        "In a separate pan, crisp prosciutto",
        "Add cream and simmer",
        "Toss with pasta and peas",
        "Top with Parmesan and herbs",
      ],
      difficulty: "Medium",
      prepTime: "25 minutes",
    },
  ],
  Broccoli: [
    {
      name: "Roasted Garlic Broccoli",
      difficulty: "easy",
      prepTime: "25 mins",
      ingredients: [
        "2 heads broccoli, cut into florets",
        "4 cloves garlic, minced",
        "3 tbsp olive oil",
        "Salt and pepper to taste",
        "1 lemon",
        "Parmesan cheese (optional)",
      ],
      instructions: [
        "Preheat oven to 400°F",
        "Toss broccoli with olive oil, garlic, salt, and pepper",
        "Spread on baking sheet",
        "Roast for 15-20 minutes until crispy",
        "Squeeze lemon juice over top",
        "Sprinkle with Parmesan if desired",
      ],
      tips: "For extra crispy broccoli, make sure florets are completely dry before roasting",
    },
    {
      name: "Broccoli Cheese Soup",
      difficulty: "medium",
      prepTime: "40 mins",
      ingredients: [
        "4 cups fresh broccoli florets",
        "1 onion, diced",
        "2 carrots, diced",
        "4 cups vegetable broth",
        "2 cups milk",
        "2 cups shredded cheddar",
        "1/4 cup flour",
        "Seasonings to taste",
      ],
      instructions: [
        "Sauté onion and carrots until soft",
        "Add flour and cook for 1 minute",
        "Gradually add broth and milk, stirring constantly",
        "Add broccoli and simmer until tender",
        "Stir in cheese until melted",
        "Season to taste",
      ],
      tips: "Use freshly grated cheese for the smoothest soup",
    },
  ],
  Cauliflower: [
    {
      name: "Cauliflower Wings",
      difficulty: "medium",
      prepTime: "45 mins",
      ingredients: [
        "1 head cauliflower, cut into florets",
        "1 cup flour",
        "1 cup milk (or plant-based milk)",
        "1 tsp garlic powder",
        "1 tsp paprika",
        "Hot sauce",
        "Butter",
      ],
      instructions: [
        "Preheat oven to 450°F",
        "Mix flour, milk, and seasonings for batter",
        "Dip cauliflower in batter",
        "Bake for 20 minutes",
        "Toss in hot sauce and butter mixture",
        "Bake additional 10 minutes",
      ],
      tips: "For extra crispy wings, don't crowd the baking sheet",
    },
    {
      name: "Cauliflower Rice Stir-Fry",
      difficulty: "easy",
      prepTime: "20 mins",
      ingredients: [
        "1 head cauliflower, riced",
        "2 eggs",
        "1 cup mixed vegetables",
        "3 cloves garlic, minced",
        "Soy sauce",
        "Sesame oil",
      ],
      instructions: [
        "Pulse cauliflower in food processor until rice-sized",
        "Heat oil and sauté garlic",
        "Add vegetables and cook until tender",
        "Push to side and scramble eggs",
        "Mix everything together",
        "Season with soy sauce",
      ],
      tips: "Don't overcook the cauliflower rice - it should be tender-crisp",
    },
  ],
  Eggplant: [
    {
      name: "Baked Eggplant Parmesan",
      difficulty: "medium",
      prepTime: "60 mins",
      ingredients: [
        "2 large eggplants, sliced",
        "2 cups marinara sauce",
        "2 cups mozzarella cheese",
        "1 cup breadcrumbs",
        "2 eggs",
        "Italian seasonings",
      ],
      instructions: [
        "Salt eggplant slices and let sit for 30 minutes",
        "Dip in egg then breadcrumbs",
        "Bake at 400°F for 20 minutes",
        "Layer with sauce and cheese",
        "Bake additional 15 minutes",
      ],
      tips: "Salting the eggplant removes bitterness and excess moisture",
    },
    {
      name: "Grilled Eggplant with Herbs",
      difficulty: "easy",
      prepTime: "25 mins",
      ingredients: [
        "2 eggplants, sliced lengthwise",
        "1/4 cup olive oil",
        "Fresh herbs (basil, oregano, thyme)",
        "3 cloves garlic, minced",
        "Balsamic vinegar",
        "Salt and pepper",
      ],
      instructions: [
        "Mix oil, herbs, and garlic",
        "Brush eggplant slices with mixture",
        "Grill 4-5 minutes per side",
        "Drizzle with balsamic",
        "Season to taste",
      ],
      tips: "Score the flesh in a diamond pattern for better flavor absorption",
    },
  ],
  Squash: [
    {
      name: "Butternut Squash Soup",
      difficulty: "medium",
      prepTime: "50 mins",
      ingredients: [
        "1 butternut squash, peeled and cubed",
        "1 onion, chopped",
        "2 carrots, chopped",
        "4 cups vegetable broth",
        "1/2 cup cream",
        "Nutmeg and cinnamon",
      ],
      instructions: [
        "Roast squash until tender",
        "Sauté onion and carrots",
        "Add squash and broth, simmer",
        "Blend until smooth",
        "Stir in cream and spices",
      ],
      tips: "Roasting the squash first adds depth of flavor",
    },
    {
      name: "Summer Squash Fritters",
      difficulty: "easy",
      prepTime: "30 mins",
      ingredients: [
        "3 summer squash, grated",
        "1 egg",
        "1/3 cup flour",
        "1/4 cup grated Parmesan",
        "Fresh herbs",
        "Oil for frying",
      ],
      instructions: [
        "Salt grated squash and drain excess water",
        "Mix with egg, flour, cheese, and herbs",
        "Form into patties",
        "Fry until golden brown",
        "Drain on paper towels",
      ],
      tips: "Squeeze out as much liquid as possible for crispy fritters",
    },
  ],
  Watermelon: [
    {
      name: "Watermelon Feta Salad",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "6 cups cubed watermelon",
        "1 cup feta cheese",
        "1/2 cup fresh mint",
        "1/4 cup red onion, thinly sliced",
        "Balsamic glaze",
        "Black pepper",
      ],
      instructions: [
        "Arrange watermelon cubes on platter",
        "Sprinkle with feta and red onion",
        "Add fresh mint leaves",
        "Drizzle with balsamic glaze",
        "Finish with black pepper",
      ],
      tips: "Chill watermelon before serving for best results",
    },
    {
      name: "Watermelon Gazpacho",
      difficulty: "easy",
      prepTime: "20 mins",
      ingredients: [
        "4 cups watermelon chunks",
        "1 cucumber, peeled",
        "1 red bell pepper",
        "2 tbsp olive oil",
        "2 tbsp lime juice",
        "Fresh herbs (basil, mint)",
      ],
      instructions: [
        "Blend watermelon until smooth",
        "Add cucumber and pepper, pulse",
        "Stir in olive oil and lime juice",
        "Chill for at least 2 hours",
        "Garnish with herbs",
      ],
      tips: "For a spicy kick, add a small jalapeño pepper",
    },
  ],
  Asparagus: [
    {
      name: "Grilled Lemon Asparagus",
      difficulty: "easy",
      prepTime: "15 mins",
      ingredients: [
        "1 lb asparagus spears",
        "3 tbsp olive oil",
        "2 lemons",
        "3 cloves garlic, minced",
        "Salt and pepper",
        "Parmesan cheese (optional)",
      ],
      instructions: [
        "Trim woody ends of asparagus",
        "Toss with oil, garlic, and lemon zest",
        "Grill for 5-7 minutes",
        "Squeeze fresh lemon juice over top",
        "Season and add Parmesan if desired",
      ],
      tips: "Look for medium-thickness spears for best grilling results",
    },
    {
      name: "Asparagus Quiche",
      difficulty: "medium",
      prepTime: "55 mins",
      ingredients: [
        "1 pie crust",
        "1 bunch asparagus",
        "4 eggs",
        "1 cup heavy cream",
        "1 cup Gruyere cheese",
        "Fresh herbs",
      ],
      instructions: [
        "Prebake pie crust",
        "Blanch asparagus briefly",
        "Whisk eggs, cream, and seasonings",
        "Arrange asparagus in crust",
        "Pour egg mixture over",
        "Bake at 375°F for 35-40 minutes",
      ],
      tips: "Cut asparagus to fit the pie dish in a decorative pattern",
    },
  ],
  Okra: [
    {
      name: "Crispy Fried Okra",
      difficulty: "medium",
      prepTime: "30 mins",
      ingredients: [
        "1 lb fresh okra, sliced",
        "1 cup cornmeal",
        "1/2 cup flour",
        "1 tsp Cajun seasoning",
        "Buttermilk",
        "Oil for frying",
      ],
      instructions: [
        "Soak okra in buttermilk",
        "Mix cornmeal, flour, and seasonings",
        "Dredge okra in mixture",
        "Fry until golden brown",
        "Drain on paper towels",
      ],
      tips: "Use fresh, young okra pods for best results",
    },
    {
      name: "Okra and Tomato Stew",
      difficulty: "easy",
      prepTime: "40 mins",
      ingredients: [
        "1 lb okra, whole or sliced",
        "2 cups diced tomatoes",
        "1 onion, chopped",
        "3 cloves garlic",
        "Cajun seasonings",
        "Rice for serving",
      ],
      instructions: [
        "Sauté onion and garlic",
        "Add tomatoes and seasonings",
        "Add okra and simmer",
        "Cook until okra is tender",
        "Serve over rice",
      ],
      tips: "Don't overcook the okra - it should still be slightly crisp",
    },
  ],
  Corn: [
    {
      name: "Grilled Corn on the Cob",
      difficulty: "easy",
      prepTime: "20 mins",
      ingredients: [
        "6 ears of corn",
        "1/2 cup butter, softened",
        "Fresh herbs (chives, parsley)",
        "2 cloves garlic, minced",
        "Salt and pepper",
        "Lime wedges",
      ],
      instructions: [
        "Peel back husks but leave attached",
        "Remove silk",
        "Mix butter with herbs and garlic",
        "Spread on corn",
        "Rewrap in husks",
        "Grill 15-20 minutes",
      ],
      tips: "Soak corn in water for 30 minutes before grilling to prevent burning",
    },
    {
      name: "Fresh Corn Salad",
      difficulty: "easy",
      prepTime: "25 mins",
      ingredients: [
        "4 ears corn, kernels removed",
        "1 red bell pepper, diced",
        "1/2 red onion, finely chopped",
        "Fresh basil",
        "Lime juice",
        "Olive oil",
      ],
      instructions: [
        "Briefly cook corn kernels",
        "Combine with pepper and onion",
        "Chop fresh basil",
        "Dress with lime juice and oil",
        "Season to taste",
        "Chill before serving",
      ],
      tips: "Can be made with grilled or raw corn for different flavors",
    },
  ],
  Potatoes: [
    {
      name: "Crispy Roasted Potatoes",
      difficulty: "easy",
      prepTime: "45 mins",
      ingredients: [
        "2 lbs potatoes, cut into chunks",
        "3 tbsp olive oil",
        "4 cloves garlic, minced",
        "2 tsp rosemary, chopped",
        "Salt and pepper to taste",
        "Optional: parmesan cheese",
      ],
      instructions: [
        "Preheat oven to 425°F",
        "Parboil potato chunks for 5-7 minutes",
        "Drain and shake in colander to roughen edges",
        "Toss with oil, garlic, and rosemary",
        "Spread on baking sheet",
        "Roast for 30-35 minutes until golden and crispy",
        "Season with salt and pepper",
      ],
      tips: "Parboiling and roughing up the edges helps create extra crispy potatoes",
    },
    {
      name: "Creamy Mashed Potatoes",
      difficulty: "easy",
      prepTime: "30 mins",
      ingredients: [
        "3 lbs Yukon Gold potatoes",
        "1 cup warm milk",
        "1/2 cup butter",
        "4 cloves roasted garlic (optional)",
        "Salt and pepper to taste",
        "Chives for garnish",
      ],
      instructions: [
        "Peel and cut potatoes into equal sizes",
        "Boil in salted water until tender",
        "Drain well and return to pot",
        "Add warm milk and butter",
        "Mash until smooth and creamy",
        "Season with salt and pepper",
        "Garnish with chives",
      ],
      tips: "Using warm milk prevents the potatoes from becoming gluey",
    },
    {
      name: "Garden Potato Salad",
      difficulty: "medium",
      prepTime: "40 mins",
      ingredients: [
        "2 lbs new potatoes",
        "4 hard-boiled eggs",
        "1/2 cup mayonnaise",
        "2 tbsp Dijon mustard",
        "1/4 cup fresh herbs (dill, parsley)",
        "2 celery stalks, diced",
        "1/2 red onion, finely chopped",
        "Salt and pepper to taste",
      ],
      instructions: [
        "Boil potatoes until tender but firm",
        "Cool slightly and cut into chunks",
        "Mix mayonnaise, mustard, and herbs",
        "Add celery and onion",
        "Fold in potatoes and chopped eggs",
        "Season to taste",
        "Chill for at least 1 hour",
      ],
      tips: "Using fresh garden herbs makes this potato salad extra special",
    },
    {
      name: "Homemade Hash Browns",
      difficulty: "medium",
      prepTime: "25 mins",
      ingredients: [
        "4 large potatoes, grated",
        "1 onion, finely chopped",
        "2 tbsp vegetable oil",
        "1 tsp garlic powder",
        "Salt and pepper to taste",
        "Optional: fresh herbs",
      ],
      instructions: [
        "Grate potatoes and squeeze out excess moisture",
        "Mix with onion and seasonings",
        "Heat oil in a large skillet",
        "Spread potato mixture evenly",
        "Cook until golden brown on bottom",
        "Flip and cook other side",
        "Serve hot and crispy",
      ],
      tips: "The key to crispy hash browns is removing as much moisture as possible",
    },
  ],
};

/**
 * RecipeSuggestions Component
 * Displays recipe suggestions based on vegetables currently growing in the user's garden
 *
 * Features:
 * - Filters recipes based on currently planted vegetables
 * - Displays recipe details in a modal view
 * - Responsive grid layout
 * - Visual indicators for vegetables currently in the garden
 *
 * @component
 * @example
 * return (
 *   <RecipeSuggestions />
 * )
 */
const RecipeSuggestions = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get garden ID from URL params
  const [garden, setGarden] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVegetable, setSelectedVegetable] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchGarden = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        if (!id) {
          setError("Please select a garden to view recipe suggestions");
          setLoading(false);
          return;
        }

        const response = await axios.get(`/api/gardens/${id}`, {
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.data) {
          throw new Error("Garden not found");
        }

        setGarden(response.data);
      } catch (err) {
        console.error("Error fetching garden:", err);
        setError(
          err.response?.status === 404
            ? "Garden not found. Please select a valid garden."
            : "Error loading garden data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGarden();
  }, [id, navigate]);

  // Get currently planted vegetables
  const getCurrentlyPlantedVegetables = () => {
    if (!garden?.layout?.beds) return new Set();

    const plantedVegetables = new Set();
    garden.layout.beds.forEach((bed) => {
      bed.plants.forEach((plant) => {
        plantedVegetables.add(plant.plantName);
      });
    });
    return plantedVegetables;
  };

  // Get filtered recipes based on currently planted vegetables
  const getFilteredRecipes = () => {
    const plantedVegetables = getCurrentlyPlantedVegetables();
    const recipes = {};

    // First add recipes for planted vegetables
    Object.entries(RECIPE_DATABASE).forEach(([vegetable, vegetableRecipes]) => {
      if (plantedVegetables.has(vegetable)) {
        recipes[vegetable] = {
          ...vegetableRecipes,
          inGarden: true,
        };
      }
    });

    // Then add recipes for vegetables not yet planted
    Object.entries(RECIPE_DATABASE).forEach(([vegetable, vegetableRecipes]) => {
      if (!plantedVegetables.has(vegetable)) {
        recipes[vegetable] = {
          ...vegetableRecipes,
          inGarden: false,
        };
      }
    });

    return recipes;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {error}
              </h3>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const recipes = getFilteredRecipes();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Recipe Suggestions
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-green-700 hover:text-green-800"
            >
              <span>← Back</span>
            </button>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Discover delicious recipes using vegetables from your garden.
            Recipes marked with "In Garden" use vegetables you're currently
            growing.
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(recipes).map(
            ([vegetable, { inGarden, ...recipes }]) => (
              <div
                key={vegetable}
                className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  inGarden ? "ring-2 ring-green-500" : ""
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {vegetable}
                    </h2>
                    {inGarden && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Garden
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    {RECIPE_DATABASE[vegetable]?.map((recipe) => (
                      <button
                        key={recipe.name}
                        className="w-full text-left group cursor-pointer rounded-lg border border-gray-100 hover:border-green-200 transition-all duration-300"
                        onClick={() => {
                          setSelectedVegetable(vegetable);
                          setSelectedRecipe(recipe);
                        }}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-800 group-hover:text-green-700 transition-colors">
                              {recipe.name}
                            </h3>
                            <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                              👉
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {recipe.difficulty}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {recipe.prepTime}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {recipe.ingredients.length} ingredients
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Recipe Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {selectedRecipe.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {selectedVegetable}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {selectedRecipe.difficulty}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {selectedRecipe.prepTime}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRecipe(null)}
                    className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-2 transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
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

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">📝</span>
                      Ingredients
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">👩‍🍳</span>
                      Instructions
                    </h3>
                    <ol className="space-y-4">
                      {selectedRecipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4 text-gray-600">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {selectedRecipe.tips && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <span className="text-xl">💡</span>
                        Pro Tips
                      </h3>
                      <p className="text-gray-600">{selectedRecipe.tips}</p>
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
