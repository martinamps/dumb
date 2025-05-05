import React, { useState, useEffect, useCallback } from "react";
import type { KeyboardEvent } from "react"; // Import specific type

// Define the type for a single stock item - replace 'any'
interface Stock {
  ticker: string;
  price: string;
  movement: string;
  emojis: string;
  emojiArray: string[];
  emojiMeanings: Record<string, string>;
  name: string;
  sector: string;
  advice: string;
  pizzaEquivalent: string;
  foodEquivalent?: {
    value: string;
    unit: string;
  };
  comparisonMetrics?: {
    // Assuming this structure based on usage
    alternate: string;
    actual: string;
  };
}

// Define the type for the API response - replace 'any'
interface StockData {
  stocks: Stock[];
  chaosLevel?: number;
  marketSentiment?: string;
  cosmicAlignment?: string;
  mercuryRetrograde?: boolean;
  disclaimers: string[];
}

// Stock Widget Component
export function StockWidget() {
  const [stocks, setStocks] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredEmoji, setHoveredEmoji] = useState<{
    stock: string;
    emoji: string;
  } | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareStock, setCompareStock] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stocks");
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }
      const data: StockData = await response.json();
      setStocks(data);
      setError(null);

      // Reset selections when we get new data
      setSelectedStock(null);
      setCompareStock(null);
      setCompareMode(false);
    } catch (err) {
      setError("CRITICAL FINANCIAL DATA FAILURE!!!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();

    // Refresh stocks randomly between 40-60 seconds
    const interval = setInterval(() => {
      fetchStocks();
    }, Math.floor(Math.random() * 20000) + 40000);

    return () => clearInterval(interval);
  }, [fetchStocks]);

  // Set emoji tooltips (which are just more emojis)
  const emojiTooltips: Record<string, string> = {
    // Original elemental emojis
    "🔥": "🌋",
    "💧": "🌊",
    "🌪️": "🌀",
    "🪨": "🏔️",
    "⚡": "⛈️",
    // New elemental emojis
    "🌱": "🌿",
    "❄️": "☃️",
    "☁️": "🌫️",
    "⭐": "✨",
    "🌈": "🌟",

    // Original movement emojis
    "🚀": "📈",
    "💀": "📉",
    "🥱": "➖",
    // New movement emojis
    "📈": "📊",
    "📉": "📋",
    "🌋": "💥",
    "🕳️": "🧿",
    "🧨": "💣",
    "🎢": "🎡",
    "🏄": "🏊",

    // Original animal emojis
    "🐢": "🐌",
    "🦊": "🦝",
    "🦄": "🐴",
    // New animal emojis
    "🦘": "🦒",
    "🐙": "🦑",
    "🦜": "🦢",
    "🦓": "🦛",
    "🦦": "🦫",
    "🦝": "🦡",
    "🦔": "🦙",

    // Original food emojis
    "🍄": "🌑",
    "🍕": "🌓",
    "🍦": "🌕",
    "🥑": "🌗",
    // New food emojis
    "🌮": "🌯",
    "🥐": "🥖",
    "🍩": "🍪",
    "🍗": "🍖",
    "🥝": "🍓",
    "🍰": "🧁",

    // Original random emojis
    "💰": "💎",
    "🧠": "🤔",
    "🔮": "✨",
    "⚔️": "💢",
    "🧿": "👁️",
    "🎭": "🎭",
    "🎪": "🎡",
    "📿": "🙏",
    "🧩": "🔍",
    "🪄": "✨",
    // New random emojis
    "🎯": "🎮",
    "🧬": "🔬",
    "👾": "👹",
    "💎": "💍",
    "🛸": "🚀",
    "👑": "🏆",
    "🧪": "⚗️",
    "🔍": "🔎",
    "💉": "💊",
    "🧸": "🎁",

    // Costume emojis
    "🤖": "🦿",
    "👽": "👾",
    "👻": "💀",
    "🧙": "🧙‍♀️",
    "🧟": "🧟‍♂️",
    "🦹": "🦹‍♀️",
    "🧞": "🧞‍♀️",
    "🦸": "🦸‍♂️",
    "🧚": "🧚‍♀️",
    "🧜": "🧜‍♀️",

    // Weather emojis
    "🌞": "☀️",
    "🌧️": "☔",
    "⛈️": "🌩️",
    "🌨️": "❄️",
    // "🌪️": "🌀", // Duplicate key removed
    "🌫️": "☁️",
    "☃️": "⛄",
    "🌊": "🏄‍♂️",

    // Building emojis
    "🏠": "🏡",
    "🏢": "🏬",
    "🏰": "🏯",
    "⛩️": "🛕",
    "🏯": "🏭",
    "🏛️": "🏗️",
    "🏗️": "🏙️",
    "🏭": "🏢",
    "⛪": "🕌",
    "🏟️": "🏘️",

    // Vehicle emojis
    "🚗": "🚙",
    "🚂": "🚆",
    "⛵": "🚢",
    "🚁": "🛩️",
    "🏎️": "🚓",
    "🛵": "🏍️",
    "🚢": "⛴️",
    "🛩️": "✈️",

    // Plant emojis
    "🌵": "🌴",
    "🌴": "🏝️",
    "🌲": "🌳",
    "🍀": "☘️",
    "🌿": "🌱",
    "🌳": "🌲",
    "🎋": "🎍",
    "🌼": "🌺",
  };

  // Generate emoji tooltip
  const getEmojiTooltip = (emoji: string) => {
    return emojiTooltips[emoji] || "❓";
  };

  // Handle toggle compare mode
  const toggleCompareMode = () => {
    if (compareMode) {
      // Exit compare mode
      setCompareMode(false);
      setCompareStock(null);
    } else {
      // Enter compare mode if a stock is selected
      if (selectedStock) {
        setCompareMode(true);
      }
    }
  };

  // Select a stock for comparison
  const handleCompareSelect = (ticker: string) => {
    if (compareMode && ticker !== selectedStock) {
      setCompareStock(ticker);
    }
  };

  // Handle stock selection
  const selectStock = (ticker: string) => {
    if (compareMode) {
      if (ticker !== selectedStock) {
        setCompareStock(ticker);
      }
    } else {
      setSelectedStock(ticker);
    }
  };

  // Get chart patterns based on emoji combinations
  const getChartPattern = () => {
    if (!selectedStock || !stocks) return null;

    const stock = stocks.stocks.find((s: Stock) => s.ticker === selectedStock);
    if (!stock) return null;

    const emojiSequence = stock.emojis;
    const patterns = [
      // Original patterns
      {
        name: "The Angry Cat",
        emojis: ["🔥", "💀"],
        description: "Rapid drops followed by unpredictable rebounds",
      },
      {
        name: "The Dancing Taco",
        emojis: ["🪨", "🚀"],
        description: "Steady climbs interrupted by brief consolidations",
      },
      {
        name: "The Lazy River",
        emojis: ["💧", "🐢"],
        description: "Slow, meandering price action with no clear direction",
      },
      {
        name: "The Unicorn Stampede",
        emojis: ["⚡", "🦄"],
        description: "Explosive growth that defies all logic and fundamentals",
      },
      {
        name: "The Pizza Moon",
        emojis: ["🍕", "🔮"],
        description: "Cyclical patterns influenced by lunar cycles and hunger",
      },
      {
        name: "The Ice Cream Headache",
        emojis: ["🍦", "🧠"],
        description: "Sharp spikes followed by painful corrections",
      },
      {
        name: "The Avocado Toast",
        emojis: ["🥑", "💰"],
        description: "Millennial-driven momentum that's unsustainable",
      },
      {
        name: "The Chaos Turtle",
        emojis: ["🌪️", "🐢"],
        description:
          "Volatility that eventually resolves to slow steady growth",
      },
      // New cosmic patterns with expanded emoji sets
      {
        name: "The Celestial Convergence",
        emojis: ["⭐", "🌈", "🚀"],
        description:
          "Rare alignment of positive indicators across multiple timeframes",
      },
      {
        name: "The Space Kitten",
        emojis: ["🛸", "👾", "🌌"],
        description:
          "Sudden jumps between price levels with no discernible pattern",
      },
      {
        name: "The Quantum Waffle",
        emojis: ["🧇", "🧪", "🔬"],
        description:
          "Price exists in multiple states simultaneously until observed by analysts",
      },
      {
        name: "The Hypnotic Spiral",
        emojis: ["🌀", "👁️", "🧿"],
        description:
          "Mesmerizing oscillations that trap traders in psychological loops",
      },
      {
        name: "The Ancient Prophecy",
        emojis: ["🏛️", "📜", "🧙"],
        description:
          "Pattern only recognizable to traders with 20+ years of experience",
      },
      {
        name: "The Interdimensional Portal",
        emojis: ["🕳️", "🌌", "🔮"],
        description:
          "Stock price appears to connect to alternate reality markets",
      },
      {
        name: "The Temporal Paradox",
        emojis: ["⏰", "📊", "🔄"],
        description:
          "Future price movement appears to influence past performance",
      },
      {
        name: "The Cosmic Burrito",
        emojis: ["🌮", "🌯", "🌠"],
        description:
          "Everything wrapped up in an unpredictable but satisfying package",
      },
      {
        name: "The Haunted Algorithm",
        emojis: ["👻", "🤖", "💻"],
        description:
          "Trading bots exhibit inexplicable behavior during certain hours",
      },
      {
        name: "The Caffeinated Kangaroo",
        emojis: ["☕", "🦘", "💥"],
        description:
          "Erratic bounces with increasing amplitude until sudden exhaustion",
      },
      {
        name: "The Perpetual Mirage",
        emojis: ["🌵", "🏜️", "💦"],
        description:
          "Chart pattern that suggests profits which never materialize",
      },
      {
        name: "The Weather Wizard",
        emojis: ["🌞", "🌧️", "🧙‍♂️"],
        description:
          "Stock price correlates suspiciously with local weather patterns",
      },
      {
        name: "The Confused Penguin",
        emojis: ["🐧", "❄️", "🏝️"],
        description:
          "Pattern that seems completely out of place in current market conditions",
      },
      {
        name: "The Cosmic Giggle",
        emojis: ["😂", "🌌", "🎭"],
        description:
          "Market movement that can only be explained as a cosmic joke",
      },
      {
        name: "The Schrödinger's Trade",
        emojis: ["📦", "🐱", "❓"],
        description:
          "Position that's simultaneously profitable and unprofitable until closed",
      },
    ];

    // Find patterns that match at least one emoji in the sequence
    const matchingPatterns = patterns.filter((pattern) =>
      pattern.emojis.some((emoji) => emojiSequence.includes(emoji))
    );

    if (matchingPatterns.length === 0) {
      return {
        name: "The Confused Investor",
        description: "No recognizable pattern - pure randomness",
      };
    }

    // Return a random matching pattern
    return matchingPatterns[
      Math.floor(Math.random() * matchingPatterns.length)
    ];
  };

  // Random rotating warning icons (reused from weather widget)
  const warningIcons = ["⚠️", "🚨", "⛔", "🆘", "‼️"];
  const randomWarning = () =>
    warningIcons[Math.floor(Math.random() * warningIcons.length)];

  if (loading) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center">
        <p className="text-green-600 dark:text-green-400 font-bold animate-pulse">
          FETCHING CRITICAL FINANCIAL DATA!!!
        </p>
        <p className="text-sm text-gray-500 mt-2">
          (your portfolio depends on it)
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-40 flex flex-col items-center justify-center text-red-600 dark:text-red-400">
        <p className="font-bold text-center">
          {randomWarning()} MARKET FAILURE {randomWarning()}
        </p>
        <p className="text-sm mt-2">
          Emoji markets have crashed! Please try refreshing.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-40">
      {stocks && (
        <div className="space-y-2">
          {/* Legend */}
          <div className="text-[10px] text-center text-gray-500 dark:text-gray-400 mb-2">
            <div className="grid grid-cols-2 gap-1 max-w-xs mx-auto mt-1">
              <div className="flex items-center gap-1">
                <span className="text-lg inline-block">
                  🔥/💧/🌪️/🪨/⚡/🌱/❄️/☁️...
                </span>
                <span>Elemental resonance</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg inline-block">
                  🚀/💀/🥱/📈/📉/🌋/🕳️...
                </span>
                <span>Vibrational frequency</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg inline-block">
                  🐢/🦊/🦄/🦘/🐙/🦜/🦓...
                </span>
                <span>Temporal signature</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-lg inline-block">
                  🍄/🍕/🍦/🥑/🌮/🥐...
                </span>
                <span>Cosmic momentum</span>
              </div>
              <div className="flex items-center gap-1 col-span-2 mt-1 justify-center">
                <span className="text-lg inline-block">
                  +🤖/👽/👻/🧙/🧟/🦹/🧞/🏠/🏢/🚗/🚂/🌵/🌴...
                </span>
                <span>Quantum fluctuations</span>
              </div>
            </div>
            <div className="text-[8px] italic mt-1">
              * Symbols periodically redistributed according to celestial
              mechanics
            </div>
          </div>

          {/* Stocks List */}
          <div className="space-y-2">
            {stocks.stocks.map((stock: Stock, stockIndex: number) => (
              <button
                type="button"
                key={stock.ticker}
                onClick={() => selectStock(stock.ticker)}
                className={`w-full text-left bg-gray-100 dark:bg-gray-700 p-2 rounded-lg border cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 ${
                  selectedStock === stock.ticker
                    ? "border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20"
                    : compareStock === stock.ticker
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold">{stock.ticker}</span>
                    <span className="text-xs ml-1.5 text-gray-500 dark:text-gray-400">
                      ${stock.price}
                    </span>
                    <span
                      className={`text-xs ml-1.5 ${
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
                        : "■"}{" "}
                      {Math.abs(Number.parseFloat(stock.movement))}%
                    </span>
                  </div>
                  <div className="text-xl relative">
                    {/* Map each emoji in the array to a span with tooltip */}
                    {stock.emojiArray
                      ? stock.emojiArray.map((emoji: string, i: number) => (
                          <span
                            key={`${stock.ticker}-${emoji}-${i}`} // Make key more unique
                            className="relative inline-block"
                            onMouseEnter={() =>
                              setHoveredEmoji({ stock: stock.ticker, emoji })
                            }
                            onMouseLeave={() => setHoveredEmoji(null)}
                            title={
                              Object.values(stock.emojiMeanings)[i] as string
                            }
                          >
                            {emoji}
                            {hoveredEmoji &&
                              hoveredEmoji.stock === stock.ticker &&
                              hoveredEmoji.emoji === emoji && (
                                <span className="absolute -top-6 left-0 text-2xl z-10">
                                  {getEmojiTooltip(emoji)}
                                </span>
                              )}
                          </span>
                        ))
                      : // Fallback in case emojiArray isn't available
                        stock.emojis}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Stock Details */}
          {selectedStock && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-300 dark:border-green-700 mt-3">
              {stocks.stocks
                .filter((s: Stock) => s.ticker === selectedStock)
                .map((stock: Stock) => (
                  <div key={`detail-${stock.ticker}`} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{stock.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {stock.sector}
                        </p>
                      </div>
                      <div className="text-sm">
                        <div className="text-right font-mono">
                          ${stock.price}
                        </div>
                        <div
                          className={`text-right ${
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
                            : "■"}{" "}
                          {Math.abs(Number.parseFloat(stock.movement))}%
                        </div>
                      </div>
                    </div>

                    {/* Emoji Translations */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-xs">
                      <div className="font-bold mb-1">Emoji Translation:</div>
                      <ul className="space-y-1">
                        {Object.entries(stock.emojiMeanings).map(
                          ([emoji, meaning], i) => (
                            <li key={`${stock.ticker}-meaning-${i}`}>
                              {meaning}
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    {/* Financial Advice */}
                    <div className="bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-md">
                      <p className="text-xs font-semibold">
                        {randomWarning()} EXPERT FINANCIAL ADVICE{" "}
                        {randomWarning()}
                      </p>
                      <p className="text-xs mt-1 italic">{stock.advice}</p>
                    </div>

                    {/* Performance Metrics */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                      <p className="text-xs font-semibold">
                        Performance Metrics:
                      </p>
                      <p className="text-xs mt-1">
                        Value:{" "}
                        <span className="font-mono">
                          {stock.pizzaEquivalent}
                        </span>{" "}
                        pizzas 🍕
                      </p>
                      {stock.foodEquivalent && (
                        <p className="text-xs mt-1">
                          Alternative Value:{" "}
                          <span className="font-mono">
                            {stock.foodEquivalent.value}
                          </span>{" "}
                          {stock.foodEquivalent.unit}{" "}
                          {stock.foodEquivalent.unit === "pizzas"
                            ? "🍕"
                            : stock.foodEquivalent.unit === "burritos"
                            ? "🌯"
                            : stock.foodEquivalent.unit === "coffees"
                            ? "☕"
                            : stock.foodEquivalent.unit === "avocado toasts"
                            ? "🥑"
                            : stock.foodEquivalent.unit === "ramen bowls"
                            ? "🍜"
                            : stock.foodEquivalent.unit === "ice cream cones"
                            ? "🍦"
                            : stock.foodEquivalent.unit === "movie tickets"
                            ? "🎬"
                            : stock.foodEquivalent.unit === "subway rides"
                            ? "🚇"
                            : stock.foodEquivalent.unit === "fancy cupcakes"
                            ? "🧁"
                            : "🍽️"}
                        </p>
                      )}
                      {stocks.chaosLevel && (
                        <p className="text-xs mt-1">
                          Cosmic Uncertainty Level:{" "}
                          <span className="font-mono">{stocks.chaosLevel}</span>
                          /10{" "}
                          <span className="text-[9px]">
                            (±{(Math.random() * 3).toFixed(1)})
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Chart Pattern Analysis */}
                    {getChartPattern() && (
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-md">
                        <p className="text-xs font-semibold">
                          Chart Pattern:{" "}
                          <span className="italic">
                            {getChartPattern()?.name}
                          </span>
                        </p>
                        <p className="text-xs mt-1">
                          {getChartPattern()?.description}
                        </p>
                      </div>
                    )}

                    {/* Cosmic Market Status */}
                    {(stocks.marketSentiment ||
                      stocks.cosmicAlignment ||
                      stocks.mercuryRetrograde) && (
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-md">
                        <p className="text-xs font-semibold">
                          Cosmic Market Status:
                        </p>
                        {stocks.marketSentiment && (
                          <p className="text-xs mt-1">
                            Market Sentiment:{" "}
                            <span className="font-medium">
                              {stocks.marketSentiment.charAt(0).toUpperCase() +
                                stocks.marketSentiment.slice(1)}
                            </span>{" "}
                            {stocks.marketSentiment === "euphoric"
                              ? "🤩"
                              : stocks.marketSentiment === "optimistic"
                              ? "😊"
                              : stocks.marketSentiment === "cautious"
                              ? "😐"
                              : stocks.marketSentiment === "pessimistic"
                              ? "😟"
                              : stocks.marketSentiment === "apocalyptic"
                              ? "😱"
                              : "🤔"}
                          </p>
                        )}
                        {stocks.cosmicAlignment && (
                          <p className="text-xs mt-1">
                            Cosmic Alignment:{" "}
                            <span
                              className={
                                stocks.cosmicAlignment === "favorable"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {stocks.cosmicAlignment.charAt(0).toUpperCase() +
                                stocks.cosmicAlignment.slice(1)}
                            </span>{" "}
                            {stocks.cosmicAlignment === "favorable"
                              ? "✨"
                              : "☄️"}
                          </p>
                        )}
                        {stocks.mercuryRetrograde !== undefined && (
                          <p className="text-xs mt-1">
                            Mercury Status:{" "}
                            <span
                              className={
                                stocks.mercuryRetrograde
                                  ? "text-red-600 font-bold"
                                  : "text-green-600"
                              }
                            >
                              {stocks.mercuryRetrograde
                                ? "RETROGRADE"
                                : "Direct"}
                            </span>{" "}
                            {stocks.mercuryRetrograde ? "🔄" : "➡️"}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Comparison Mode */}
                    {!compareMode && (
                      <button
                        type="button"
                        onClick={toggleCompareMode}
                        className="w-full text-xs bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 transition-colors"
                      >
                        Compare With Another Stock
                      </button>
                    )}
                  </div>
                ))}

              {/* Comparison View */}
              {compareMode && compareStock && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-bold">Comparison View</h3>
                    <button
                      type="button"
                      onClick={toggleCompareMode}
                      className="text-xs text-red-500 dark:text-red-400"
                    >
                      Exit Comparison
                    </button>
                  </div>

                  {/* This is where we show the comparison */}
                  {stocks.stocks
                    .filter((s: Stock) => s.ticker === compareStock)
                    .map((stock: Stock) => {
                      const mainStock = stocks.stocks.find(
                        (s: Stock) => s.ticker === selectedStock
                      );

                      if (!mainStock || !stock.comparisonMetrics) {
                        return null; // Or some placeholder if mainStock might be missing
                      }

                      const isReversed = Math.random() < 0.5; // 50% chance we're showing the wrong stock

                      return (
                        <div
                          key={`compare-${stock.ticker}`}
                          className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-md"
                        >
                          <div className="flex justify-between text-xs">
                            <div>
                              <span className="font-bold">
                                {isReversed ? mainStock.ticker : stock.ticker}
                              </span>
                              <span className="ml-2">{stock.emojis}</span>
                            </div>
                            <div>
                              <span className="font-mono">
                                ${isReversed ? mainStock.price : stock.price}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2 text-xs">
                            <div className="font-semibold">
                              Performance Comparison:
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>vs. Market:</span>
                              <span
                                className={
                                  Math.random() < 0.5
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {isReversed
                                  ? mainStock.comparisonMetrics?.alternate
                                  : stock.comparisonMetrics.alternate}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>vs. Sector:</span>
                              <span
                                className={
                                  Math.random() < 0.5
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {isReversed
                                  ? mainStock.comparisonMetrics?.actual
                                  : stock.comparisonMetrics.actual}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Pizza Ratio:</span>
                              <span className="font-mono">
                                {(
                                  Number.parseFloat(mainStock.pizzaEquivalent) /
                                  Number.parseFloat(stock.pizzaEquivalent)
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Cosmic Resonance:</span>
                              <span
                                className={
                                  Math.random() < 0.5
                                    ? "text-purple-600"
                                    : "text-orange-600"
                                }
                              >
                                {(Math.random() * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Quantum Entanglement:</span>
                              <span
                                className={
                                  Math.random() < 0.3
                                    ? "text-red-600 font-bold"
                                    : ""
                                }
                              >
                                {Math.random() < 0.3
                                  ? "CRITICAL"
                                  : `${(Math.random() * 5 + 1).toFixed(1)}/10`}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* Disclaimers */}
          <div className="text-[9px] text-center text-gray-500 dark:text-gray-400 italic mt-2">
            {stocks.disclaimers.map((disclaimer: string, i: number) => (
              <p
                key={`disclaimer-${disclaimer.slice(0, 10)}-${i}`}
                className="mt-0.5"
              >
                {disclaimer}
              </p>
            ))}
            <p className="mt-1 font-bold">
              WARNING: Staring at emojis for too long may cause financial
              hallucinations
            </p>
          </div>

          {/* Bonus Disclaimer */}
          <div className="text-[9px] text-center text-gray-500 dark:text-gray-400 mt-1 italic">
            <p>+1 bonus emoji for cosmic insight</p>
          </div>
        </div>
      )}
    </div>
  );
}
