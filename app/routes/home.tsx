import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/home";
import React from "react";

// Stock Widget Component
function StockWidget() {
  const [stocks, setStocks] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredEmoji, setHoveredEmoji] = useState<{
    stock: string;
    emoji: string;
  } | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareStock, setCompareStock] = useState<string | null>(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stocks");
      if (!response.ok) {
        throw new Error("Failed to fetch stocks");
      }
      const data = await response.json();
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
  };

  useEffect(() => {
    fetchStocks();

    // Refresh stocks randomly between 40-60 seconds
    const interval = setInterval(() => {
      fetchStocks();
    }, Math.floor(Math.random() * 20000) + 40000);

    return () => clearInterval(interval);
  }, []);

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
    "🌪️": "🌀",
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

    const stock = stocks.stocks.find((s: any) => s.ticker === selectedStock);
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
            {stocks.stocks.map((stock: any) => (
              <div
                key={stock.ticker}
                onClick={() => selectStock(stock.ticker)}
                className={`bg-gray-100 dark:bg-gray-700 p-2 rounded-lg border cursor-pointer transition-colors ${
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
                        parseFloat(stock.movement) > 0
                          ? "text-green-500"
                          : parseFloat(stock.movement) < 0
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {parseFloat(stock.movement) > 0
                        ? "▲"
                        : parseFloat(stock.movement) < 0
                        ? "▼"
                        : "■"}{" "}
                      {Math.abs(parseFloat(stock.movement))}%
                    </span>
                  </div>
                  <div className="text-xl relative">
                    {/* Map each emoji in the array to a span with tooltip */}
                    {stock.emojiArray
                      ? stock.emojiArray.map((emoji: string, i: number) => (
                          <span
                            key={`${stock.ticker}-${i}`}
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
              </div>
            ))}
          </div>

          {/* Selected Stock Details */}
          {selectedStock && (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-300 dark:border-green-700 mt-3">
              {stocks.stocks
                .filter((s: any) => s.ticker === selectedStock)
                .map((stock: any) => (
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
                            parseFloat(stock.movement) > 0
                              ? "text-green-500"
                              : parseFloat(stock.movement) < 0
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {parseFloat(stock.movement) > 0
                            ? "▲"
                            : parseFloat(stock.movement) < 0
                            ? "▼"
                            : "■"}{" "}
                          {Math.abs(parseFloat(stock.movement))}%
                        </div>
                      </div>
                    </div>

                    {/* Emoji Translations */}
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md text-xs">
                      <div className="font-bold mb-1">Emoji Translation:</div>
                      <ul className="space-y-1">
                        {Object.values(stock.emojiMeanings).map(
                          (meaning: any, i: number) => (
                            <li key={i}>{meaning}</li>
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
                      onClick={toggleCompareMode}
                      className="text-xs text-red-500 dark:text-red-400"
                    >
                      Exit Comparison
                    </button>
                  </div>

                  {/* This is where we show the comparison */}
                  {stocks.stocks
                    .filter((s: any) => s.ticker === compareStock)
                    .map((stock: any) => {
                      const mainStock = stocks.stocks.find(
                        (s: any) => s.ticker === selectedStock
                      );
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
                                  ? mainStock.comparisonMetrics.alternate
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
                                  ? mainStock.comparisonMetrics.actual
                                  : stock.comparisonMetrics.actual}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span>Pizza Ratio:</span>
                              <span className="font-mono">
                                {(
                                  parseFloat(mainStock.pizzaEquivalent) /
                                  parseFloat(stock.pizzaEquivalent)
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
                                  : (Math.random() * 5 + 1).toFixed(1) + "/10"}
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
              <p key={i} className="mt-0.5">
                {disclaimer}
              </p>
            ))}
            <p className="mt-1 font-bold">
              WARNING: Staring at emojis for too long may cause financial
              hallucinations
            </p>
          </div>

          {/* Disclaimers */}
          <div className="text-[9px] text-center text-gray-500 dark:text-gray-400 mt-1 italic">
            <p>+1 bonus emoji for cosmic insight</p>
          </div>
        </div>
      )}
    </div>
  );
}

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

// Weather Widget Component
function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [weirdTemp, setWeirdTemp] = useState<any>(null);
  const [pinEmoji, setPinEmoji] = useState<string>("📍");

  // Random rotating warning icons
  const warningIcons = ["⚠️", "🚨", "⛔", "🆘", "‼️"];
  const randomWarning = () =>
    warningIcons[Math.floor(Math.random() * warningIcons.length)];

  // Convert Fahrenheit to random weird units
  const convertToWeirdUnit = (tempF: number) => {
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
    const randomUnit =
      weirdUnits[Math.floor(Math.random() * weirdUnits.length)];
    const convertedTemp = randomUnit.convert(tempF);

    return {
      temperature: convertedTemp,
      unit: randomUnit.name,
      suffix: randomUnit.suffix,
      explanation: randomUnit.explanation,
    };
  };

  // Pick a weird emoji for the map pin
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
      "🦄",
    ];
    return weirdPins[Math.floor(Math.random() * weirdPins.length)];
  };

  // Weather fetching function
  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/weather");
      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }
      const data = await response.json();
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
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchWeather();
  }, []);

  // Countdown timer effect - handles the weather refresh
  useEffect(() => {
    if (!weather) return;

    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [weather]);

  // Separate effect to handle refresh when countdown reaches zero
  useEffect(() => {
    if (countdown === 0 && weather) {
      fetchWeather();
    }
  }, [countdown, weather]);

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
    <div className="flex justify-center items-center text-[9px] text-gray-500 dark:text-gray-400 mt-2">
      <span className="flex items-center">
        <span className="mr-1">Updating in</span>
        <span className="font-mono font-semibold">{countdown}</span>
        <span className="animate-pulse ml-1">...</span>
      </span>
      <button
        type="button"
        onClick={() => fetchWeather()}
        className="ml-2 text-blue-500 dark:text-blue-400 underline"
      >
        Refresh
      </button>
    </div>
  );

  if (loading && !weather) {
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
        <p className="font-bold text-center">
          {randomWarning()} WEATHER SYSTEM FAILURE {randomWarning()}
        </p>
        <p className="text-sm mt-2">
          Brace for unknown meteorological conditions!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-40">
      {weather && weirdTemp && (
        <div className="space-y-2">
          <div className="text-center">
            <span className="text-xl font-bold">{weather.city}</span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span
                className="text-lg group relative"
                title={weirdTemp.explanation}
              >
                {weirdTemp.temperature}{" "}
                <span className="text-sm">
                  {weirdTemp.unit} [{weirdTemp.suffix}]
                </span>
                {/* Tooltip on hover */}
                <span className="invisible group-hover:visible absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap">
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

          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
            <p className="text-red-600 dark:text-red-400 font-bold text-center text-xs">
              {randomWarning()} URGENT ALERT {randomWarning()}
            </p>
            <p className="text-xs text-center mt-1 leading-tight">
              {weather.condition}
            </p>
          </div>

          <div className="bg-red-100 dark:bg-red-900 p-2 rounded-lg border border-red-300 dark:border-red-700">
            <p className="text-xs font-bold text-center leading-tight break-words">
              {weather.forecast}
            </p>
          </div>

          <div className="mt-1 text-[10px] text-center italic">
            <p className="font-bold text-orange-600 dark:text-orange-400 leading-tight">
              {weather.advice}
            </p>
          </div>

          {/* Separate countdown timer component */}
          <CountdownTimer />
        </div>
      )}

      {loading && weather && (
        <div className="min-h-40 flex flex-col items-center justify-center">
          <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold animate-pulse">
            FETCHING CRITICAL WEATHER DATA
          </p>
          <p className="text-[10px] text-gray-500 mt-1">
            (your survival depends on it)
          </p>
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
  return {
    message:
      context.cloudflare.env.VALUE_FROM_CLOUDFLARE ||
      "Welcome to the World's Dumbest Domain!",
  };
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
        setError(
          "Failed to generate a haiku. The AI must be feeling uninspired today."
        );
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

// Main content component - will hold horoscope selector and CAPTCHA
function MainContent() {
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h1 className="text-4xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">
        World's Dumbest Domain
      </h1>
      <div className="text-center text-gray-700 dark:text-gray-300 space-y-4">
        <p className="text-xl">Welcome to worldsdumbestdomain.com</p>
        <p>
          The main content area will feature the horoscope selector and CAPTCHA
          challenge.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Coming soon...
        </p>
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
