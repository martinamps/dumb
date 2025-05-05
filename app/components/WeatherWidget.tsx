import React, { useState, useEffect, useCallback } from "react";

// Define the type for the weather API response - replace 'any'
interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  forecast: string;
  advice: string;
  realWeather?: {
    lat: number;
    lon: number;
  };
}

// Define the type for the weird temperature conversion result - replace 'any'
interface WeirdTempData {
  temperature: string;
  unit: string;
  suffix: string;
  explanation: string;
}

// Convert Fahrenheit to random weird units (moved outside component)
const convertToWeirdUnit = (tempF: number): WeirdTempData => {
  // List of weird temperature units and their conversion formulas from Fahrenheit
  const weirdUnits = [
    {
      name: "Kelvin",
      convert: (f: number) => (((f - 32) * 5) / 9 + 273.15).toFixed(2),
      suffix: "K",
      explanation: "K = (°F + 459.67) × 5/9",
    },
    {
      name: "Rankine",
      convert: (f: number) => (f + 459.67).toFixed(2),
      suffix: "°Ra",
      explanation: "°Ra = °F + 459.67",
    },
    {
      name: "Rømer",
      convert: (f: number) => (((f - 32) * 7) / 24 + 7.5).toFixed(2),
      suffix: "°Rø",
      explanation: "°Rø = (°F - 32) × 7/24 + 7.5",
    },
    {
      name: "Réaumur",
      convert: (f: number) => (((f - 32) * 4) / 9).toFixed(2),
      suffix: "°Ré",
      explanation: "°Ré = (°F - 32) × 4/9",
    },
    {
      name: "Wedgwood",
      convert: (f: number) =>
        (((((f - 32) * 5) / 9 - 273.15) / 72.5) * 30).toFixed(2),
      suffix: "°W",
      explanation: "°W = ((°F - 32) × 5/9 - 273.15) / 72.5 × 30",
    },
    {
      name: "Newton",
      convert: (f: number) => (((f - 32) * 11) / 60).toFixed(2),
      suffix: "°N",
      explanation: "°N = (°F - 32) × 11/60",
    },
    {
      name: "Delisle",
      convert: (f: number) => (((212 - f) * 5) / 6).toFixed(2),
      suffix: "°De",
      explanation: "°De = (212 - °F) × 5/6",
    },
    {
      name: "Hooke",
      convert: (f: number) => ((((f - 32) * 5) / 9) * 12).toFixed(2),
      suffix: "°H",
      explanation: "°H = (°F - 32) × 5/9 × 12",
    },
  ];

  // Pick a random unit
  const randomUnit = weirdUnits[Math.floor(Math.random() * weirdUnits.length)];
  const convertedTemp = randomUnit.convert(tempF);

  return {
    temperature: convertedTemp,
    unit: randomUnit.name,
    suffix: randomUnit.suffix,
    explanation: randomUnit.explanation,
  };
};

// Pick a weird emoji for the map pin (moved outside component)
const getRandomWeirdPin = () => {
  const weirdPins = [
    "🦄",
    "👽",
    "🤡",
    "💩",
    "👻",
    "🧠",
    "🦖",
    "🧟",
    "🥔",
    "🍄",
    "🦑",
    "🧸",
    "🛸",
    "🪐",
    "🧩",
    "🎪",
    "🌮",
    "🍕",
    "🦞",
    "🐙",
    "🦜",
    "🧙",
    "🧜‍♀️",
    "🤖",
    "🦝",
    "🥝",
    "🎭",
    "🧶",
    "🌚",
  ];
  // Removed duplicate "🦄"
  return weirdPins[Math.floor(Math.random() * weirdPins.length)];
};

