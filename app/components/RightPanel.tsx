import { useState, useEffect } from "react";
import { StockWidget } from "./StockWidget";
import { WeatherWidget } from "./WeatherWidget";

interface HaikuData {
  haiku: string;
}

export function RightPanel() {
  const [haiku, setHaiku] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHaiku = async () => {
      try {
        setLoading(true); // Set loading true before fetch
        setError(null); // Clear previous errors
        const response = await fetch("/api/haiku");
        if (!response.ok) {
          throw new Error("Failed to fetch haiku");
        }
        const data: HaikuData = await response.json();
        setHaiku(data.haiku);
      } catch (err) {
        setError(
          "Failed to generate a haiku. The AI must be feeling uninspired today."
        );
        setHaiku(""); // Clear haiku on error
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
    <div className="w-full md:w-80 sm:max-w-[95vw] md:max-w-none space-y-3 md:space-y-6">
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="dumb-container dumb-spin p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4 dumb-text">
              ⁉️⁉️ DO YOU ACTUALLY WANT A NEW HAIKU??? ⁉️⁉️
            </h3>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="dumb-button dumb-tilt-left"
              >
                NAH!!
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="dumb-button dumb-tilt-right"
              >
                NVM!!!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Haiku Widget */}
      <div className="dumb-container dumb-tilt-right">
        <h2 className="text-xl font-bold mb-3 dumb-text border-b border-yellow-400 dark:border-yellow-600 pb-2" 
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "5px 8px",
            borderRadius: "6px 6px 0 0",
            textShadow: "1px 1px 0 black, -1px -1px 0 black",
            letterSpacing: "1px",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)"
          }}>
          🤪 DUMB HAIKU!!! 🤪
        </h2>
        <div className="min-h-24">
          {loading ? (
            <p className="italic dumb-text animate-pulse">
              LOADING DUMB WORDS...
            </p>
          ) : error ? (
            <p className="text-red-500 font-bold">☠️ {error} ☠️</p>
          ) : (
            <div 
              className="font-serif text-xl dumb-text whitespace-pre-line" 
              style={{
                fontSize: "clamp(1.3rem, 5vw, 1.8rem)", 
                fontWeight: "bold",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                padding: "10px",
                borderRadius: "8px",
                textShadow: "1px 1px 0 black",
                letterSpacing: "1px",
                lineHeight: "1.5"
              }}
            >
              {haiku}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={generateNewHaiku}
          className="dumb-button mt-3 w-full dumb-hover"
        >
          🔄✨ GENERATE NEW HAIKU!!! ✨🔄
        </button>
      </div>

      {/* Weather Widget */}
      <div className="dumb-container dumb-tilt-left">
        <h2 className="text-xl font-bold mb-3 dumb-text border-b border-yellow-400 dark:border-yellow-600 pb-2" 
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "5px 8px",
            borderRadius: "6px 6px 0 0",
            textShadow: "1px 1px 0 black, -1px -1px 0 black",
            letterSpacing: "1px",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)"
          }}>
          ☔ WORTHLESS WEATHER!!! ☔
        </h2>
        <WeatherWidget />
      </div>

      {/* Stock Widget */}
      <div className="dumb-container dumb-tilt-right">
        <h2 className="text-xl font-bold mb-3 dumb-text border-b border-yellow-400 dark:border-yellow-600 pb-2">
          💰 EMOJISTONK!!! 💰
        </h2>
        <StockWidget />
      </div>
    </div>
  );
}
