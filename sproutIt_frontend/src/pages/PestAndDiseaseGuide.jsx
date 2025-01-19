import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import aphidsImage from "../assets/images/pests-diseases/aphids.jpg";
import hornwormImage from "../assets/images/pests-diseases/Hornworm.jpg";
import mildewImage from "../assets/images/pests-diseases/powderyMildew.jpg";
import blightImage from "../assets/images/pests-diseases/blight.jpg";
import spiderMitesImage from "../assets/images/pests-diseases/spiderMites.jpg";
import cabbageWormImage from "../assets/images/pests-diseases/cabbageWorm.jpg";
import fusariumImage from "../assets/images/pests-diseases/wilt.jpg";
import bacterialSpotImage from "../assets/images/pests-diseases/bacterialSpot.jpg";

// Pest and Disease Database
const PEST_AND_DISEASE_DATABASE = {
  pests: {
    Aphids: {
      type: "pest",
      description:
        "Small, soft-bodied insects that cluster on new growth and undersides of leaves",
      identification: [
        "Clusters of small green, black, or white insects",
        "Sticky honeydew residue on leaves",
        "Curling or yellowing leaves",
        "Stunted plant growth",
      ],
      affectedPlants: ["Tomatoes", "Peppers", "Lettuce", "Kale", "Beans"],
      images: [aphidsImage],
      organicTreatment: [
        "Spray plants with strong water stream to knock off aphids",
        "Introduce beneficial insects like ladybugs or lacewings",
        "Apply neem oil or insecticidal soap",
        "Plant companion plants like marigolds or nasturtiums",
      ],
      conventionalTreatment: [
        "Apply pyrethrin-based insecticides",
        "Use systemic insecticides for severe infestations",
        "Apply horticultural oils",
      ],
      prevention: [
        "Monitor plants regularly",
        "Maintain healthy soil and proper plant spacing",
        "Avoid over-fertilizing with nitrogen",
        "Remove affected plant parts promptly",
      ],
    },
    "Tomato Hornworm": {
      type: "pest",
      description:
        "Large green caterpillars that can quickly defoliate tomato plants",
      identification: [
        "Large (3-4 inch) bright green caterpillars",
        "White stripes and horn-like projection",
        "Extensive defoliation",
        "Black droppings on leaves",
      ],
      affectedPlants: ["Tomatoes", "Peppers", "Eggplants", "Potatoes"],
      images: [hornwormImage],
      organicTreatment: [
        "Hand-pick caterpillars off plants",
        "Apply Bacillus thuringiensis (Bt)",
        "Encourage natural predators like parasitic wasps",
        "Use companion planting with dill or borage",
      ],
      conventionalTreatment: [
        "Apply carbaryl-based insecticides",
        "Use spinosad products",
        "Systemic insecticides for severe cases",
      ],
      prevention: [
        "Till soil in spring and fall",
        "Remove nightshade family weeds",
        "Rotate crops annually",
        "Monitor plants regularly",
      ],
    },
    "Spider Mites": {
      type: "pest",
      description:
        "Tiny spider-like pests that cause stippling on leaves and create fine webbing",
      identification: [
        "Tiny red or brown dots on leaf undersides",
        "Fine webbing between leaves and stems",
        "Yellow or bronze speckling on leaves",
        "Leaf drop in severe cases",
      ],
      affectedPlants: ["Tomatoes", "Peppers", "Cucumbers", "Beans", "Melons"],
      images: [spiderMitesImage],
      organicTreatment: [
        "Spray plants with strong water stream",
        "Apply neem oil or insecticidal soap",
        "Release predatory mites",
        "Increase humidity around plants",
      ],
      conventionalTreatment: [
        "Apply miticide sprays",
        "Use systemic pesticides",
        "Treat with horticultural oils",
      ],
      prevention: [
        "Maintain proper humidity",
        "Monitor plants regularly",
        "Keep plants well-watered",
        "Avoid excessive heat and drought",
      ],
    },
    "Cabbage Worms": {
      type: "pest",
      description: "Green caterpillars that feed on brassica family plants",
      identification: [
        "Small green worms on leaves",
        "Holes in leaves, especially centers",
        "Worm droppings on leaves",
        "White butterflies flying around plants",
      ],
      affectedPlants: [
        "Cabbage",
        "Broccoli",
        "Kale",
        "Cauliflower",
        "Brussels Sprouts",
      ],
      images: [cabbageWormImage],
      organicTreatment: [
        "Hand-pick caterpillars",
        "Apply Bacillus thuringiensis (Bt)",
        "Use row covers",
        "Plant aromatic herbs nearby",
      ],
      conventionalTreatment: [
        "Apply pyrethrin-based sprays",
        "Use spinosad products",
        "Systemic insecticides",
      ],
      prevention: [
        "Use floating row covers",
        "Plant trap crops",
        "Monitor for white butterflies",
        "Clean up garden debris",
      ],
    },
  },
  diseases: {
    "Powdery Mildew": {
      type: "disease",
      description: "Fungal disease causing white powdery coating on leaves",
      identification: [
        "White, powdery spots on leaves and stems",
        "Yellow or brown leaves",
        "Distorted new growth",
        "Reduced plant vigor",
      ],
      affectedPlants: ["Squash", "Cucumbers", "Pumpkins", "Melons", "Peas"],
      images: [mildewImage],
      organicTreatment: [
        "Apply diluted milk spray (1:10 ratio)",
        "Use potassium bicarbonate",
        "Neem oil applications",
        "Prune affected areas",
      ],
      conventionalTreatment: [
        "Apply sulfur-based fungicides",
        "Use systemic fungicides",
        "Copper-based sprays",
      ],
      prevention: [
        "Provide good air circulation",
        "Avoid overhead watering",
        "Plant resistant varieties",
        "Space plants properly",
      ],
    },
    Blight: {
      type: "disease",
      description: "Fungal disease causing rapid plant tissue death",
      identification: [
        "Dark brown spots on leaves with yellow halos",
        "Rapid wilting and browning",
        "Dark lesions on stems",
        "Fruit rot",
      ],
      affectedPlants: ["Tomatoes", "Potatoes", "Peppers"],
      images: [blightImage],
      organicTreatment: [
        "Remove and destroy infected plants",
        "Apply copper-based organic fungicides",
        "Prune for better airflow",
        "Mulch to prevent soil splash",
      ],
      conventionalTreatment: [
        "Apply chlorothalonil-based fungicides",
        "Use systemic fungicides",
        "Copper-based sprays",
      ],
      prevention: [
        "Rotate crops every 3-4 years",
        "Use resistant varieties",
        "Avoid overhead watering",
        "Space plants properly",
      ],
    },
    "Fusarium Wilt": {
      type: "disease",
      description: "Soil-borne fungal disease causing yellowing and wilting",
      identification: [
        "Yellowing of lower leaves",
        "Wilting despite adequate water",
        "Brown discoloration in stem",
        "Stunted growth",
      ],
      affectedPlants: ["Tomatoes", "Cucumbers", "Melons", "Peas", "Beans"],
      images: [fusariumImage],
      organicTreatment: [
        "Remove infected plants",
        "Apply compost tea",
        "Use beneficial fungi products",
        "Improve soil drainage",
      ],
      conventionalTreatment: [
        "Apply fungicides preventatively",
        "Soil solarization",
        "Use systemic fungicides",
      ],
      prevention: [
        "Plant resistant varieties",
        "Rotate crops",
        "Maintain soil pH",
        "Avoid overwatering",
      ],
    },
    "Bacterial Spot": {
      type: "disease",
      description:
        "Bacterial infection causing dark spots on leaves and fruits",
      identification: [
        "Small dark spots with yellow halos",
        "Spots on fruits and leaves",
        "Leaf drop",
        "Scabby lesions on fruits",
      ],
      affectedPlants: ["Tomatoes", "Peppers", "Eggplants"],
      images: [bacterialSpotImage],
      organicTreatment: [
        "Remove infected plant parts",
        "Apply copper-based sprays",
        "Use compost tea",
        "Improve air circulation",
      ],
      conventionalTreatment: [
        "Apply copper-based bactericides",
        "Use streptomycin sprays",
        "Systemic bactericides",
      ],
      prevention: [
        "Use disease-free seeds",
        "Avoid overhead watering",
        "Space plants properly",
        "Clean tools between plants",
      ],
    },
  },
};

