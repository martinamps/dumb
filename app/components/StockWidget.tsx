import React, { useState, useEffect, useCallback } from "react";

// --- Simplified Dumb Emoji Definitions (Mirroring API) ---
const vibeEmojis: Record<string, string> = {
  "😂": "Laughably Bad",
  "😭": "Tragically Overvalued",
  "🥳": "Party's Over Soon",
  "🥶": "Frozen in Fear",
  "🤡": "Utterly Clueless",
};

const actionEmojis: Record<string, string> = {
  "🚀": "To the Moon (or maybe just the ceiling)",
  "📉": "Down the Drain",
  "📈": "Going Up (like my blood pressure)",
  "🎢": "Wild Ride Ahead",
  "🐌": "Moving Glacially",
};

const sourceEmojis: Record<string, string> = {
  "🔮": "Scryed from a Dusty Crystal Ball",
  "👽": "Intercepted Alien Broadcast",
  "🎲": "Random Dice Roll",
  "🧠": "AI Hallucination",
  "🐶": "Dog Barked Twice (Means Buy?)",
};
// --- End Simplified Dumb Emoji Definitions ---

// Define the type for a single stock item
interface Stock {
  ticker: string;
  price: string;
  movement: string;
  emojis: string;
  emojiArray: string[];
  name: string;
  sector: string;
  advice: string;
  unitEquivalent: {
    value: string;
    unit: string;
  };
  comparisonMetrics: {
    vsPetRock: string;
    memePotential: string;
    existentialWeight: string;
    alignmentWithChaos: string;
  };
  isRealPrice: boolean;
}

// Define the type for the API response
interface StockData {
  stocks: Stock[];
  chaosLevel?: string;
  mercuryRetrograde?: boolean;
  disclaimers: string[];
  selectionMethod?: string;
  methodDescription?: string;
  lastUpdated?: string;
}

// Define the type for error data
interface ErrorData {
  message?: string;
  error?: string;
}

// Helper to get emoji meaning based on position
const getEmojiMeaning = (emoji: string, position: number): string => {
  if (position === 0) return vibeEmojis[emoji] || "Unknown Vibe";
  if (position === 1) return actionEmojis[emoji] || "Unknown Action";
  if (position === 2) return sourceEmojis[emoji] || "Unknown Source";
  return "Invalid Position";
};

