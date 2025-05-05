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

// Extremely simplified static map component that looks like a real map
const WeatherMap = React.memo(
  ({
    cityName,
    pinEmoji,
  }: {
    lat?: number;
    lon?: number;
    pinEmoji: string;
    cityName: string;
  }) => {
    return (
      <div className="my-2 rounded-lg overflow-hidden">
        {/* Simple map card with fixed content */}
        <div className="rounded-lg border-4 border-purple-500 overflow-hidden">
          {/* Map content - no internal padding */}
          <div className="h-[120px] w-full bg-[#e6f2ff] relative overflow-hidden">
            {/* Fixed grid background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(200,220,240,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,220,240,0.6) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Roads */}
            <div className="absolute inset-0">
              <div className="absolute h-[1px] w-full top-[40%] bg-gray-300" />
              <div className="absolute h-full w-[1px] left-[30%] bg-gray-300" />
              <div className="absolute h-full w-[1px] left-[60%] bg-gray-300" />
              <div className="absolute h-[1px] w-full top-[70%] bg-gray-300" />
            </div>

            {/* Blue rivers */}
            <div className="absolute inset-0">
              <div className="absolute h-4 w-full bg-blue-200 opacity-60 top-1/3 transform rotate-3" />
              <div className="absolute h-2 w-full bg-blue-300 opacity-60 top-2/3 transform -rotate-2" />
            </div>

            {/* Regions - subtle colored areas */}
            <div className="absolute inset-0">
              <div className="absolute h-20 w-20 rounded-full bg-green-100 opacity-30 top-5 left-10" />
              <div className="absolute h-16 w-24 rounded-full bg-yellow-50 opacity-30 bottom-2 right-20" />
            </div>

            {/* City text with nicer styling */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-white px-3 py-1 rounded shadow-sm border border-gray-200 text-sm font-bold text-gray-800">
                {cityName}
              </div>
            </div>

            {/* Emoji pin overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] z-20">
              <div className="text-3xl filter drop-shadow-md">{pinEmoji}</div>
            </div>

            {/* Navigation UI elements */}
            <div className="absolute top-0 right-0 bottom-0 left-0 pointer-events-none">
              {/* Zoom controls */}
              <div className="absolute top-2 left-2 bg-white rounded-md shadow-sm z-20 flex flex-col">
                <div className="w-5 h-5 flex items-center justify-center text-xs font-bold border-b border-gray-200">
                  +
                </div>
                <div className="w-5 h-5 flex items-center justify-center text-xs font-bold">
                  −
                </div>
              </div>

              {/* Drag handle */}
              <div className="absolute bottom-7 right-3 bg-white/80 rounded-full w-5 h-5 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full border-2 border-gray-400" />
              </div>

              {/* Tiny copyright - just a small line */}
              <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-white flex items-center px-2">
                <div className="h-[2px] w-full bg-gray-200" />
              </div>
            </div>
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
  const [countdown, setCountdown] = useState<number>(10);
  const [refreshInterval, setRefreshInterval] = useState<number>(10);
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

      // Set a new random refresh interval between 10-20 seconds
      const newInterval = Math.floor(Math.random() * 10) + 10;
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
    <div className="flex flex-wrap justify-center items-center text-[9px] dumb-text font-bold mt-2 px-2">
      <div className="flex items-center">
        <span className="mr-1">UPDATING IN</span>
        <span className="font-mono font-semibold">{countdown}</span>
        <span className="animate-pulse ml-1">!!!</span>
      </div>
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
                <span
                  className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-30 font-normal"
                  style={{ textShadow: "none", color: "white" }}
                >
                  {weirdTemp.explanation}
                </span>
              </span>
              <span className="text-xl">
                {getTemperatureEmoji(weather.temperature)}
              </span>
            </div>
          </div>

          {/* Add the simplified map component */}
          {weather && (
            <WeatherMap pinEmoji={pinEmoji} cityName={weather.city} />
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
