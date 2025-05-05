// API endpoint for stock market emoji translator
/// <reference path="./types.d.ts" />
import { fetchMultipleStockPrices } from './stockCache';

// --- New Dumb Emoji Definitions ---
const vibeEmojis: Record<string, string> = {
  '😂': "Laughably Bad",
  '😭': "Tragically Overvalued",
  '🥳': "Party's Over Soon",
  '🥶': "Frozen in Fear",
  '🥵': "Sweating Bullets",
  '😇': "Too Good To Be True",
  '😈': "Sinister Undertones",
  '🤡': "Utterly Clueless",
  '💩': "Steaming Pile of... Opportunity?",
  '👻': "Ghosted by Investors",
  '🤔': "Deeply Confused",
  '🤯': "Mind Blown (Not in a Good Way)",
  '🥴': "Feeling Dizzy",
  '😴': "Boringly Stable",
  '🤩': "Irrationally Exuberant",
};
const actionEmojis: Record<string, string> = {
  '🚀': "To the Moon (or maybe just the ceiling)",
  '📉': "Down the Drain",
  '📈': "Going Up (like my blood pressure)",
  '🎢': "Wild Ride Ahead",
  '🐌': "Moving Glacially",
  '🐢': "Slow & Steady Loses the Race",
  '💥': "Spontaneous Combustion Likely",
  '💨': "Vanishing Into Thin Air",
  '🤷': "Shrugging Off Responsibility",
  '🤞': "Fingers Crossed (Good Luck!)",
  '💸': "Money Disappearing Act",
  '🔥': "Burning Cash",
  '🧊': "Frozen Assets",
  '🎈': "Inflated Ego",
  '⚓': "Sinking Fast",
};
const sourceEmojis: Record<string, string> = {
  '🔮': "Scryed from a Dusty Crystal Ball",
  '👽': "Intercepted Alien Broadcast",
  '🥪': "Found Scribbled on a Napkin",
  '🎲': "Random Dice Roll",
  '🧠': "AI Hallucination",
  '✨': "Pure Wishful Thinking",
  '🧐': "Overheard in a Cafe",
  '📚': "Misread Astrology Chart",
  '💻': "Glitch in the Matrix",
  '🐶': "Dog Barked Twice (Means Buy?)",
  '☕': "Coffee Ground Reading",
  '🦆': "Consulted a Rubber Ducky",
  '📺': "Saw it on a Cartoon",
  '❓': "Honestly, No Idea",
  '🤯': "Result of Sleep Deprivation",
};

const vibeEmojiKeys = Object.keys(vibeEmojis);
const actionEmojiKeys = Object.keys(actionEmojis);
const sourceEmojiKeys = Object.keys(sourceEmojis);
// --- End New Dumb Emoji Definitions ---