const PestAndDiseaseGuide = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all, pests, diseases

  // Filter issues based on search term and active tab
  const filteredIssues = () => {
    let issues = [];

    // Combine pests and diseases based on active tab
    if (activeTab === "all" || activeTab === "pests") {
      issues = [...issues, ...Object.entries(PEST_AND_DISEASE_DATABASE.pests)];
    }
    if (activeTab === "all" || activeTab === "diseases") {
      issues = [
        ...issues,
        ...Object.entries(PEST_AND_DISEASE_DATABASE.diseases),
      ];
    }

    // Filter based on search term
    return issues.filter(
      ([name, data]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.affectedPlants.some((plant) =>
          plant.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100/50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
              Pest & Disease Guide
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-700 hover:text-green-800"
            >
              <span>← Back</span>
            </button>
          </div>
          <p className="text-gray-600 max-w-3xl">
            Identify and treat common garden pests and diseases with our
            comprehensive guide. Find organic and conventional solutions for
            your garden problems.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, description, or affected plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-green-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
            <svg
              className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              All Issues
            </button>
            <button
              onClick={() => setActiveTab("pests")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "pests"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              Pests
            </button>
            <button
              onClick={() => setActiveTab("diseases")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "diseases"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              Diseases
            </button>
          </div>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues().map(([name, data]) => (
            <div
              key={name}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() =>
                setSelectedIssue(
                  data.type === "pest"
                    ? PEST_AND_DISEASE_DATABASE.pests[name]
                    : PEST_AND_DISEASE_DATABASE.diseases[name]
                )
              }
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {data.images && data.images[0] && (
                  <img
                    src={data.images[0]}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Error loading image for ${name}:`, e);
                      e.target.style.display = "none";
                    }}
                    onLoad={() =>
                      console.log(`Successfully loaded image for ${name}`)
                    }
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      data.type === "pest"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {data.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{data.description}</p>
                <div className="flex flex-wrap gap-1">
                  {data.affectedPlants.slice(0, 3).map((plant) => (
                    <span
                      key={plant}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                    >
                      {plant}
                    </span>
                  ))}
                  {data.affectedPlants.length > 3 && (
                    <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                      +{data.affectedPlants.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedIssue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {
                      Object.entries(
                        selectedIssue.type === "pest"
                          ? PEST_AND_DISEASE_DATABASE.pests
                          : PEST_AND_DISEASE_DATABASE.diseases
                      ).find(([_, data]) => data === selectedIssue)?.[0]
                    }
                  </h2>
                  <button
                    onClick={() => setSelectedIssue(null)}
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
                  {/* Image Gallery */}
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {selectedIssue.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex-none w-64 aspect-video bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${
                            Object.entries(
                              selectedIssue.type === "pest"
                                ? PEST_AND_DISEASE_DATABASE.pests
                                : PEST_AND_DISEASE_DATABASE.diseases
                            ).find(([_, data]) => data === selectedIssue)?.[0]
                          } example ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600">{selectedIssue.description}</p>
                  </div>

                  {/* Identification */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      How to Identify
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {selectedIssue.identification.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Affected Plants */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Affected Plants
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedIssue.affectedPlants.map((plant) => (
                        <span
                          key={plant}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                        >
                          {plant}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Options */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Organic Treatment */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Organic Treatment
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {selectedIssue.organicTreatment.map(
                          (treatment, index) => (
                            <li key={index}>{treatment}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Conventional Treatment */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">
                        Conventional Treatment
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {selectedIssue.conventionalTreatment.map(
                          (treatment, index) => (
                            <li key={index}>{treatment}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Prevention */}
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Prevention
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {selectedIssue.prevention.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PestAndDiseaseGuide;
