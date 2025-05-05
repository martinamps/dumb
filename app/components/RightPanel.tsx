import { useState, useEffect, useRef } from "react";
import { StockWidget } from "./StockWidget";
import { WeatherWidget } from "./WeatherWidget";

interface HaikuData {
  haiku: string;
}

export function RightPanel() {
  const [haiku, setHaiku] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

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

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const generateNewHaiku = () => {
    setShowModal(true);
    // No matter what they choose in the modal, nothing happens with the haiku
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  return (
    <div className="w-full md:w-80 sm:max-w-[95vw] md:max-w-none space-y-3 md:space-y-6">
      {/* Custom Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={handleOutsideClick}
          onKeyDown={handleKeyDown}
          aria-modal="true"
        >
          <dialog
            ref={modalRef}
            open
            className="dumb-container p-4 rounded-lg w-full max-w-[280px] mx-auto border-0 outline-none"
            style={{
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              background: "transparent",
            }}
          >
            <h3
              id="modal-title"
              className="text-lg font-bold mb-3 dumb-text text-center"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                padding: "6px",
                borderRadius: "8px",
                textShadow: "1px 1px 0 black",
                fontSize: "clamp(1rem, 4vw, 1.2rem)",
                letterSpacing: "1px",
              }}
            >
              ⁉️⁉️ DO YOU ACTUALLY WANT A NEW HAIKU??? ⁉️⁉️
            </h3>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                type="button"
                onClick={closeModal}
                className="dumb-button dumb-tilt-left py-2 px-4"
                style={{
                  minWidth: "80px",
                  fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                }}
              >
                NAH!!
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="dumb-button dumb-tilt-right py-2 px-4"
                style={{
                  minWidth: "80px",
                  fontSize: "clamp(0.9rem, 4vw, 1.1rem)",
                  touchAction: "manipulation",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                }}
              >
                NVM!!!
              </button>
            </div>
          </dialog>
        </div>
      )}

      {/* Haiku Widget */}
      <div className="dumb-container dumb-tilt-right">
        <h2
          className="text-xl font-bold mb-3 dumb-text border-b border-yellow-400 dark:border-yellow-600 pb-2"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "5px 8px",
            borderRadius: "6px 6px 0 0",
            textShadow: "1px 1px 0 black, -1px -1px 0 black",
            letterSpacing: "1px",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)",
          }}
        >
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
                lineHeight: "1.5",
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
        <h2
          className="text-xl font-bold mb-3 dumb-text border-b border-yellow-400 dark:border-yellow-600 pb-2"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "5px 8px",
            borderRadius: "6px 6px 0 0",
            textShadow: "1px 1px 0 black, -1px -1px 0 black",
            letterSpacing: "1px",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)",
          }}
        >
          ☔ WORTHLESS WEATHER!!! ☔
        </h2>
        <WeatherWidget />
      </div>

      {/* Stock Widget */}
      <div className="dumb-container dumb-tilt-right">
        <h2
          className="text-xl font-bold mb-3 dumb-text border-b border-yellow-400 dark:border-yellow-600 pb-2"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "5px 8px",
            borderRadius: "6px 6px 0 0",
            textShadow: "1px 1px 0 black, -1px -1px 0 black",
            letterSpacing: "1px",
            fontSize: "clamp(1.2rem, 5vw, 1.5rem)",
          }}
        >
          💰 EMOJISTONK!!! 💰
        </h2>
        <StockWidget />
      </div>
    </div>
  );
}
