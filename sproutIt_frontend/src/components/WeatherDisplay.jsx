import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

const WeatherDisplay = ({ zone }) => {
  const [weather, setWeather] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using wttr.in API with extended format
        const response = await axios.get(
          "https://wttr.in/?format=%C|%t|%h|%w|%p|%P"
        );

        if (response.data) {
          const [condition, temp, humidity, wind, precipitation, pressure] =
            response.data.split("|");
          setWeather({
            condition: condition.trim(),
            temperature: temp.trim(),
            humidity: humidity.trim(),
            wind: wind.trim(),
            precipitation: precipitation.trim(),
            pressure: pressure.trim(),
          });
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Unable to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const weatherTimer = setInterval(fetchWeather, 1800000);

    return () => clearInterval(weatherTimer);
  }, []);

  const getWeatherEmoji = (condition) => {
    const conditions = {
      Sunny: "☀️",
      Clear: "🌙",
      "Partly cloudy": "🌤️",
      Cloudy: "☁️",
      Overcast: "☁️",
      Mist: "🌫️",
      "Patchy rain": "🌦️",
      "Light rain": "🌧️",
      "Moderate rain": "🌧️",
      "Heavy rain": "🌧️",
      "Light snow": "🌨️",
      "Moderate snow": "🌨️",
      "Heavy snow": "🌨️",
      Thunder: "⛈️",
      Thunderstorm: "⛈️",
    };
    return conditions[condition] || "🌡️";
  };

  const getGardenRecommendations = (weather) => {
    const recommendations = [];
    const temp = parseInt(weather.temperature);
    const isRaining = weather.condition.toLowerCase().includes("rain");
    const isWindy = parseInt(weather.wind) > 15;

    if (isRaining) {
      recommendations.push("Hold off on watering - rain is taking care of it!");
    } else if (temp > 85) {
      recommendations.push(
        "Water early morning or evening to prevent evaporation"
      );
    }

    if (isWindy) {
      recommendations.push(
        "Consider protecting delicate plants from strong winds"
      );
    }

    if (temp > 90) {
      recommendations.push("Provide extra shade for heat-sensitive plants");
    } else if (temp < 40) {
      recommendations.push("Consider covering frost-sensitive plants");
    }

    if (parseInt(weather.humidity) > 80) {
      recommendations.push("Watch for fungal issues in humid conditions");
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </h2>
            <p className="text-gray-600">{format(currentTime, "h:mm a")}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-600">Growing Zone: {zone}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      {/* Current Weather Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentTime, "EEEE, MMMM d, yyyy")}
          </h2>
          <p className="text-gray-600">{format(currentTime, "h:mm a")}</p>
          <p className="text-gray-600 mt-1">Growing Zone: {zone}</p>
        </div>
        {weather && (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-4xl">
                {getWeatherEmoji(weather.condition)}
              </span>
              <div>
                <span className="text-3xl font-bold">
                  {weather.temperature}
                </span>
              </div>
            </div>
            <p className="text-gray-600 capitalize mt-1">{weather.condition}</p>
          </div>
        )}
      </div>

      {weather && (
        <>
          {/* Current Conditions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-semibold">{weather.humidity}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Wind</p>
              <p className="text-xl font-semibold">{weather.wind}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Precipitation</p>
              <p className="text-xl font-semibold">{weather.precipitation}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">Pressure</p>
              <p className="text-xl font-semibold">{weather.pressure}</p>
            </div>
          </div>

          {/* Garden Recommendations */}
          <div className="mt-6 bg-green-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span>🌱</span>
              Garden Recommendations
            </h3>
            <ul className="space-y-2">
              {getGardenRecommendations(weather).map((rec, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 flex items-start gap-2"
                >
                  <span className="text-green-500">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherDisplay;