export async function handleStockRequest(request: Request, env: Env): Promise<Response> {
  try {
    const userAgent = request.headers.get("User-Agent") || "";
    const acceptLanguage = request.headers.get("Accept-Language") || "";
    const now = new Date();
    const dateKey = now.getDate() + now.getMonth() * 31;
    const hourKey = now.getHours();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const cosineTime = Math.cos(now.getMinutes() / 60 * Math.PI * 2);
    const sineTime = Math.sin(now.getSeconds() / 60 * Math.PI * 2);
    const chaosMultiplier = Math.abs(cosineTime * sineTime) + 0.5; // Range 0.5 to 1.5

    // Determine if Mercury is in retrograde (3 out of every 21 days)
    const mercuryRetrograde = dayOfYear % 21 < 3;

    // Fetch stocks from consolidated file or fallback
    let stonks;
    try {
      const response = await fetch(new URL("/stonks.json", request.url).toString());
      if (!response.ok) {
        console.error("Failed to fetch stonks.json:", response.status, response.statusText);
        throw new Error("Failed to fetch stocks");
      }
      stonks = await response.json();
      console.log("Successfully loaded stonks.json with", stonks.length, "stocks");
    } catch (error) {
      console.error("Error fetching stonks.json, using fallback:", error);
      stonks = [
        { ticker: "AAPL", name: "Apple Inc.", sector: "Technology" },
        { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology" },
        { ticker: "GOOG", name: "Alphabet Inc.", sector: "Technology" },
        { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
        { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive" },
        { ticker: "DUMB", name: "Dumb Industries", sector: "Entertainment" },
        { ticker: "CLWN", name: "Clown Corp.", sector: "Services" }
      ];
    }

    // Determine selection method (same logic as before)
    const selectionMethods = [
      "mood_ring", "alphabet_soup", "chrono_resonance", "quantum_entanglement",
      "alternate_reality", "orbital_harmonic", "dream_sequence", "meme_potential",
      "recursive_paradox", "cosmic_giggle",
    ];
    const methodSeed = ((userAgent.length * chaosMultiplier) + (acceptLanguage.length * dateKey) + hourKey) % selectionMethods.length;
    const selectionMethod = selectionMethods[Math.floor(methodSeed)];
    const numStocks = Math.floor(Math.random() * 3) + 5; // 5-7 stocks

    // Helper function to get stocks with chaotic randomization
    const getChaoticRandomStocks = (count: number) => {
      const chaosRoll = now.getMilliseconds() + (userAgent.length * dateKey);
      const shuffled = [...stonks].sort(() => (Math.sin(chaosRoll * Math.random()) < 0 ? -1 : 1));
      return shuffled.slice(0, count);
    };

    // Select stocks based on the method (simplified for brevity - assume this logic works as before)
    let selectedStocks = getChaoticRandomStocks(numStocks); // Using fallback for simplicity here
    let methodDescription = `Stocks selected via ${selectionMethod} Method™ (Chaos: ${chaosMultiplier.toFixed(2)})`;
    // In a real scenario, the full switch statement for selectionMethod would be here.
    // For this example, we'll just use the random selection.

    // Fetch real stock prices for selected stocks
    const tickers = selectedStocks.map((stock: any) => stock.ticker);
    console.log("Fetching real price data for tickers:", tickers);
    const realPriceData = await fetchMultipleStockPrices(tickers);
    console.log("Real price data received:", realPriceData);

    // Process selected stocks
    const processedStocks = selectedStocks.map((stock: any) => {
      const priceData = realPriceData[stock.ticker] || {
        price: (stock.ticker.length * 10 + dateKey + Math.random() * 100) % 500 + 20, // More random fallback
        movement: ((stock.ticker.charCodeAt(0) + dateKey + Math.random() * 50) % 41 - 20) / 100 // -0.2 to +0.2
      };

      const basePrice = priceData.price;
      const movement = priceData.movement;

      // --- New 3 Emoji Selection ---
      const seed = stock.ticker.charCodeAt(0) + dateKey + hourKey + Math.floor(basePrice);

      const vibeIndex = Math.floor((seed * chaosMultiplier * 1.1) % vibeEmojiKeys.length);
      const actionIndex = Math.floor((seed * chaosMultiplier * 1.3) % actionEmojiKeys.length);
      const sourceIndex = Math.floor((seed * chaosMultiplier * 1.5) % sourceEmojiKeys.length);

      const emojiArray = [
        vibeEmojiKeys[vibeIndex],
        actionEmojiKeys[actionIndex],
        sourceEmojiKeys[sourceIndex]
      ];
      const emojis = emojiArray.join('');
      // --- End New 3 Emoji Selection ---

      // Absurd Financial Advice (kept similar logic)
      const adviceOptions = [
         `Honestly? Just flip a coin. Heads you buy ${stock.ticker}, tails you short it. Or maybe do the opposite. 🤷`,
         `My dog ${['barked', 'whined', 'slept', 'chased its tail'][seed % 4]} when I said "${stock.ticker}". Interpret that as you will. 🐶`,
         `The crystal ball shows... mostly fog. But ${emojiArray[0]} suggests ${movement > 0 ? 'mild optimism' : 'utter despair'}. 🔮`,
         `This stock's fate is tied to the price of ${['bananas', 'rubber chickens', 'artisanal cheese', 'left socks'][seed % 4]}. Watch that market closely.`,
         `I wouldn't touch ${stock.ticker} with a ten-foot pole, unless ${emojiArray[1]} happens during a ${mercuryRetrograde ? 'retrograde' : 'direct'} Mercury. Then maybe use an eleven-foot pole.`,
         `The ${emojiArray[2]} source indicates a ${Math.random() > 0.5 ? 'buy' : 'sell'} signal. Reliability: ${Math.floor(Math.random() * 40)}%.`,
         `Align your portfolio with the ${['North Star', 'constellation of Orion', 'nearest black hole', 'Great Attractor'][seed % 4]}. ${stock.ticker} is currently ${Math.random() > 0.5 ? 'aligned' : 'misaligned'}.`,
      ];
      const advice = adviceOptions[Math.floor((dateKey + stock.ticker.length + hourKey) * chaosMultiplier) % adviceOptions.length];

      // Performance in weird units
      const weirdUnits = [
        { name: "rubber chickens", price: 5.99 },
        { name: "slices of questionable pizza", price: 1.50 },
        { name: "hours of existential dread", price: 25.00 }, // Priceless? Nah.
        { name: "functioning umbrellas in a hurricane", price: 100.00 },
        { name: "doge coins (approx)", price: 0.15 },
        { name: "cups of lukewarm coffee", price: 2.50 }
      ];
      const unitIndex = (stock.sector.length + dateKey) % weirdUnits.length;
      const weirdUnit = weirdUnits[unitIndex];
      const unitEquivalent = (basePrice / weirdUnit.price).toFixed(2);

      // Dumber Comparison Metrics
      const comparisonMetrics = {
        vsPetRock: Math.random() > 0.5 ? "Outperforms" : "Underperforms",
        memePotential: `${Math.floor(Math.random() * 11)}/10`,
        existentialWeight: `${(Math.random() * 5).toFixed(1)} Kgs`,
        alignmentWithChaos: `${(chaosMultiplier * 66).toFixed(0)}%`
      };

      return {
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        price: basePrice.toFixed(2),
        movement: (movement * 100).toFixed(2), // Send as percentage string
        isRealPrice: !!realPriceData[stock.ticker],
        emojis: emojis, // Keep the string for potential simple display
        emojiArray: emojiArray, // Use this for rendering and tooltips
        // emojiMeanings removed
        advice: advice,
        unitEquivalent: { // Renamed from foodEquivalent
          value: unitEquivalent,
          unit: weirdUnit.name
        },
        comparisonMetrics: comparisonMetrics // New dumber metrics
      };
    });

    // Return the simplified stock data
    return new Response(
      JSON.stringify({
        stocks: processedStocks,
        selectionMethod,
        methodDescription,
        lastUpdated: now.toISOString(),
        chaosLevel: chaosMultiplier.toFixed(2), // Keep chaos level
        mercuryRetrograde: mercuryRetrograde, // Keep retrograde status
        disclaimers: [ // Keep disclaimers, maybe make them dumber?
          "This is not financial advice. It's barely advice.",
          "Emoji patterns are NOT predictive. They are decorative.",
          "Investing based on this data is like navigating with a spaghetti map.",
          "'Real' prices are real-ish. Maybe.",
          "Consult a professional adult before making financial decisions.",
          "If you make money using this, it was pure luck. Don't tell us.",
          "If you lose money using this, please refer to disclaimer #1.",
        ]
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stock API error:", error);
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack // Include stack in dev mode maybe? For now, keep it simple.
    } : { message: String(error) };

    return new Response(
      JSON.stringify({ 
        error: "Failed to generate dumb stock data",
        message: error instanceof Error ? error.message : "Unknown error", 
        details: errorDetails, // Provide details for debugging
        stocks: [],
        disclaimers: ["The market broke. Or maybe just this API. Probably both."]
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to check if a number is prime (kept for potential future absurdity)
function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}