// Dumb Legend Component
const DumbLegend = () => (
  <div className="mb-4 p-3 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800/50">
    <h3 className="text-center font-bold text-sm mb-2 uppercase text-purple-600 dark:text-purple-400 tracking-wider">
      The Official EmojiStonk™ Legend (Patent Pending)
    </h3>
    <p className="text-center text-[10px] italic text-gray-500 dark:text-gray-400 mb-3">
      Our highly sophisticated system translates complex market data into three
      easy-to-misunderstand emojis:
    </p>
    <div className="grid grid-cols-3 gap-3 text-xs">
      {/* Column 1: Vibe */}
      <div>
        <div className="font-bold text-center mb-1 border-b border-gray-300 dark:border-gray-700 pb-1">
          Vibe
        </div>
        <ul className="space-y-1 text-[10px]">
          {Object.entries(vibeEmojis).map(([emoji, meaning]) => (
            <li key={`vibe-${emoji}`} className="flex items-start">
              <span className="inline-block w-4 text-center mr-1">{emoji}</span>
              <span>= {meaning}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Column 2: Action */}
      <div>
        <div className="font-bold text-center mb-1 border-b border-gray-300 dark:border-gray-700 pb-1">
          Action
        </div>
        <ul className="space-y-1 text-[10px]">
          {Object.entries(actionEmojis).map(([emoji, meaning]) => (
            <li key={`action-${emoji}`} className="flex items-start">
              <span className="inline-block w-4 text-center mr-1">{emoji}</span>
              <span>= {meaning}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Column 3: Source */}
      <div>
        <div className="font-bold text-center mb-1 border-b border-gray-300 dark:border-gray-700 pb-1">
          Source
        </div>
        <ul className="space-y-1 text-[10px]">
          {Object.entries(sourceEmojis).map(([emoji, meaning]) => (
            <li key={`source-${emoji}`} className="flex items-start">
              <span className="inline-block w-4 text-center mr-1">{emoji}</span>
              <span>= {meaning}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <p className="text-center text-[9px] italic text-gray-500 dark:text-gray-400 mt-3">
      * Emoji meanings subject to change based on lunar cycles, caffeine intake,
      and programmer mood swings. Not legally binding in any reality.
    </p>
  </div>
);

// Stock Widget Component
export function StockWidget() {
  const [stocks, setStocks] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareStock, setCompareStock] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stocks");
      if (!response.ok) {
        let errorMsg = "Failed to fetch stocks";
        try {
          const errorData = (await response.json()) as ErrorData;
          errorMsg = errorData.message || errorData.error || errorMsg;
        } catch (_) {
          // Ignore if response isn't JSON
        }
        throw new Error(errorMsg);
      }
      const data: StockData = await response.json();
      setStocks(data);
      setError(null);

      if (
        !compareMode ||
        (selectedStock &&
          !data.stocks.find((s) => s.ticker === selectedStock)) ||
        (compareStock && !data.stocks.find((s) => s.ticker === compareStock))
      ) {
        setSelectedStock(null);
        setCompareStock(null);
        setCompareMode(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown Error";
      setError(`CRITICAL FINANCIAL DATA FAILURE!!! (${errorMessage})`);
      setStocks(null);
    } finally {
      setLoading(false);
    }
  }, [compareMode, selectedStock, compareStock]);

  useEffect(() => {
    fetchStocks();

    // Refresh stocks every 15 seconds
    const interval = setInterval(() => {
      fetchStocks();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [fetchStocks]);

  // Handle toggle compare mode
  const toggleCompareMode = () => {
    if (compareMode) {
      setCompareMode(false);
      setCompareStock(null);
    } else {
      if (selectedStock) {
        setCompareMode(true);
      } else {
        alert("Select a stock first before comparing!");
      }
    }
  };

  // Handle stock selection (main or comparison target)
  const selectStockHandler = (ticker: string) => {
    if (compareMode) {
      if (ticker !== selectedStock) {
        setCompareStock(ticker);
      }
    } else {
      setSelectedStock(ticker);
    }
  };

  // Get Cosmic Verdict based on emojis
  const getCosmicVerdict = (stock: Stock | undefined): string => {
    if (!stock || !stock.emojiArray || stock.emojiArray.length !== 3)
      return "The cosmos are silent.";

    const [vibe, action, source] = stock.emojiArray;

    // Absolutely arbitrary rules for a verdict
    if (vibe === "😂" && action === "🚀")
      return "Miraculously, this garbage might fly!";
    if (vibe === "😭" && action === "📉")
      return "An angel falling from grace. Sell!";
    if (source === "🐶") return "Trust the dog. Always trust the dog.";
    if (action === "🎢") return "Buckle up, it's gonna be a wild ride!";
    if (vibe === "🤡" && source === "🧠")
      return "A clown following AI advice? Peak market conditions!";

    // Default fallback verdict
    return `A ${vibeEmojis[vibe] || "Mysterious"} Vibe, predicting ${
      actionEmojis[action] || "Uncertain"
    } Action, based on ${sourceEmojis[source] || "Unknown"} Sources.`;
  };

  // Random rotating warning icons
  const warningIcons = ["⚠️", "🚨", "⛔", "🆘", "‼️", "❓", "☢️", "☣️"];
  const randomWarning = () =>
    warningIcons[Math.floor(Math.random() * warningIcons.length)];

  // Render Loading State
  if (loading && !stocks) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center">
        <p className="text-green-600 dark:text-green-400 font-bold animate-pulse text-lg">
          FETCHING COSMIC FINANCIAL DATA...
        </p>
        <p className="text-sm text-gray-500 mt-2 animate-bounce">
          ✨🧠🎲🔮👽🐶✨
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 italic">
          (Aligning chakras with stock tickers...)
        </p>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center text-red-600 dark:text-red-400 border-4 border-dashed border-red-500 p-4 rounded-lg">
        <p className="font-bold text-xl text-center animate-ping">
          {randomWarning()} MARKET MELTDOWN {randomWarning()}
        </p>
        <p className="text-center font-mono mt-2 text-sm bg-red-100 dark:bg-red-900/50 p-2 rounded">
          {error}
        </p>
        <p className="text-sm mt-3 text-center">
          The EmojiStonk™ machine has encountered a dimensional rift! Try
          refreshing, or consult your local shaman.
        </p>
        <button
          type="button"
          onClick={fetchStocks}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          Retry Connection to Astral Plane
        </button>
      </div>
    );
  }

  // Render Main Content
  if (!stocks) {
    return (
      <div className="text-center text-gray-500">
        No stock data available. The void stares back.
      </div>
    );
  }

  const currentSelectedStock = stocks.stocks.find(
    (s) => s.ticker === selectedStock
  );
  const currentCompareStock = stocks.stocks.find(
    (s) => s.ticker === compareStock
  );

  return (
    <div className="min-h-40">
      <DumbLegend />

      {/* Stocks List */}
      <div className="space-y-2 mb-4">
        {stocks.stocks.map((stock) => (
          <button
            type="button"
            key={stock.ticker}
            onClick={() => selectStockHandler(stock.ticker)}
            title={`Select ${stock.ticker} ${
              compareMode ? "for comparison" : "for details"
            }`}
            className={`w-full text-left p-2 rounded-lg border cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 ${
              selectedStock === stock.ticker
                ? "ring-2 ring-green-500 border-green-400 bg-green-50 dark:bg-green-900/30 shadow-md scale-[1.02]"
                : compareStock === stock.ticker
                ? "ring-2 ring-blue-500 border-blue-400 bg-blue-50 dark:bg-blue-900/30 shadow-md scale-[1.02]"
                : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-[1.01]"
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Left Side: Ticker, Price, Movement */}
              <div className="flex-shrink-0 mr-2">
                <span className="font-bold text-sm md:text-base">
                  {stock.ticker}
                </span>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  ${stock.price}
                  <span
                    className={`ml-1.5 font-medium ${
                      Number.parseFloat(stock.movement) > 0
                        ? "text-green-500"
                        : Number.parseFloat(stock.movement) < 0
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {Number.parseFloat(stock.movement) > 0
                      ? "▲"
                      : Number.parseFloat(stock.movement) < 0
                      ? "▼"
                      : "■"}
                    {Math.abs(Number.parseFloat(stock.movement))}%
                  </span>
                </div>
              </div>

              {/* Right Side: Emojis with Tooltips */}
              <div className="text-xl md:text-2xl space-x-1 flex items-center">
                {stock.emojiArray && stock.emojiArray.length === 3 ? (
                  stock.emojiArray.map((emoji, i) => (
                    <span
                      key={`${stock.ticker}-emoji-${i}`}
                      className="inline-block relative group cursor-help"
                      title={getEmojiMeaning(emoji, i)}
                    >
                      {emoji}
                      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                        {getEmojiMeaning(emoji, i)}
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">???</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Details/Comparison Section */}
      {selectedStock && currentSelectedStock && (
        <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner space-y-3">
          {/* Header for Selected Stock */}
          <div className="flex justify-between items-start border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
            <div>
              <h3 className="font-bold text-base md:text-lg text-green-700 dark:text-green-300">
                {currentSelectedStock.name} ({currentSelectedStock.ticker})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentSelectedStock.sector}
              </p>
            </div>
            <button
              type="button"
              onClick={toggleCompareMode}
              disabled={!selectedStock}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                compareMode
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              }`}
            >
              {compareMode ? "Exit Compare" : "Compare Mode"}
            </button>
          </div>

          {/* Primary Stock Details */}
          <div className="text-xs space-y-2">
            <p>
              <span className="font-semibold">Cosmic Verdict:</span>{" "}
              <span className="italic">
                {getCosmicVerdict(currentSelectedStock)}
              </span>
            </p>
            <p>
              <span className="font-semibold">Expert™ Advice:</span>{" "}
              {currentSelectedStock.advice}
            </p>
            <p>
              <span className="font-semibold">Value Equivalent:</span>{" "}
              {currentSelectedStock.unitEquivalent.value}{" "}
              {currentSelectedStock.unitEquivalent.unit}
            </p>
          </div>

          {/* Comparison View */}
          {compareMode && (
            <div className="pt-3 border-t border-dashed border-gray-300 dark:border-gray-600">
              {!compareStock ? (
                <p className="text-center text-sm text-blue-600 dark:text-blue-400 animate-pulse">
                  Select another stock from the list above to compare...
                </p>
              ) : currentCompareStock ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-center text-blue-700 dark:text-blue-300">
                    Comparing vs {currentCompareStock.name} (
                    {currentCompareStock.ticker})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded-md">
                    {/* Metric 1: vs Pet Rock */}
                    <div>
                      <div className="font-semibold">
                        {currentSelectedStock.ticker} vs Pet Rock:
                      </div>
                      <div>
                        {currentSelectedStock.comparisonMetrics.vsPetRock}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentCompareStock.ticker} vs Pet Rock:
                      </div>
                      <div>
                        {currentCompareStock.comparisonMetrics.vsPetRock}
                      </div>
                    </div>
                    {/* Metric 2: Meme Potential */}
                    <div>
                      <div className="font-semibold">
                        {currentSelectedStock.ticker} Meme Potential:
                      </div>
                      <div className="font-mono">
                        {currentSelectedStock.comparisonMetrics.memePotential}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentCompareStock.ticker} Meme Potential:
                      </div>
                      <div className="font-mono">
                        {currentCompareStock.comparisonMetrics.memePotential}
                      </div>
                    </div>
                    {/* Metric 3: Existential Weight */}
                    <div>
                      <div className="font-semibold">
                        {currentSelectedStock.ticker} Existential Wt:
                      </div>
                      <div>
                        {
                          currentSelectedStock.comparisonMetrics
                            .existentialWeight
                        }
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentCompareStock.ticker} Existential Wt:
                      </div>
                      <div>
                        {
                          currentCompareStock.comparisonMetrics
                            .existentialWeight
                        }
                      </div>
                    </div>
                    {/* Metric 4: Alignment with Chaos */}
                    <div>
                      <div className="font-semibold">
                        {currentSelectedStock.ticker} Chaos Align:
                      </div>
                      <div>
                        {
                          currentSelectedStock.comparisonMetrics
                            .alignmentWithChaos
                        }
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">
                        {currentCompareStock.ticker} Chaos Align:
                      </div>
                      <div>
                        {
                          currentCompareStock.comparisonMetrics
                            .alignmentWithChaos
                        }
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[9px] italic text-gray-500 dark:text-gray-400">
                    *Comparison metrics generated by highly unstable quantum
                    foam analysis. Do not operate heavy machinery after reading.
                  </p>
                </div>
              ) : (
                <p className="text-center text-sm text-red-500">
                  Error: Could not find comparison stock data.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Global Info Footer */}
      <div className="mt-4 text-center text-[10px] text-gray-500 dark:text-gray-400 space-y-0.5">
        {stocks.methodDescription && (
          <p>
            Selection Method:{" "}
            <span className="italic">{stocks.methodDescription}</span>
          </p>
        )}
        {stocks.chaosLevel && <p>Current Chaos Level: {stocks.chaosLevel}</p>}
        {stocks.mercuryRetrograde !== undefined && (
          <p>
            Mercury Status:{" "}
            <span
              className={
                stocks.mercuryRetrograde
                  ? "font-bold text-red-500 animate-pulse"
                  : "text-green-500"
              }
            >
              {stocks.mercuryRetrograde ? "RETROGRADE 🔄" : "Direct ➡️"}
            </span>
          </p>
        )}
      </div>

      {/* Disclaimers */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-[9px] text-center text-gray-500 dark:text-gray-400 italic space-y-0.5">
        {stocks.disclaimers.map((disclaimer, i) => (
          <p key={`disclaimer-${disclaimer.slice(0, 10)}-${i}`}>{disclaimer}</p>
        ))}
        <p className="font-bold mt-1 text-red-600 dark:text-red-400">
          {randomWarning()} Investing based on random emojis may lead to
          financial ruin or unexpected llamas. {randomWarning()}
        </p>
      </div>
    </div>
  );
}
