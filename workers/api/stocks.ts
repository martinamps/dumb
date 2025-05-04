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
    
    // Calculate moon phase (extremely simplistic approximation)
    // 0 = new moon, 0.25 = first quarter, 0.5 = full moon, 0.75 = last quarter
    const lunarMonth = 29.53; // days
    const daysSinceNewMoon = (dayOfYear + 10) % lunarMonth; // Jan 1, 2024 was ~10 days after new moon
    const moonPhase = daysSinceNewMoon / lunarMonth;
    
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
    
    // Fetch stock lists
    let popularStocks;
    let waybackStocks;
    
    try {
      // Fetch the stock lists - use relative paths for local development
      const [popularResponse, waybackResponse] = await Promise.all([
        fetch("/popular_stocks.json"),
        fetch("/wayback_stocks.json")
      ]);
      
      popularStocks = await popularResponse.json();
      waybackStocks = await waybackResponse.json();
    } catch (error) {
      // Fallback mini-lists if fetch fails
      popularStocks = [
        { ticker: "AAPL", name: "Apple Inc.", sector: "Technology" },
        { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology" },
        { ticker: "GOOG", name: "Alphabet Inc.", sector: "Technology" },
        { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical" },
        { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive" }
      ];
      
      waybackStocks = [
        { ticker: "PALM", name: "Palm Inc.", sector: "Technology" },
        { ticker: "BBRY", name: "BlackBerry Ltd", sector: "Technology" },
        { ticker: "YHOO", name: "Yahoo! Inc.", sector: "Technology" },
        { ticker: "AOL", name: "America Online", sector: "Technology" },
        { ticker: "ZNGA", name: "Zynga Inc.", sector: "Technology" }
      ];
    }
    
    // Determine which stock selection method to use (all equally bad)
    const selectionMethods = [
      "wayback_machine", // From 2008 forum thread (WayBack Machine)
      "fortune_cookie", // Based on nonexistent horoscope
      "geo_unlucky", // Opposite timezone
      "trend_adjacent", // Alphabetically adjacent to trending
      "sentimental_favorites" // Contains letters from your "name"
    ];
    
    // "Randomly" select a method based on browser info + time
    const methodSeed = (userAgent.length + acceptLanguage.length + dateKey) % selectionMethods.length;
    const selectionMethod = selectionMethods[methodSeed];
    
    // Get stocks based on selected method
    let selectedStocks = [];
    let methodDescription = "";
    
    switch (selectionMethod) {
      case "wayback_machine":
        // Use the wayback machine stocks
        selectedStocks = waybackStocks.slice(0, 5);
        methodDescription = "Based on a 2008 investing forum thread from WayBack Machine";
        break;
        
      case "fortune_cookie":
        // "Random" stocks based on horoscope (which doesn't exist yet)
        // For now, just pick weirdly named stocks
        methodDescription = "Stocks chosen via Fortune Cookie Method™";
        const cookieStocks = [
          { ticker: "CAKE", name: "Cheesecake Factory", sector: "Consumer" },
          { ticker: "FUN", name: "Cedar Fair", sector: "Entertainment" },
          { ticker: "PLAY", name: "Dave & Buster's", sector: "Entertainment" },
          { ticker: "FIZZ", name: "National Beverage", sector: "Consumer" },
          { ticker: "COOL", name: "Majesco Entertainment", sector: "Technology" }
        ];
        selectedStocks = cookieStocks;
        break;
        
      case "geo_unlucky":
        // Opposite timezone stocks
        // Determine "local" timezone from browser info and hour
        const presumedTimezone = (hourKey + Math.floor(userAgent.length / 100)) % 24;
        const oppositeTimezone = (presumedTimezone + 12) % 24;
        
        // Get stocks from the "opposite timezone" by taking stocks from the second half of our list
        const halfwayPoint = Math.floor(popularStocks.length / 2);
        selectedStocks = popularStocks.slice(halfwayPoint, halfwayPoint + 5);
        methodDescription = `Stocks headquartered in the opposite timezone from you (GMT${oppositeTimezone > 12 ? '-' : '+'}${Math.abs(oppositeTimezone - 12)})`;
        break;
        
      case "trend_adjacent":
        // Alphabetically adjacent to trending stocks
        const trendingStocks = ["AAPL", "MSFT", "GOOG", "TSLA", "AMZN"];
        const adjacentStocks = [];
        
        // For each trending stock, find one alphabetically adjacent
        for (const ticker of trendingStocks) {
          const candidates = [...popularStocks, ...waybackStocks].filter(s => 
            s.ticker !== ticker && 
            (s.ticker.charAt(0) === ticker.charAt(0) || 
             s.ticker.charCodeAt(0) === ticker.charCodeAt(0) + 1 || 
             s.ticker.charCodeAt(0) === ticker.charCodeAt(0) - 1)
          );
          
          if (candidates.length > 0) {
            const randomIndex = (ticker.length + dateKey) % candidates.length;
            adjacentStocks.push(candidates[randomIndex]);
          }
        }
        
        selectedStocks = adjacentStocks.slice(0, 5);
        if (selectedStocks.length < 5) {
          // Fill the rest with random stocks
          const fillerStocks = [...popularStocks, ...waybackStocks]
            .filter(s => !selectedStocks.some(selected => selected.ticker === s.ticker))
            .slice(0, 5 - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = "Stocks alphabetically adjacent to actually trending stocks";
        break;
        
      case "sentimental_favorites":
        // Contains letters from your "name"
        // Extract a fake "name" from browser info
        const fakeName = userAgent.slice(0, 10).replace(/[^a-zA-Z]/g, '').toUpperCase();
        const nameLetters = fakeName.split('');
        
        // Find stocks that contain letters from the "name"
        const sentimentalStocks = [...popularStocks, ...waybackStocks].filter(s => 
          nameLetters.some(letter => s.ticker.includes(letter))
        );
        
        selectedStocks = sentimentalStocks.slice(0, 5);
        if (selectedStocks.length < 5) {
          // Fill the rest with random stocks
          const fillerStocks = [...popularStocks, ...waybackStocks]
            .filter(s => !selectedStocks.some(selected => selected.ticker === s.ticker))
            .slice(0, 5 - selectedStocks.length);
          selectedStocks = [...selectedStocks, ...fillerStocks];
        }
        
        methodDescription = `Stocks selected via Cosmic Alignment Algorithm`;
        break;
        
      default:
        // Fallback to random popular stocks
        selectedStocks = popularStocks.slice(0, 5);
        methodDescription = "Randomly selected stocks";
    }
    
    // Fetch real stock prices for all selected stocks
    const tickers = selectedStocks.map(stock => stock.ticker);
    console.log("Fetching real price data for tickers:", tickers);
    const realPriceData = await fetchMultipleStockPrices(tickers);
    console.log("Real price data received:", realPriceData);
    
    // Now, transform each stock into emoji sequences
    const stocks = selectedStocks.map(stock => {
      // Use real price data if available, fall back to generated data
      const priceData = realPriceData[stock.ticker] || {
        price: (stock.ticker.length * 10 + dateKey) % 500 + 20, // $20-$520
        movement: ((stock.ticker.charCodeAt(0) + dateKey) % 21 - 10) / 10 // -1.0% to +1.0%
      };
      
      const basePrice = priceData.price;
      const priceLastDigit = Math.floor(basePrice) % 10;
      const movement = priceData.movement;
      
      // First emoji based on company name first letter
      const firstLetter = stock.name.charAt(0).toUpperCase();
      let firstEmoji;
      if (firstLetter >= 'A' && firstLetter <= 'E') firstEmoji = '🔥';
      else if (firstLetter >= 'F' && firstLetter <= 'J') firstEmoji = '💧';
      else if (firstLetter >= 'K' && firstLetter <= 'O') firstEmoji = '🌪️';
      else if (firstLetter >= 'P' && firstLetter <= 'T') firstEmoji = '🪨';
      else firstEmoji = '⚡';
      
      // Second emoji based on stock movement
      let secondEmoji;
      if (movement > 0) secondEmoji = '🚀';
      else if (movement < 0) secondEmoji = '💀';
      else secondEmoji = '🥱';
      
      // Third emoji based on price last digit
      let thirdEmoji;
      if (priceLastDigit >= 0 && priceLastDigit <= 3) thirdEmoji = '🐢';
      else if (priceLastDigit >= 4 && priceLastDigit <= 6) thirdEmoji = '🦊';
      else thirdEmoji = '🦄';
      
      // Fourth emoji based on moon phase
      const fourthEmoji = moonPhaseEmoji;
      
      // Random bonus emoji
      const bonusEmojis = ['💰', '🧠', '🔮', '⚔️', '🧿', '🎭', '🎪', '📿', '🧩', '🪄'];
      const bonusEmoji = bonusEmojis[(stock.ticker.length + dateKey) % bonusEmojis.length];
      
      // Generate financial advice
      const adviceOptions = [
        `Buy when you see ${thirdEmoji} followed by ${fourthEmoji}, sell when you see ${firstEmoji}${secondEmoji}`,
        `HOLD through the next ${moonPhaseEmoji} cycle, then PANIC SELL at the sight of ${secondEmoji}`,
        `This stock performs best when viewed through squinted eyes on a ${dayOfYear % 2 === 0 ? 'Tuesday' : 'Friday'}`,
        `${thirdEmoji} pattern suggests imminent ${movement > 0 ? 'rise' : 'drop'} by exactly ${(stock.ticker.length * 1.3).toFixed(2)}%`,
        `The presence of ${bonusEmoji} indicates this stock is influenced by ${moonPhase < 0.5 ? 'Jupiter' : 'Mercury'} retrograde`
      ];
      const advice = adviceOptions[(stock.ticker.length + dateKey) % adviceOptions.length];
      
      // Performance metric in "pizzas"
      const pizzaPrice = 12.99; // Standard pizza price
      const pizzaEquivalent = (basePrice / pizzaPrice).toFixed(2);
      
      // Calculate random comparison stock
      const actualComparison = (movement * 100).toFixed(2);
      const randomComparison = ((Math.sin(stock.ticker.length + dateKey) * 5) + 0.5).toFixed(2);
      
      // To ensure proper emoji display, store emojis separately
      const emojiArray = [firstEmoji, secondEmoji, thirdEmoji, fourthEmoji, bonusEmoji];
      
      // Create emoji string but using array to ensure proper emoji handling
      const emojiSequence = emojiArray.join('');
      
      return {
        ticker: stock.ticker,
        name: stock.name,
        sector: stock.sector,
        price: basePrice.toFixed(2),
        movement: movement.toFixed(2),
        isRealPrice: !!realPriceData[stock.ticker],
        emojis: emojiSequence,
        emojiArray: emojiArray, // Send the emojis as an array to avoid splitting issues
        emojiMeanings: {
          first: `${firstEmoji}: Company name starts with ${firstLetter} (${firstLetter}-${String.fromCharCode(firstLetter.charCodeAt(0) + 4)})`,
          second: `${secondEmoji}: Stock ${movement > 0 ? 'up' : movement < 0 ? 'down' : 'no movement'} by ${Math.abs(movement).toFixed(2)}%`,
          third: `${thirdEmoji}: Price ends in ${priceLastDigit}`,
          fourth: `${fourthEmoji}: Current moon phase`,
          bonus: `${bonusEmoji}: Random cosmic insight`
        },
        advice: advice,
        pizzaEquivalent: pizzaEquivalent,
        comparisonMetrics: {
          actual: `${actualComparison}%`,
          alternate: `${randomComparison}%`,
          isReversed: (dateKey % 2 === 0) // 50% chance metrics are reversed
        }
      };
    });
    
    // Return the stock data
    return new Response(
      JSON.stringify({
        stocks,
        selectionMethod,
        methodDescription,
        lastUpdated: now.toISOString(),
        moonPhase: moonPhaseEmoji,
        marketStatus: hourKey >= 9 && hourKey < 16 ? "OPEN" : "CLOSED",
        disclaimers: [
          "Past performance does not guarantee future emoji sequences",
          "The EMT™ (Emoji Market Theory) is not recognized by the SEC",
          "Investing based on emojis is 97% less reliable than a Magic 8-Ball",
          "Prices labeled 'REAL' are actual market data (when available)",
          "For entertainment purposes only - not financial advice"
        ]
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate stock data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}