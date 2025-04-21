import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CropTips = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [cropSuggestions, setCropSuggestions] = useState<any[]>([]);

  // Fetch user's geolocation
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

  // Fetch 7-day weather forecast based on location (Weatherbit API)
  const getWeatherForecast = async () => {
    if (!location) return;

    const apiKey = '073b4c046c8141e0b1ae75e87ab27026'; // Your Weatherbit API key
    const weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${location.lat}&lon=${location.lon}&key=${apiKey}`;

    try {
      const response = await axios.get(weatherUrl);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather forecast data", error);
    }
  };

  // Suggest crops based on weather forecast
  const suggestCrops = () => {
    if (!weatherData) return;

    const upcomingWeather = weatherData.data.slice(0, 90); // Get the forecast for the next 7 days
    const averageTemperature = upcomingWeather.reduce((acc: number, day: any) => acc + day.temp, 0) / upcomingWeather.length;
    const averageRainfall = upcomingWeather.reduce((acc: number, day: any) => acc + day.precip, 0) / upcomingWeather.length; // precip = precipitation

    let suggestions: any[] = [];

    if (averageTemperature > 25 && averageRainfall > 5) {
      suggestions = [
        { name: 'Rice', image: 'https://images.pexels.com/photos/2100936/pexels-photo-2100936.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Rice is a staple food and grows well in warm and wet conditions.' },
        { name: 'Sugarcane', image: 'https://images.pexels.com/photos/7543108/pexels-photo-7543108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Sugarcane thrives in tropical climates with abundant rainfall.' },
        { name: 'Corn', image: 'https://images.pexels.com/photos/2321837/pexels-photo-2321837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Corn requires warm temperatures and moderate rainfall for optimal growth.' }
      ];
    } else if (averageTemperature > 30 && averageRainfall < 2) {
      suggestions = [
        { name: 'Sorghum', image: 'https://cdn.britannica.com/21/136021-050-FA97E7C7/Sorghum.jpg', description: 'Sorghum is drought-resistant and suitable for hot, dry climates.' },
        { name: 'Millet', image: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Grain_millet%2C_early_grain_fill%2C_Tifton%2C_7-3-02.jpg', description: 'Millet is a hardy crop that thrives in dry conditions.' },
        { name: 'Wheat', image: 'https://www.farmatma.in/wp-content/uploads/2019/05/wheat-cultivation-india.jpg', description: 'Wheat grows well in dry, hot conditions, making it suitable for summer planting.' }
      ];
    } else if (averageTemperature < 20 && averageRainfall > 3) {
      suggestions = [
        { name: 'Barley', image: 'https://images.pexels.com/photos/1595449/pexels-photo-1595449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Barley grows best in cool temperatures and can tolerate moderate rainfall.' },
        { name: 'Oats', image: 'https://images.pexels.com/photos/7543108/pexels-photo-7543108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Oats thrive in cool, wet climates and require plenty of water.' },
        { name: 'Peas', image: 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', description: 'Peas require cool conditions and moderate rainfall for healthy growth.' }
      ];
    }

    setCropSuggestions(suggestions);
  };

  // Run functions on initial load
  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      getWeatherForecast();
    }
  }, [location]);

  useEffect(() => {
    suggestCrops();
  }, [weatherData]);

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-semibold text-green-600 mb-6">Crop Tips Based on Weather</h1>

      {/* Weather Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200">
        {weatherData ? (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Upcoming Weather for Next 90 Days</h2>
            <div className="flex flex-col space-y-2 text-gray-600">
              <p><strong className="font-medium text-gray-900">Average Temperature:</strong> {Math.round(weatherData.data.reduce((acc: number, day: any) => acc + day.temp, 0) / weatherData.data.length)}°C</p>
              <p><strong className="font-medium text-gray-900">Average Rainfall Probability:</strong> {Math.round((weatherData.data.reduce((acc: number, day: any) => acc + day.precip, 0) / weatherData.data.length) * 100)}%</p>
            </div>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>

      {/* Crop Suggestions Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Suggested Crops for You</h2>
        {cropSuggestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropSuggestions.map((crop, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <img src={crop.image} alt={crop.name} className="w-full h-40 object-cover rounded-t-lg" />
                <h3 className="text-lg font-semibold mt-2 text-gray-800">{crop.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{crop.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No suggestions available based on the weather forecast.</p>
        )}
      </div>
    </div>
  );
};

export default CropTips;