// Map component defined outside of the WeatherWidget to prevent re-rendering
const WeatherMap = React.memo(
  ({
    lat,
    lon,
    pinEmoji,
    cityName,
  }: {
    lat: number;
    lon: number;
    pinEmoji: string;
    cityName: string;
  }) => {
    // The iframe URL with closer zoom level to show city names (zoom level 12 is city-level detail)
    // Using a much tighter bounding box to focus on the location
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
      lon - 0.5
    }%2C${lat - 0.5}%2C${lon + 0.5}%2C${lat + 0.5}&layer=mapnik&zoom=10`;

    return (
      <div className="mt-2 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
        <div className="relative">
          {/* Map iframe with CSS to hide controls */}
          <div className="relative" style={{ height: "200px" }}>
            <iframe
              src={mapUrl}
              width="100%"
              height="200"
              frameBorder="0"
              scrolling="no"
              title={`Map of ${cityName}`}
              className="w-full"
              style={{ zIndex: 1 }}
            />

            {/* Position emoji pin over map */}
            <div className="absolute inset-0 flex items-center justify-center text-5xl z-10 pointer-events-none">
              {pinEmoji}
            </div>

            {/* Overlay to hide attribution and controls */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-800 z-20" />
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-100 dark:bg-gray-800 z-20" />
            <div className="absolute top-6 bottom-6 left-0 w-6 bg-gray-100 dark:bg-gray-800 z-20" />
            <div className="absolute top-6 bottom-6 right-0 w-6 bg-gray-100 dark:bg-gray-800 z-20" />
          </div>
        </div>
      </div>
    );
  }
);

WeatherMap.displayName = "WeatherMap"; // Add display name for React DevTools

// Weather Widget Component
export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [weirdTemp, setWeirdTemp] = useState<WeirdTempData | null>(null);
  const [pinEmoji, setPinEmoji] = useState<string>("📍");

  // Random rotating warning icons
  const warningIcons = ["⚠️", "🚨", "⛔", "🆘", "‼️"];
  const randomWarning = () =>
    warningIcons[Math.floor(Math.random() * warningIcons.length)];

  // Weather fetching function
  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/weather");
      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }
      const data: WeatherData = await response.json();
      setWeather(data);

      // Generate new random values only when fetching new weather
      if (data.temperature) {
        setWeirdTemp(convertToWeirdUnit(data.temperature));
      }
      setPinEmoji(getRandomWeirdPin());

      // Set a new random refresh interval between 20-40 seconds
      const newInterval = Math.floor(Math.random() * 20) + 20;
      setRefreshInterval(newInterval);
      setCountdown(newInterval);
      setError(null);
    } catch (err) {
      setError("CATASTROPHIC WEATHER DATA FAILURE!!!");
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed now that helpers are outside

  // Initial fetch on component mount
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Countdown timer effect - handles the weather refresh
  useEffect(() => {
    if (!weather) return;

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          // Don't let countdown go below 0, trigger refresh directly
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [weather]); // Depends on weather to start/stop timer

  // Separate effect to handle refresh when countdown reaches zero
  useEffect(() => {
    if (countdown === 0 && weather) {
      fetchWeather();
    }
  }, [countdown, weather, fetchWeather]); // Depends on countdown, weather, and fetchWeather

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

  // Render the countdown timer separately from the weather display
  const CountdownTimer = () => (
    <div className="flex justify-center items-center text-[9px] dumb-text font-bold mt-2">
      <span className="flex items-center">
        <span className="mr-1">UPDATING IN</span>
        <span className="font-mono font-semibold">{countdown}</span>
        <span className="animate-pulse ml-1">!!!</span>
      </span>
      <button
        type="button"
        onClick={() => fetchWeather()} // Direct call, no need for separate handler
        className="ml-2 text-blue-500 dark:text-blue-400 underline font-bold"
        disabled={loading} // Disable refresh button while loading
      >
        REFRESH NOW!!!
      </button>
    </div>
  );

  if (loading && !weather) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center">
        <p className="dumb-text font-bold text-2xl animate-pulse">
          FETCHING CRITICAL WEATHER DATA!!!
        </p>
        <p className="dumb-text text-xl mt-2">
          (YOUR SURVIVAL DEPENDS ON IT!!!)
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center">
        <p className="dumb-text font-bold text-2xl text-center">
          {randomWarning()} WEATHER SYSTEM FAILURE!!! {randomWarning()}
        </p>
        <p className="dumb-text text-xl mt-2">
          BRACE FOR UNKNOWN METEOROLOGICAL CONDITIONS!!!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-40">
      {weather && weirdTemp && (
        <div className="space-y-2">
          <div className="text-center">
            <span className="text-xl font-bold dumb-text">{weather.city}</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span
                className="text-lg group relative dumb-text"
                title={weirdTemp.explanation}
              >
                {weirdTemp.temperature}{" "}
                <span className="text-sm">
                  {weirdTemp.unit} [{weirdTemp.suffix}]
                </span>
                {/* Tooltip on hover */}
                <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-30 font-normal" style={{textShadow: 'none', color: 'white'}}>
                  {weirdTemp.explanation}
                </span>
              </span>
              <span className="text-xl">
                {getTemperatureEmoji(weather.temperature)}
              </span>
            </div>
          </div>

          {/* Add the map component with stable props */}
          {weather.realWeather?.lat && weather.realWeather?.lon && (
            <WeatherMap
              lat={weather.realWeather.lat}
              lon={weather.realWeather.lon}
              pinEmoji={pinEmoji}
              cityName={weather.city}
            />
          )}

          <div className="dumb-container dumb-tilt-left p-2 rounded-lg border-4 border-dashed border-yellow-500">
            <p className="dumb-text font-bold text-center text-lg">
              {randomWarning()} URGENT WEATHER ALERT!!! {randomWarning()}
            </p>
            <p className="dumb-text text-center mt-1 leading-tight text-base">
              {weather.condition}
            </p>
          </div>

          <div className="dumb-container dumb-tilt-right p-2 rounded-lg border-4 border-dashed border-red-500">
            <p className="dumb-text font-bold text-center leading-tight break-words text-base">
              {weather.forecast}
            </p>
          </div>

          <div className="mt-1 text-center">
            <p className="dumb-text font-bold leading-tight text-base">
              {weather.advice}
            </p>
          </div>

          {/* Separate countdown timer component */}
          <CountdownTimer />
        </div>
      )}

      {loading && weather && (
        <div className="min-h-40 flex flex-col items-center justify-center">
          <p className="dumb-text text-2xl font-bold animate-pulse">
            UPDATING CRITICAL WEATHER DATA!!!
          </p>
          <p className="dumb-text text-xl mt-2">
            (STAY TUNED FOR RIDICULOUS UPDATES!!!)
          </p>
        </div>
      )}
    </div>
  );
}
