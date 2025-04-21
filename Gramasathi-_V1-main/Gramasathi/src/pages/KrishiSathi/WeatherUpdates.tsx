import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

// Set up API keys
const WEATHER_API_KEY = '073b4c046c8141e0b1ae75e87ab27026'; // Weatherbit API key
const WEATHER_API_URL = `https://api.weatherbit.io/v2.0/forecast/daily?key=${WEATHER_API_KEY}`;  // Weatherbit API URL

const WeatherUpdates: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState<string>('');  // Crop selection
  const [precautions, setPrecautions] = useState<string>('');  // State for storing the response
  const [weatherData, setWeatherData] = useState<any>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's geolocation
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Fetch weather data from Weatherbit API
  const getWeatherData = async () => {
    if (!location) return;
    const weatherUrl = `${WEATHER_API_URL}&lat=${location.lat}&lon=${location.lon}`;

    try {
      const response = await axios.get(weatherUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data', error);
    }
  };

  // Predefined precautions based on current temperature and crop
  const getPredefinedPrecautions = (crop: string, weather: any) => {
    const temperature = weather.temp;

    // Logic based on temperature
    if (temperature > 30) {
      if (crop === 'Rice') {
        return 'Rice needs ample water in hot temperatures. Increase irrigation to keep the soil moist.';
      } else if (crop === 'Wheat') {
        return 'Wheat can suffer in high heat. Ensure enough watering during the hot weather to maintain soil moisture.';
      } else if (crop === 'Sugarcane') {
        return 'Sugarcane thrives in warm temperatures, but ensure that irrigation is adjusted for consistent moisture in the soil.';
      }
    } else if (temperature < 20) {
      if (crop === 'Rice') {
        return 'Rice requires a warm climate. Avoid over-watering during cooler days to prevent waterlogging.';
      } else if (crop === 'Wheat') {
        return 'Wheat can tolerate cooler temperatures, but ensure the soil remains moist without over-watering.';
      } else if (crop === 'Sugarcane') {
        return 'Sugarcane needs warm conditions. Ensure the soil is well-drained and reduce irrigation if temperatures drop too low.';
      }
    } else {
      return 'Ensure that water levels are maintained at optimal levels based on the current temperature.';
    }
  };

  // Handle crop selection
  const handleCropSelection = (crop: string) => {
    setSelectedCrop(crop);

    if (weatherData) {
      const todayWeather = weatherData.data[0]; // Today's weather data
      const precautions = getPredefinedPrecautions(crop, todayWeather);
      setPrecautions(precautions || `No specific precautions available for ${crop}.`); // Update state with the predefined precautions
    }
  };

  // Render weather icon based on forecast
  const renderWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun size={32} className="text-yellow-500" />;
      case 'cloud':
        return <Cloud size={32} className="text-gray-400" />;
      case 'rain':
        return <CloudRain size={32} className="text-blue-400" />;
      case 'wind':
        return <Wind size={32} className="text-gray-500" />;
      default:
        return <Sun size={32} className="text-yellow-500" />;
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      getWeatherData();
    }
  }, [location]);

  return (
    <div>
      {/* Crop Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Your Crop</h2>
        <select
          onChange={(e) => handleCropSelection(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Select Crop</option>
          <option value="Rice">Rice</option>
          <option value="Wheat">Wheat</option>
          <option value="Sugarcane">Sugarcane</option>
        </select>

        {selectedCrop && (
          <div className="mt-4">
            <h3 className="font-semibold text-lg">Precautions for {selectedCrop}</h3>
            {/* Display the predefined response */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p>{precautions}</p>  {/* Displaying predefined response here */}
            </div>
          </div>
        )}
      </div>

      {/* Weather Information Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {weatherData && weatherData.data.slice(0, 4).map((day: any, index: number) => (
            <div key={index} className={`p-4 rounded-lg ${index === 0 ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{day.valid_date}</h3>
                  <p className="text-gray-600">{day.weather.description}</p>
                </div>
                {/* Weather Icons */}
                {renderWeatherIcon(day.weather.icon)}
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold">{day.temp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precipitation:</span>
                  <span className="font-semibold">{day.precip} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wind:</span>
                  <span className="font-semibold">{day.wind_spd} km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherUpdates;
