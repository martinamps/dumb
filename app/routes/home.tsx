import { useState, useEffect } from "react";
import type { Route } from "./+types/home";

// Weather Widget Component
function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/weather");
        if (!response.ok) {
          throw new Error("Failed to fetch weather");
        }
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError("CATASTROPHIC WEATHER DATA FAILURE!!!");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather randomly between 20-40 seconds to appear unstable
    const interval = setInterval(() => {
      fetchWeather();
    }, Math.floor(Math.random() * 20000) + 20000);
    
    return () => clearInterval(interval);
  }, []);

  // Emoji mapping for temperature ranges
  const getTemperatureEmoji = (temp: number) => {
    if (temp > 80) return "🔥";
    if (temp > 70) return "☀️";
    if (temp > 60) return "😎";
    if (temp > 50) return "🙂";
    if (temp > 40) return "🧥";
    if (temp > 30) return "❄️";
    return "🥶";
  };

  // Random rotating warning icons
  const warningIcons = ["⚠️", "🚨", "⛔", "🆘", "‼️"];
  const randomWarning = () => warningIcons[Math.floor(Math.random() * warningIcons.length)];

  if (loading) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center">
        <p className="text-orange-600 dark:text-orange-400 font-bold animate-pulse">
          FETCHING CRITICAL WEATHER DATA!!!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          (your survival depends on it)
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center text-red-600 dark:text-red-400">
        <p className="font-bold text-center">{randomWarning()} WEATHER SYSTEM FAILURE {randomWarning()}</p>
        <p className="text-sm mt-2">Brace for unknown meteorological conditions!</p>
      </div>
    );
  }

  return (
    <div className="min-h-40">
      {weather && (
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-2xl font-bold">{weather.city}</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-xl">{weather.temperature}°F</span>
              <span className="text-2xl">{getTemperatureEmoji(weather.temperature)}</span>
            </div>
          </div>
          
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
            <p className="text-red-600 dark:text-red-400 font-bold text-center text-sm">
              {randomWarning()} URGENT WEATHER ALERT {randomWarning()}
            </p>
            <p className="text-sm text-center mt-2">{weather.condition}</p>
          </div>
          
          <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg border border-red-300 dark:border-red-700">
            <p className="text-sm font-bold text-center">{weather.forecast}</p>
          </div>
          
          <div className="mt-2 text-xs text-center italic">
            <p className="font-bold text-orange-600 dark:text-orange-400">{weather.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "World's Dumbest Domain" },
    { name: "description", content: "Welcome to the World's Dumbest Domain!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE || "Welcome to the World's Dumbest Domain!" };
}

// Right side panel component with haiku, weather, and stocks
function RightPanel() {
  const [haiku, setHaiku] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHaiku = async () => {
      try {
        const response = await fetch("/api/haiku");
        if (!response.ok) {
          throw new Error("Failed to fetch haiku");
        }
        const data = await response.json();
        setHaiku(data.haiku);
      } catch (err) {
        setError("Failed to generate a haiku. The AI must be feeling uninspired today.");
      } finally {
        setLoading(false);
      }
    };

    fetchHaiku();
  }, []);

  const [showModal, setShowModal] = useState(false);
  
  const generateNewHaiku = () => {
    setShowModal(true);
    // No matter what they choose in the modal, nothing happens with the haiku
  };
  
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full md:w-64 space-y-6">
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Do you really want a new haiku?</h3>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                nah
              </button>
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                nvm
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Haiku Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3 text-purple-600 dark:text-purple-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          Dumb Haiku
        </h2>
        <div className="min-h-24">
          {loading ? (
            <p className="italic text-gray-600 dark:text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="font-serif text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {haiku}
            </div>
          )}
        </div>
        <button 
          onClick={generateNewHaiku}
          className="mt-3 px-3 py-1 text-sm bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors w-full"
        >
          Generate New Haiku
        </button>
      </div>

      {/* Weather Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          Dramatically Overreacted Weather
        </h2>
        <WeatherWidget />
      </div>

      {/* Stock Widget - Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          Stock Market Emoji Translator
        </h2>
        <div className="min-h-24 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>Stock widget coming soon...</p>
        </div>
      </div>
    </div>
  );
}

// Main content component - will hold horoscope selector and CAPTCHA
function MainContent() {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h1 className="text-4xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">World's Dumbest Domain</h1>
      <div className="text-center text-gray-700 dark:text-gray-300 space-y-4">
        <p className="text-xl">Welcome to worldsdumbestdomain.com</p>
        <p>The main content area will feature the horoscope selector and CAPTCHA challenge.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Coming soon...</p>
      </div>
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <MainContent />
        <RightPanel />
      </div>
    </div>
  );
}