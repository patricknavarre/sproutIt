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
        // Using wttr.in API with a simpler format
        const response = await axios.get("https://wttr.in/?format=%C|%t|%h|%w");

        if (response.data) {
          const [condition, temp, humidity, wind] = response.data.split("|");
          setWeather({
            condition,
            temperature: temp.trim(),
            humidity: humidity.trim(),
            wind: wind.trim(),
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {format(currentTime, "EEEE, MMMM d, yyyy")}
            </h2>
            <p className="text-gray-600">{format(currentTime, "h:mm a")}</p>
          </div>
        </div>
        <div className="mt-2 text-sm">
          <p className="text-red-500">{error}</p>
          <p className="text-gray-600">Growing Zone: {zone}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(currentTime, "EEEE, MMMM d, yyyy")}
          </h2>
          <p className="text-gray-600">{format(currentTime, "h:mm a")}</p>
        </div>
        {weather && (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {getWeatherEmoji(weather.condition)}
              </span>
              <span className="text-xl font-semibold">
                {weather.temperature}
              </span>
            </div>
            <p className="text-gray-600 capitalize">{weather.condition}</p>
          </div>
        )}
      </div>
      <div className="mt-2 text-sm">
        <p className="text-gray-600">Growing Zone: {zone}</p>
        {weather && (
          <p className="text-gray-600">
            Humidity: {weather.humidity} • Wind: {weather.wind}
          </p>
        )}
      </div>
    </div>
  );
};

export default WeatherDisplay;
