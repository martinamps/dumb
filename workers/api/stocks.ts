// API endpoint for stock market emoji translator
/// <reference path="./types.d.ts" />
import { fetchMultipleStockPrices } from './stockCache';

export async function handleStockRequest(request: Request, env: Env): Promise<Response> {
  try {
    // Get browser info for personalization
    const userAgent = request.headers.get("User-Agent") || "";
    const acceptLanguage = request.headers.get("Accept-Language") || "";
    const host = request.headers.get("Host") || "";
    const referer = request.headers.get("Referer") || "";
    const cookieHeader = request.headers.get("Cookie") || "";
    
    // Get current date for moon phase and other time-based calculations
    const now = new Date();
    const dateKey = now.getDate() + now.getMonth() * 31; // Changes daily
    const hourKey = now.getHours(); // Changes hourly
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    // Calculate absurd time-based variations
    const cosineTime = Math.cos(now.getMinutes() / 60 * Math.PI * 2);
    const sineTime = Math.sin(now.getSeconds() / 60 * Math.PI * 2);
    const chaosMultiplier = Math.abs(cosineTime * sineTime) + 0.5;
    
    // Calculate moon phase (extremely simplistic approximation)
    // 0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter
    const lunarMonth = 29.53; // days
    const daysSinceNewMoon = (dayOfYear + 10) % lunarMonth; // Jan 1, 2024 was ~10 days after new moon
    const moonPhase = daysSinceNewMoon / lunarMonth;
    
    // Determine if Mercury is in retrograde (3 out of every 21 days)
    const mercuryRetrograde = dayOfYear % 21 < 3;
    
    let moonPhaseEmoji = "🍄"; // Default new moon
    if (moonPhase < 0.25) {
      moonPhaseEmoji = "🍄"; // New moon
    } else if (moonPhase < 0.5) {
      moonPhaseEmoji = "🍕"; // Waxing
    } else if (moonPhase < 0.75) {
      moonPhaseEmoji = "🍦"; // Full moon
    } else {
      moonPhaseEmoji = "🥑"; // Waning
    }
    
    // Fetch stocks from consolidated file
    let stonks;
    
    try {
      // Fetch the stocks from stonks.json
      const response = await fetch("/stonks.json");
      
      if (!response.ok) {
        console.error("Failed to fetch stonks.json:", response.status, response.statusText);
        throw new Error("Failed to fetch stocks");
      }
      
      stonks = await response.json();
      console.log("Successfully loaded stonks.json with", stonks.length, "stocks");
    } catch (error) {
      // Fallback mini-list if fetch fails
      stonks = [
        { ticker: "AAPL", name: "Apple Inc.", sector: "Technology" },
        { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology" },
        { ticker: "GOOG", name: "Alphabet Inc.", sector: "Technology" },
        { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
        { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive" }
      ];
    }
    
    // Determine which stock selection method to use (increasingly absurd)
    const selectionMethods = [
      "mood_ring", // Based on color psychology of browser UA string
      "alphabet_soup", // Letters from your IP address
      "chrono_resonance", // Stocks that pair well with current time
      "quantum_entanglement", // Stocks entangled with other stocks
      "alternate_reality", // From a parallel dimension where things are different
      "orbital_harmonic", // Based on celestial alignments
      "dream_sequence", // Based on common dream archetypes
      "meme_potential", // Stocks with high meme energy
      "recursive_paradox", // Stocks that contain their own tickers
      "cosmic_giggle", // Stocks that make the universe laugh
    ];
    
    // "Randomly" select a method based on browser info + time, but with CHAOS
    const methodSeed = ((userAgent.length * chaosMultiplier) + (acceptLanguage.length * dateKey) + hourKey) % selectionMethods.length;
    const selectionMethod = selectionMethods[Math.floor(methodSeed)];
    
    // Pick 5-7 stocks based on selection method (MORE RANDOM each time!)
    const numStocks = Math.floor(Math.random() * 3) + 5; // 5-7 stocks
    let selectedStocks = [];
    let methodDescription = "";
    
    // Helper function to get stocks with chaotic randomization
    const getChaoticRandomStocks = (count: number) => {
      // Ultra-random seeding based on timestamp microseconds + color theory
      const chaosRoll = now.getMilliseconds() + (userAgent.length * dateKey);
      const shuffled = [...stonks].sort(() => (Math.sin(chaosRoll * Math.random()) < 0 ? -1 : 1));
      return shuffled.slice(0, count);
    };
    
    switch (selectionMethod) {
      case "mood_ring":
        // Use color psychology of user agent string to determine "mood"
        const moodColors = ["red", "blue", "green", "purple", "yellow", "orange", "teal", "pink"];
        const uaHash = userAgent.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const dominantMood = moodColors[(uaHash + dateKey) % moodColors.length];
        
        // Sectors that match different moods
        const moodSectors: Record<string, string[]> = {
          "red": ["Technology", "Automotive", "Aerospace"],
          "blue": ["Financial Services", "Healthcare", "Technology"],
          "green": ["Consumer Defensive", "Healthcare", "Financial Services"],
          "purple": ["Communication Services", "Technology", "Entertainment"],
          "yellow": ["Consumer Cyclical", "Entertainment", "Retail"],
          "orange": ["Consumer Cyclical", "Retail", "Technology"],
          "teal": ["Technology", "Healthcare", "Communication Services"],
          "pink": ["Consumer Goods", "Consumer Cyclical", "Entertainment"]
        };
        
        // Filter stocks matching the mood's sectors
        const matchingSectorStocks = stonks.filter(
          (stock: any) => moodSectors[dominantMood].includes(stock.sector)
        );
        
        selectedStocks = matchingSectorStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks selected via Mood Ring Algorithm™ (Your browser's mood: ${dominantMood})`;
        break;
        
      case "alphabet_soup":
        // Pick stocks that contain rare letters (J, Q, X, Z)
        const rareLetters = ["J", "Q", "X", "Z", "K", "V", "W", "Y"];
        const letterFiltered = stonks.filter(
          (stock: any) => rareLetters.some(letter => 
            stock.ticker.includes(letter) || stock.name.includes(letter)
          )
        );
        
        // Add a few stocks with vowel harmonics
        const vowelRhythm = (now.getMinutes() % (userAgent.length % 5 + 3)) + 1;
        const vowelHarmonics = stonks.filter(
          (stock: any) => (stock.ticker.match(/[AEIOU]/g) || []).length === vowelRhythm
        );
        
        // Combine and shuffle
        const alphabetStocks = [...letterFiltered, ...vowelHarmonics];
        selectedStocks = alphabetStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks chosen via Alphabet Soup Method™ (Letter Resonance: ${vowelRhythm})`;
        break;
        
      case "chrono_resonance":
        // Stocks that "resonate" with the current time
        // Hour corresponds to position in alphabet (1=A, 2=B, etc.)
        const hourLetter = String.fromCharCode(65 + (hourKey % 26));
        
        // Minute contributes to numeric resonance (odd vs even)
        const minuteResonance = now.getMinutes() % 2 === 0 ? "even" : "odd";
        
        // Filter stocks by resonance
        const chronoStocks = stonks.filter((stock: any) => {
          // Ticker or company starts with hour letter
          const startsWithHour = stock.ticker.startsWith(hourLetter) || 
                               stock.name.startsWith(hourLetter);
                               
          // Price length matches minute resonance
          const tickerLength = stock.ticker.length;
          const lengthResonance = tickerLength % 2 === 0 ? "even" : "odd";
          
          return startsWithHour || lengthResonance === minuteResonance;
        });
        
        selectedStocks = chronoStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks selected via Chrono-Resonance™ (Today's Temporal Harmony: ${hourLetter}-${minuteResonance})`;
        break;
        
      case "quantum_entanglement":
        // Stocks that are "entangled" based on bizarre correlations
        
        // Pick a random "origin" stock
        const originIndex = (dateKey + hourKey) % stonks.length;
        const originStock = stonks[originIndex];
        
        // Define entanglement metrics
        const entanglementRules = [
          // Same sector
          (stock: any) => stock.sector === originStock.sector,
          // Same ticker length
          (stock: any) => stock.ticker.length === originStock.ticker.length,
          // Shares at least one letter with origin ticker
          (stock: any) => originStock.ticker.split("").some(char => stock.ticker.includes(char)),
          // Name starts with same letter as origin name
          (stock: any) => stock.name.charAt(0) === originStock.name.charAt(0),
          // Ticker and origin ticker sum to same ASCII value ± 10%
          (stock: any) => {
            const originSum = originStock.ticker.split("").reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
            const stockSum = stock.ticker.split("").reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
            return Math.abs(originSum - stockSum) / originSum < 0.1;
          }
        ];
        
        // Apply quantum rules with uncertainty
        const entangledStocks = stonks.filter((stock: any) => {
          if (stock.ticker === originStock.ticker) return false; // No self-entanglement
          
          // Apply rules with quantum uncertainty
          const entanglementStrength = entanglementRules.filter(rule => rule(stock)).length / entanglementRules.length;
          return Math.random() < entanglementStrength * chaosMultiplier;
        });
        
        // Include origin stock as the first one
        selectedStocks = [originStock];
        
        // Add other entangled stocks
        selectedStocks = [...selectedStocks, ...entangledStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks - 1)];
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks quantum-entangled with ${originStock.ticker} (${(chaosMultiplier * 100).toFixed(2)}% uncertainty)`;
        break;
        
      case "alternate_reality":
        // Alternate reality where stocks are chosen differently
        
        // Define bizarre alternate selection rules
        const alternateRules = [
          // Stocks that would be fruit if they were food
          (stock: any) => ["AAPL", "BB", "PEAR", "PINE", "BLBRY", "CALM", "FDP", "DTIL", "CW", "WDFC"].includes(stock.ticker),
          
          // Stocks that sound like animal noises when pronounced
          (stock: any) => ["HOOG", "BARK", "MEOW", "RAWR", "BUZZ", "HONK", "OINK", "HOWL", "NEIGH", "WOOF"].includes(stock.ticker),
          
          // Stocks with perfect mathematical properties
          (stock: any) => {
            const tickerSum = stock.ticker.split("").reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
            return tickerSum % 7 === 0 || isPrime(tickerSum);
          },
          
          // Stocks that rhyme with common objects
          (stock: any) => ["MAT", "CAT", "FAT", "HAT", "VAT", "PLAT", "RAT", "BAT", "FLAT"].includes(stock.ticker),
          
          // Stocks with balanced consonant/vowel ratios
          (stock: any) => {
            const vowels = (stock.ticker.match(/[AEIOU]/g) || []).length;
            const consonants = stock.ticker.length - vowels;
            return vowels === consonants;
          }
        ];
        
        // Choose a random alternate rule that depends on browser
        const ruleIndex = (userAgent.length + dateKey) % alternateRules.length;
        const rule = alternateRules[ruleIndex];
        
        // Apply the rule with chaos
        const alternateStocks = stonks.filter((stock: any) => {
          const normalMatch = rule(stock);
          const chaosMatch = Math.random() < chaosMultiplier * 0.3; // 30% chance of random inclusion
          return normalMatch || chaosMatch;
        });
        
        selectedStocks = alternateStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks from Earth-${Math.floor(Math.random() * 9000) + 1000}, a parallel dimension where our investment criteria make more sense`;
        break;
      
      case "orbital_harmonic":
        // Based on orbital mechanics and cosmic alignments
        
        // Calculate planetary positions (total nonsense)
        const jupiterPosition = (dayOfYear % 12) + 1; // Jupiter's zodiac position
        // mercuryRetrograde is now defined at the top level
        const venusPhase = (moonPhase + 0.33) % 1; // Venus phase offset from moon
        const marsAlignment = (hourKey % 12) === jupiterPosition; // Mars-Jupiter alignment
        
        // Define orbital influences
        const orbitalInfluences = [
          // Jupiter influence (stocks with strength/prosperity themes)
          {
            condition: jupiterPosition > 6,
            selector: (stock: any) => ["V", "MA", "PYPL", "BAC", "JPM", "GS", "MS", "WFC", "C", "BLK"].includes(stock.ticker)
          },
          // Mercury influence (communication/technology when NOT retrograde)
          {
            condition: !mercuryRetrograde,
            selector: (stock: any) => ["GOOG", "META", "AAPL", "MSFT", "ADBE", "PYPL", "INTC", "AMD", "NVDA", "CSCO"].includes(stock.ticker)
          },
          // Mercury retrograde (communication breakdown)
          {
            condition: mercuryRetrograde,
            selector: (stock: any) => ["T", "VZ", "CMCSA", "DISH", "TMUS", "CHTR", "LUMN", "ATVI"].includes(stock.ticker)
          },
          // Venus (luxury and beauty)
          {
            condition: venusPhase > 0.5,
            selector: (stock: any) => ["NKE", "LULU", "ULTA", "EL", "LVS", "WYNN", "MGM", "RCL", "CCL", "MAR"].includes(stock.ticker)
          },
          // Mars (energy, aggression)
          {
            condition: marsAlignment,
            selector: (stock: any) => ["XOM", "CVX", "BP", "COP", "MRO", "EOG", "OXY", "PXD", "PSX", "VLO"].includes(stock.ticker)
          }
        ];
        
        // Apply cosmic influences
        const cosmicStocks = stonks.filter((stock: any) => {
          return orbitalInfluences.some(influence => 
            influence.condition && (influence.selector(stock) || Math.random() < 0.2 * chaosMultiplier)
          );
        });
        
        selectedStocks = cosmicStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks selected via Celestial Alignment Algorithm™ ${mercuryRetrograde ? '(Mercury is in retrograde!)' : '(Jupiter is in house ' + jupiterPosition + ')'}`;
        break;
      
      case "dream_sequence":
        // Stocks based on dream archetypes
        const dreamArchetypes = [
          {
            name: "Flying",
            selector: (stock: any) => ["BA", "LUV", "DAL", "UAL", "AAL", "SPCE", "EADSY", "TXT", "SKYW"].includes(stock.ticker)
          },
          {
            name: "Falling",
            selector: (stock: any) => ["SPCE", "UPST", "BYND", "NKLA", "RIVN", "COIN", "SNOW", "DASH", "PLTR"].includes(stock.ticker)
          },
          {
            name: "Being Chased",
            selector: (stock: any) => ["DASH", "UBER", "LYFT", "CVNA", "GRUB", "DKNG", "EA", "ATVI", "TTWO"].includes(stock.ticker)
          },
          {
            name: "Teeth Falling Out",
            selector: (stock: any) => ["ALGN", "XRAY", "PDCO", "HSIC", "DGX", "LH", "HOLX", "QGEN", "TMO"].includes(stock.ticker)
          },
          {
            name: "Showing Up Unprepared",
            selector: (stock: any) => ["GPS", "BBWI", "KSS", "JWN", "M", "TJX", "LULU", "RL", "TPR", "CPRI"].includes(stock.ticker)
          }
        ];
        
        // Pick a dream archetype based on date
        const dreamIndex = (dateKey + userAgent.length) % dreamArchetypes.length;
        const dreamType = dreamArchetypes[dreamIndex];
        
        // Get stocks matching the dream type
        const dreamStocks = stonks.filter((stock: any) => 
          dreamType.selector(stock) || Math.random() < 0.25 * chaosMultiplier
        );
        
        selectedStocks = dreamStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks selected from your "${dreamType.name}" dream archetype (Dream Analysis Level: ${Math.floor(chaosMultiplier * 10)}/10)`;
        break;
      
      case "meme_potential":
        // Stocks with high meme potential based on nonsensical metrics
        
        // Define meme metrics
        const memeFactors = [
          // Ticker can be read as a word
          (stock: any) => ["CAKE", "PLAY", "HEAR", "LIVE", "REAL", "COST", "TRIP", "SAFE", "PETS", "TEAM"].includes(stock.ticker),
          
          // Ticker is a single letter (ultra-meme)
          (stock: any) => stock.ticker.length === 1,
          
          // Ticker sounds funny when pronounced
          (stock: any) => ["PZZA", "FIZZ", "BUD", "TAP", "CAKE", "PZZA", "TACO", "WING", "JACK"].includes(stock.ticker),
          
          // Ticker has repeating letters
          (stock: any) => /(\w)\1/.test(stock.ticker),
          
          // Company is in a meme-worthy sector
          (stock: any) => ["Retail", "Entertainment", "Gaming", "Technology", "Automotive"].includes(stock.sector),
          
          // GameStop and similar "Reddit stocks"
          (stock: any) => ["GME", "AMC", "BB", "NOK", "KOSS", "EXPR", "BBBY"].includes(stock.ticker)
        ];
        
        // Calculate meme potential with chaos factor
        const memeStocks = stonks.filter((stock: any) => {
          // Count how many meme factors apply
          const memeFactor = memeFactors.filter(factor => factor(stock)).length;
          
          // Calculate meme score with chaos
          const memeScore = (memeFactor / memeFactors.length) * chaosMultiplier;
          
          // Roll for inclusion based on meme score
          return Math.random() < memeScore || memeFactor > 1;
        });
        
        selectedStocks = memeStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks with High Meme Potential™ (r/wallstreetbets approved)`;
        break;
      
      case "recursive_paradox":
        // Stocks that create recursion or paradoxes based on arbitrary rules
        
        // Define recursive/paradoxical rules
        const paradoxRules = [
          // Ticker contains its own index in the alphabet
          (stock: any) => {
            const ticker = stock.ticker;
            for (let i = 0; i < ticker.length; i++) {
              const letterPos = ticker.charCodeAt(i) - 64; // A=1, B=2, etc.
              if (letterPos > 0 && letterPos <= 26 && letterPos === i + 1) {
                return true;
              }
            }
            return false;
          },
          
          // Name contains ticker letter count (e.g., "FIVE" has 4 letters)
          (stock: any) => {
            const digitWords = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN"];
            return stock.name.toUpperCase().includes(digitWords[stock.ticker.length]);
          },
          
          // Ticker's first and last letters are the same
          (stock: any) => {
            const ticker = stock.ticker;
            return ticker.length > 1 && ticker[0] === ticker[ticker.length - 1];
          },
          
          // Self-referential pattern
          (stock: any) => {
            // E.g., ticker contains its own sector's first letter
            const sectorFirst = stock.sector.charAt(0).toUpperCase();
            return stock.ticker.includes(sectorFirst);
          }
        ];
        
        // Apply paradox rules with chaos
        const paradoxStocks = stonks.filter((stock: any) => {
          const matchesParadox = paradoxRules.some(rule => rule(stock));
          const chaosMatch = Math.random() < 0.2 * chaosMultiplier;
          return matchesParadox || chaosMatch;
        });
        
        selectedStocks = paradoxStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks selected via Recursive Paradox Algorithm™ (This description is also part of the algorithm)`;
        break;
      
      case "cosmic_giggle":
        // Stocks that make the universe laugh
        
        // Ridiculously absurd stock selection rules
        const cosmicHumorRules = [
          // Ticker contains a letter that matches your favorite color (which we guess)
          (stock: any) => {
            const favoriteColors = ["RED", "BLUE", "GREEN", "PINK", "BLACK", "WHITE"];
            const userFavoriteColor = favoriteColors[(userAgent.length + dateKey) % favoriteColors.length];
            return stock.ticker.split("").some(char => userFavoriteColor.includes(char));
          },
          
          // Stock with ticker that matches pet's name (which we make up)
          (stock: any) => {
            const petNames = ["MAX", "BELLA", "LUNA", "LUCY", "REX", "SPOT", "FLUFFY"];
            const userPetName = petNames[(userAgent.length + hourKey) % petNames.length];
            
            // Check if ticker shares at least half the letters with pet name
            const sharedLetters = stock.ticker.split("").filter(char => userPetName.includes(char)).length;
            return sharedLetters >= Math.floor(userPetName.length / 2);
          },
          
          // Stock that would describe your personality (which we invent)
          (stock: any) => {
            const personalityTraits = ["INTC", "CALM", "NICE", "COOL", "REAL", "GOOD", "FAST", "SLOW", "LOUD"];
            const userPersonality = personalityTraits[(userAgent.length + dateKey + hourKey) % personalityTraits.length];
            
            // Overlap between ticker and personality
            return stock.ticker.split("").some(char => userPersonality.includes(char));
          },
          
          // Stock that matches the food you're craving (which we guess)
          (stock: any) => {
            const foods = ["CAKE", "TACO", "PZZA", "CHEF", "BUD", "WING", "BUFF", "EGGS", "SOUP"];
            const userCraving = foods[(hourKey + dateKey) % foods.length];
            
            // Overlap between ticker and food
            return stock.ticker.includes(userCraving.charAt(0)) && 
                   stock.ticker.includes(userCraving.charAt(userCraving.length - 1));
          }
        ];
        
        // Apply cosmic humor rules with extra chaos
        const humorStocks = stonks.filter((stock: any) => {
          const matchesHumor = cosmicHumorRules.some(rule => rule(stock));
          const chaosMatch = Math.random() < 0.3 * chaosMultiplier;
          return matchesHumor || chaosMatch;
        });
        
        selectedStocks = humorStocks
          .sort(() => (Math.random() * chaosMultiplier) - 0.5)
          .slice(0, numStocks);
          
        if (selectedStocks.length < numStocks) {
          // Fill with random stocks if needed
          const fillerStocks = getChaoticRandomStocks(numStocks - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks that will make your future self laugh (Temporal Humor Confidence: ${(chaosMultiplier * 100).toFixed(0)}%)`;
        break;
      
      default:
        // Fallback to totally random stocks for maximum chaos
        selectedStocks = getChaoticRandomStocks(numStocks);
        methodDescription = "Randomly selected stocks (Entropy Method™)";
    }
    
    // Fetch real stock prices for all selected stocks
    const tickers = selectedStocks.map((stock: any) => stock.ticker);
    console.log("Fetching real price data for tickers:", tickers);
    const realPriceData = await fetchMultipleStockPrices(tickers);
    console.log("Real price data received:", realPriceData);
    
    // Expanded set of absurd emoji mappings
    const elementalEmojis = ['🔥', '💧', '🌪️', '🪨', '⚡', '🌱', '❄️', '☁️', '⭐', '🌈'];
    const movementEmojis = ['🚀', '💀', '🥱', '📈', '📉', '🌋', '🕳️', '🧨', '🎢', '🏄'];
    const animalEmojis = ['🐢', '🦊', '🦄', '🦘', '🐙', '🦜', '🦓', '🦦', '🦝', '🦔'];
    const foodEmojis = ['🍄', '🍕', '🍦', '🥑', '🌮', '🥐', '🍩', '🍗', '🥝', '🍰'];
    const randomEmojis = ['💰', '🧠', '🔮', '⚔️', '🧿', '🎭', '🎪', '📿', '🧩', '🪄',
                          '🎯', '🧬', '👾', '💎', '🛸', '👑', '🧪', '🔍', '💉', '🧸'];
    
    // Extra bizarre emoji sets
    const costumeEmojis = ['🤖', '👽', '👻', '🧙', '🧟', '🦹', '🧞', '🦸', '🧚', '🧜'];
    const weatherEmojis = ['🌞', '🌧️', '⛈️', '🌨️', '⚡', '🌪️', '🌫️', '❄️', '☃️', '🌊'];
    const buildingEmojis = ['🏠', '🏢', '🏰', '⛩️', '🏯', '🏛️', '🏗️', '🏭', '⛪', '🏟️'];
    const vehicleEmojis = ['🚗', '🚀', '🛸', '🚂', '⛵', '🚁', '🏎️', '🛵', '🚢', '🛩️'];
    const plantEmojis = ['🌵', '🌴', '🌲', '🌱', '🍀', '🌿', '🌳', '🎋', '🍄', '🌼'];
    
    // Helper function to pick a unique random emoji from a set
    const getRandomEmoji = (emojiSet: string[], seed: number) => {
      return emojiSet[Math.floor((seed * chaosMultiplier) % emojiSet.length)];
    };
    
    // Now, transform each stock into absurdly random emoji sequences
    const stocks = selectedStocks.map(stock => {
      // Use real price data if available, fall back to generated data
      const priceData = realPriceData[stock.ticker] || {
        price: (stock.ticker.length * 10 + dateKey) % 500 + 20, // $20-$520
        movement: ((stock.ticker.charCodeAt(0) + dateKey) % 21 - 10) / 10 // -1.0% to +1.0%
      };
      
      const basePrice = priceData.price;
      const priceLastDigit = Math.floor(basePrice) % 10;
      const movement = priceData.movement;
      
      // Generate seed values for emoji selection
      const nameSeed = stock.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const sectorSeed = stock.sector.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      const priceSeed = Math.floor(basePrice * 100);
      const timeSeed = now.getHours() * 60 + now.getMinutes();
      
      // More chaotic emoji selection based on multiple bizarre factors
      // Each emoji now has more variety and complex selection criteria
      
      // Totally random emoji selection based on various seeds
      const firstEmoji = getRandomEmoji(elementalEmojis, 
                                      (nameSeed + hourKey + (dateKey % 3)) * chaosMultiplier);
      
      const secondEmoji = getRandomEmoji(movementEmojis, 
                                      (priceSeed + movement * 100 + (dateKey % 5)) * chaosMultiplier);
      
      const thirdEmoji = getRandomEmoji(animalEmojis, 
                                     (priceLastDigit + sectorSeed + (hourKey % 7)) * chaosMultiplier);
      
      const fourthEmoji = getRandomEmoji(foodEmojis, 
                                      (moonPhase * 100 + timeSeed + (dateKey % 11)) * chaosMultiplier);
      
      // Pick random emojis from specialty categories based on day of week
      const dayOfWeek = now.getDay();
      let fifthEmoji;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Weekend: costume emojis
        fifthEmoji = getRandomEmoji(costumeEmojis, 
                                 (stock.ticker.length + dateKey + hourKey) * chaosMultiplier);
      } else if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
        // Mon/Wed/Fri: randomly choose between weather, vehicle, or building
        const categoryChoice = (dateKey + hourKey + stock.ticker.length) % 3;
        if (categoryChoice === 0) {
          fifthEmoji = getRandomEmoji(weatherEmojis, 
                                   (nameSeed + hourKey) * chaosMultiplier);
        } else if (categoryChoice === 1) {
          fifthEmoji = getRandomEmoji(vehicleEmojis, 
                                   (priceSeed + dateKey) * chaosMultiplier);
        } else {
          fifthEmoji = getRandomEmoji(buildingEmojis, 
                                   (sectorSeed + timeSeed) * chaosMultiplier);
        }
      } else {
        // Tue/Thu: randomly choose between plants or random
        const categoryChoice = (dateKey + hourKey + stock.ticker.length) % 2;
        if (categoryChoice === 0) {
          fifthEmoji = getRandomEmoji(plantEmojis, 
                                   (nameSeed + priceSeed) * chaosMultiplier);
        } else {
          fifthEmoji = getRandomEmoji(randomEmojis, 
                                   (sectorSeed + moonPhase * 100) * chaosMultiplier);
        }
      }
      
      // Shuffle emoji order based on stock ticker's first letter
      const tickerFirstChar = stock.ticker.charCodeAt(0);
      const initialEmojiArray = [firstEmoji, secondEmoji, thirdEmoji, fourthEmoji, fifthEmoji];
      
      // Sometimes (based on cosmic alignment) shuffle the array
      const shufflePattern = (tickerFirstChar + dateKey + hourKey) % 5;
      let emojiArray;
      
      switch(shufflePattern) {
        case 0: // Regular order
          emojiArray = initialEmojiArray;
          break;
        case 1: // Reverse
          emojiArray = [...initialEmojiArray].reverse();
          break;
        case 2: // Rotate left
          emojiArray = [...initialEmojiArray.slice(1), initialEmojiArray[0]];
          break;
        case 3: // Rotate right
          emojiArray = [initialEmojiArray[initialEmojiArray.length - 1], ...initialEmojiArray.slice(0, -1)];
          break;
        case 4: // Total shuffle
          emojiArray = [...initialEmojiArray].sort(() => Math.random() - 0.5);
          break;
        default:
          emojiArray = initialEmojiArray;
      }
      
      // Create absurdly specific and nonsensical emoji meanings
      const emojiMeanings = {
        first: generateEmojiMeaning(emojiArray[0], stock, basePrice, movement, moonPhase, dateKey),
        second: generateEmojiMeaning(emojiArray[1], stock, basePrice, movement, moonPhase, dateKey + 1),
        third: generateEmojiMeaning(emojiArray[2], stock, basePrice, movement, moonPhase, dateKey + 2),
        fourth: generateEmojiMeaning(emojiArray[3], stock, basePrice, movement, moonPhase, dateKey + 3),
        fifth: generateEmojiMeaning(emojiArray[4], stock, basePrice, movement, moonPhase, dateKey + 4)
      };
      
      // Create emoji string but using array to ensure proper emoji handling
      const emojiSequence = emojiArray.join('');
      
      // Generate even more absurd financial advice
      const adviceOptions = [
        `Buy when ${emojiArray[0]} aligns with ${emojiArray[2]}, sell immediately if you see ${emojiArray[4]} appear during a ${moonPhase < 0.5 ? 'waxing' : 'waning'} moon`,
        `HOLD through the next ${emojiArray[3]} cycle, then PANIC SELL at the first sign of ${emojiArray[1]} crossing the ${emojiArray[0]} threshold`,
        `This stock performs ${Math.random() > 0.5 ? 'exceptionally well' : 'terribly'} when Mercury is ${mercuryRetrograde ? 'in retrograde' : 'direct'} and ${emojiArray[2]} appears in your dreams`,
        `${emojiArray[4]} pattern suggests a ${movement > 0 ? 'rise' : 'drop'} by exactly ${(Math.sin(stock.ticker.length * dateKey) * 10 + 12).toFixed(2)}% next ${dayOfYear % 2 === 0 ? 'Tuesday' : 'Friday'}`,
        `The appearance of ${emojiArray[0]}${emojiArray[1]} indicates this stock is influenced by the ${['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius'][dateKey % 12]} constellation`,
        `Divest immediately if ${emojiArray[3]} appears directly after ${emojiArray[1]}, as this portends a ${Math.floor(Math.random() * 70) + 30}% drop by the next solar eclipse`,
        `Every ${(Math.floor(Math.random() * 4) + 3).toString()} days, this stock's ${emojiArray[2]} energy shifts, creating a ${Math.random() > 0.5 ? 'buying' : 'selling'} opportunity but only between ${(Math.floor(Math.random() * 12) + 1)}${Math.random() > 0.5 ? 'am' : 'pm'} and ${(Math.floor(Math.random() * 12) + 1)}${Math.random() > 0.5 ? 'am' : 'pm'}`,
        `According to ancient ${['Sumerian', 'Mayan', 'Egyptian', 'Atlantean', 'Martian'][dateKey % 5]} trading wisdom, ${emojiArray[0]} followed by ${emojiArray[4]} is a ${Math.random() > 0.5 ? 'incredibly bullish' : 'extremely bearish'} signal, especially during ${['spring', 'summer', 'fall', 'winter'][Math.floor(dateKey / 31) % 4]}`
      ];
      
      // Pick a totally random advice with extra chaos
      const advice = adviceOptions[Math.floor((dateKey + stock.ticker.length + hourKey) * chaosMultiplier) % adviceOptions.length];
      
      // Performance metric in various food items
      const foodItems = [
        { name: "pizzas", price: 12.99 },
        { name: "burritos", price: 8.49 },
        { name: "coffees", price: 4.75 },
        { name: "avocado toasts", price: 11.50 },
        { name: "ramen bowls", price: 14.25 },
        { name: "ice cream cones", price: 3.99 },
        { name: "movie tickets", price: 15.50 },
        { name: "subway rides", price: 2.75 },
        { name: "fancy cupcakes", price: 5.25 }
      ];
      
      // Choose a random food item based on the stock's sector
      const foodIndex = (sectorSeed + dateKey) % foodItems.length;
      const foodItem = foodItems[foodIndex];
      const foodEquivalent = (basePrice / foodItem.price).toFixed(2);
      const pizzaEquivalent = (basePrice / 12.99).toFixed(2); // Keep pizza equivalent for backward compatibility
      
      // Calculate random comparisons
      const actualComparison = (movement * 100).toFixed(2);
      const randomFactors = [
        Math.sin(stock.ticker.length + dateKey) * 5,
        Math.cos(nameSeed * 0.01) * 8,
        (Math.tan(priceSeed * 0.001) % 1) * 6,
        chaosMultiplier * 12
      ];
      const randomComparison = (randomFactors[Math.floor(Math.random() * randomFactors.length)]).toFixed(2);
      
      return {
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        price: basePrice.toFixed(2),
        movement: movement.toFixed(2),
        isRealPrice: !!realPriceData[stock.ticker],
        emojis: emojiSequence,
        emojiArray: emojiArray, // Send the emojis as an array to avoid splitting issues
        emojiMeanings: emojiMeanings,
        advice: advice,
        pizzaEquivalent: pizzaEquivalent,
        foodEquivalent: {
          value: foodEquivalent,
          unit: foodItem.name
        },
        comparisonMetrics: {
          actual: `${actualComparison}%`,
          alternate: `${randomComparison}%`,
          isReversed: Math.random() < chaosMultiplier * 0.5 // Variable chance metrics are reversed
        }
      };
    });
    
    // Return the stock data with extra chaos metrics
    return new Response(
      JSON.stringify({
        stocks,
        selectionMethod,
        methodDescription,
        lastUpdated: now.toISOString(),
        moonPhase: moonPhaseEmoji,
        marketStatus: hourKey >= 9 && hourKey < 16 ? "OPEN" : "CLOSED",
        chaosLevel: (chaosMultiplier * 10).toFixed(1),
        cosmicAlignment: Math.random() < 0.5 ? "favorable" : "unfavorable",
        marketSentiment: ["euphoric", "optimistic", "cautious", "pessimistic", "apocalyptic"][Math.floor(Math.random() * 5)],
        mercuryRetrograde: Math.random() < 0.3,
        disclaimers: [
          "Past performance does not guarantee future emoji sequences",
          "The EMT™ (Emoji Market Theory) is not recognized by the SEC",
          "Investing based on emojis is 97% less reliable than a Magic 8-Ball",
          "Prices labeled 'REAL' are actual market data (when available)",
          "Our lawyers made us say this isn't financial advice",
          "If you see the 🦄 emoji twice in a row, please seek medical attention",
          "Emoji patterns may cause financial hallucinations in laboratory animals",
          "None of our data scientists know what these emojis mean either"
        ]
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Stock API error:", error);
    
    // Create a more detailed error message for debugging
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : { message: String(error) };
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate stock data",
        message: error instanceof Error ? error.message : "Unknown error", 
        details: errorDetails,
        stocks: [],
        disclaimers: ["Even our error messages are unreliable"]
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to generate absurdly specific and nonsensical emoji meanings
function generateEmojiMeaning(emoji: string, stock: any, price: number, movement: number, moonPhase: number, seed: number): string {
  const meaningOptions = [
    // Element/company related
    `${emoji}: Company ${stock.name} has ${Math.abs(Math.sin(seed) * 100).toFixed(1)}% ${emoji} energy in its corporate aura`,
    
    // Price related
    `${emoji}: Stock price divisible by ${Math.floor(Math.random() * 9) + 2} yields ${emoji} energy`,
    
    // Movement related
    `${emoji}: ${movement > 0 ? 'Rising' : 'Falling'} by ${Math.abs(movement * 100).toFixed(2)}% correlates with ${emoji} vibrational frequency`,
    
    // Sector related
    `${emoji}: ${stock.sector} sector alignment with ${['Jupiter', 'Saturn', 'Mercury', 'Venus', 'Mars', 'Neptune', 'Uranus', 'Pluto'][seed % 8]} is ${Math.floor(Math.random() * 100)}% ${emoji}`,
    
    // Moon related
    `${emoji}: Moon phase ${['new', 'waxing', 'full', 'waning'][Math.floor(moonPhase * 4)]} affects ${emoji} visibility on trading floor`,
    
    // Ticker related
    `${emoji}: Ticker ${stock.ticker} has ${stock.ticker.length} letters, causing ${emoji} resonance pattern`,
    
    // Totally random
    `${emoji}: ${['Mercury retrograde', 'Solar flares', 'Quantum fluctuations', 'Tectonic shifts', 'Butterfly effect', 'Cosmic strings', 'Dark matter', 'Feng shui'][seed % 8]} indicates ${emoji} will ${['intensify', 'diminish', 'stabilize', 'fluctuate', 'harmonize'][Math.floor(Math.random() * 5)]}`,
    
    // Absurdly specific
    `${emoji}: ${['CEO', 'CFO', 'CTO', 'Board', 'Shareholders'][seed % 5]} ${['dreams', 'lunch choices', 'office chair', 'commute', 'coffee preference'][Math.floor(Math.random() * 5)]} generates ${emoji} astrological signal`,
    
    // Time-based
    `${emoji}: Trading on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][seed % 5]} during ${['lunch hour', 'morning bell', 'power hour', 'after-hours', 'pre-market'][Math.floor(Math.random() * 5)]} amplifies ${emoji} potential`,
    
    // Completely nonsensical
    `${emoji}: If you see this emoji in your ${['dreams', 'coffee', 'toast', 'clouds', 'reflection'][Math.floor(Math.random() * 5)]}, ${['buy', 'sell', 'hold', 'ignore', 'research'][seed % 5]} this stock immediately`
  ];
  
  // Select a totally random meaning
  return meaningOptions[Math.floor(Math.random() * meaningOptions.length)];
}

// Helper function to check if a number is prime
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