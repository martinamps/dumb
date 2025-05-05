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
    <div className="w-full md:w-80 space-y-6">
      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
              Do you really want a new haiku?
            </h3>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                nah
              </button>
              <button
                type="button"
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
            <p className="italic text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="font-serif text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {haiku}
            </div>
          )}
        </div>
        <button
          type="button"
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

      {/* Stock Widget */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3 text-green-600 dark:text-green-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          EmojiStonk
        </h2>
        <StockWidget />
      </div>
    </div>
  );
}
