// Random stock generator with completely made-up tickers
/// <reference path="./types.d.ts" />

// Generate a random stock ticker (2-5 letters, all caps)
export function generateRandomTicker(): string {
  const length = Math.floor(Math.random() * 4) + 2; // 2-5 characters
  let ticker = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  for (let i = 0; i < length; i++) {
    ticker += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  // 15% chance to add a dot and another letter (like BRK.A)
  if (Math.random() < 0.15) {
    ticker += '.' + characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return ticker;
}

// Generate random company names
export function generateCompanyName(ticker: string): string {
  // First word options based on industry categories
  const firstWords = [
    "Quantum", "Cyber", "Mega", "Ultra", "Hyper", "Global", "Integrated", "Advanced", 
    "Strategic", "Synergistic", "Dynamic", "Universal", "Digital", "Unified", "Superior", 
    "Progressive", "Premier", "Elite", "Precision", "Next-Gen", "Virtual", "Optimal",
    "Apex", "Alpha", "Beta", "Gamma", "Delta", "Omega", "Flux", "Nano", "Micro", "Macro",
    "Monolithic", "Distributed", "Consolidated", "Fragmented", "Decentralized", "Automated"
  ];
  
  // Second word options based on buzzwords and industry focuses
  const secondWords = [
    "Tech", "Dynamics", "Systems", "Solutions", "Industries", "Ventures", "Innovations", 
    "Networks", "Communications", "Electronics", "Robotics", "Algorithms", "Analytics", 
    "Logistics", "Pharmaceuticals", "Genomics", "Biotech", "Resources", "Energy", "Mechanics",
    "Computing", "Blockchain", "AI", "Metaverse", "Data", "Quantum", "Manufacturing",
    "Aerospace", "Healthcare", "Financial", "Retail", "Media", "Entertainment", "Foods"
  ];
  
  // Endings with legal entity types
  const endings = [
    "Inc.", "Corp.", "LLC", "Ltd.", "Group", "Holdings", "Enterprises", "Co.", "PLC", "GmbH",
    "S.A.", "N.V.", "Limited", "Capital", "Partners", "Ventures", "International", "Global",
    "Technologies", "Labs", "Research", "Interactive", "Dynamics", "Networks", "Systems"
  ];
  
  // 20% chance to use a random name completely unrelated to the ticker
  if (Math.random() < 0.2) {
    const first = firstWords[Math.floor(Math.random() * firstWords.length)];
    const second = secondWords[Math.floor(Math.random() * secondWords.length)];
    const ending = endings[Math.floor(Math.random() * endings.length)];
    return `${first} ${second} ${ending}`;
  }
  
  // 80% chance to try to incorporate the ticker into the name somehow
  let nameStart = "";
  for (let i = 0; i < ticker.length && i < 3; i++) {
    const letter = ticker[i];
    
    // Find words that start with this letter
    const potentialWords = [
      // A
      "Advanced", "Alpha", "Apex", "Atomic", "Automated", "Absolute", "Agile",
      // B
      "Beta", "Blockchain", "Biotech", "Brilliant", "Byte", "Blue", "Bold",
      // C
      "Cyber", "Consolidated", "Cloud", "Core", "Crypto", "Central", "Carbon",
      // D
      "Digital", "Dynamic", "Delta", "Direct", "Distributed", "Drone", "Deep",
      // E
      "Elite", "Energy", "Efficient", "Enhanced", "Eco", "Edge", "Electronic",
      // F
      "Future", "Flux", "Financial", "Fast", "Frontier", "Fusion", "Focused",
      // G
      "Global", "Gamma", "Genomic", "Grid", "Green", "Growth", "Giant",
      // H
      "Hyper", "Horizon", "High-Tech", "Holistic", "Health", "Hybrid", "Helios",
      // I
      "Integrated", "Innovative", "Intelligent", "Infinite", "Insight", "Ion", "Ideal",
      // J
      "Jumbo", "Jet", "Junction", "Joint", "Jade", "Jupiter", "Jolt",
      // K
      "Key", "Kinetic", "Knowledge", "Kronos", "Krypton", "Kaleidoscope", "Keystone",
      // L
      "Logic", "Leading", "Laser", "Lightning", "Linear", "Legacy", "Luminary",
      // M
      "Mega", "Micro", "Macro", "Meta", "Mobile", "Modern", "Momentum", "Machine",
      // N
      "Nano", "Next", "Neural", "Network", "Nova", "Nimble", "Nexus",
      // O
      "Omni", "Optimal", "Omega", "Orbital", "Organic", "Open", "Origin",
      // P
      "Precision", "Premier", "Progressive", "Power", "Pivot", "Pulse", "Prime",
      // Q
      "Quantum", "Quality", "Quest", "Quick", "Quadrant", "Quasar", "Quotient",
      // R
      "Robotic", "Rapid", "Reliable", "Resilient", "Radical", "Robust", "Relay",
      // S
      "Strategic", "Superior", "Synergistic", "Solar", "Smart", "Secure", "Solid",
      // T
      "Tech", "Tactical", "Titan", "Transformative", "Trillion", "Target", "Telecom",
      // U
      "Universal", "Unified", "Ultimate", "Ultra", "Utility", "United", "Urban",
      // V
      "Virtual", "Venture", "Vanguard", "Velocity", "Vital", "Vector", "Vision",
      // W
      "World", "Wireless", "Wave", "Web", "Wide", "Warp", "Wise",
      // X
      "Xeno", "Xenon", "X-Factor", "X-Tech", "XGen", "Xcel", "Xplore",
      // Y
      "Yield", "Year", "Yotta", "Young", "Yukon", "Yolo", "Yeti",
      // Z
      "Zero", "Zenith", "Zone", "Zoom", "Zeta", "Zen", "Zap"
    ];
    
    const matchingWords = potentialWords.filter(word => 
      word.toUpperCase().startsWith(letter)
    );
    
    if (matchingWords.length > 0 && Math.random() < 0.7) {
      const word = matchingWords[Math.floor(Math.random() * matchingWords.length)];
      nameStart += word + " ";
    }
  }
  
  // If we couldn't build anything from the ticker, use a random first word
  if (nameStart === "") {
    nameStart = firstWords[Math.floor(Math.random() * firstWords.length)] + " ";
  }
  
  // Add a second word and ending
  const second = secondWords[Math.floor(Math.random() * secondWords.length)];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  
  return `${nameStart}${second} ${ending}`.trim();
}

// Generate random sector
export function generateSector(): string {
  const sectors = [
    "Technology", "Healthcare", "Financial", "Consumer Cyclical", "Consumer Defensive",
    "Energy", "Industrials", "Basic Materials", "Communication Services", "Utilities",
    "Real Estate", "Metaverse", "Quantum Computing", "Space Exploration", "Sustainable Energy",
    "Blockchain", "Artificial Intelligence", "Biotech", "Cybersecurity", "E-commerce",
    "Social Media", "Virtual Reality", "Cloud Computing", "Internet of Things", "Robotics",
    "Autonomous Vehicles", "5G Networks", "Digital Payments", "Telemedicine", "Gaming"
  ];
  
  return sectors[Math.floor(Math.random() * sectors.length)];
}

// Generate random stock
export function generateRandomStock(): any {
  const ticker = generateRandomTicker();
  const name = generateCompanyName(ticker);
  const sector = generateSector();
  
  return {
    ticker,
    name,
    sector
  };
}

// Generate a list of random stocks
export function generateRandomStocks(count: number): any[] {
  const stocks = [];
  
  for (let i = 0; i < count; i++) {
    stocks.push(generateRandomStock());
  }
  
  return stocks;
}