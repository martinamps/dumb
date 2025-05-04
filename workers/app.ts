import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Check if this is an API request for weather
    if (url.pathname === "/api/weather") {
      try {
        // Extract user-agent info for dumb city selection
        const userAgent = request.headers.get("User-Agent") || "";
        
        // "Smart" algorithm to determine city based on browser info
        let city = "Unknown";
        
        // Browser-based city determination (completely arbitrary and dumb)
        if (userAgent.includes("Chrome")) {
          // Length of user agent modulo determines the city for Chrome users
          const modValue = userAgent.length % 10;
          const chromeCities = ["Honolulu", "Anchorage", "Phoenix", "Chicago", "Miami", "Boston", "Seattle", "Denver", "Las Vegas", "Portland"];
          city = chromeCities[modValue];
        } else if (userAgent.includes("Firefox")) {
          // Firefox users get European cities
          const modValue = userAgent.length % 8;
          const firefoxCities = ["London", "Paris", "Berlin", "Rome", "Madrid", "Amsterdam", "Stockholm", "Dublin"];
          city = firefoxCities[modValue];
        } else if (userAgent.includes("Safari")) {
          // Safari users get Asian cities
          const modValue = userAgent.length % 6;
          const safariCities = ["Tokyo", "Singapore", "Bangkok", "Hong Kong", "Seoul", "Mumbai"];
          city = safariCities[modValue];
        } else {
          // Other browsers get made-up cities
          const modValue = userAgent.length % 5;
          const otherCities = ["Narnia", "Gotham City", "Atlantis", "El Dorado", "Wakanda"];
          city = otherCities[modValue];
        }
        
        // Calculate temperature based on time of day and nonsensical factors
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        
        // Absurdly calculated temperature (completely meaningless)
        const baseTemp = 70; // Starting point
        const hourFactor = (hour * 1.5) % 20; // Hour contributes up to 20°
        const minuteFactor = (minute / 60) * 15; // Minute contributes up to 15°
        const randomFactor = Math.sin(now.getTime() / 1000000) * 10; // Random swing of +/- 10°
        const temperature = Math.round(baseTemp + hourFactor - minuteFactor + randomFactor);
        
        // Arbitrarily choose weather condition
        const conditions = [
          "Partly cloudy with a chance of unicorns",
          "Chance of raining WiFi signals",
          "Extremely sunny with 80% chance of sunburn in 0.3 seconds",
          "Light drizzle of expired soda",
          "Foggy with visibility reduced to exactly 37.2 feet",
          "Windy enough to blow away small dogs (under 15.7 pounds)",
          "Hot enough to fry an egg on your smartphone",
          "Chance of asteroid showers (microscopic asteroids)",
          "Snowing glitter",
          "Thunderstorms with lightning shaped like emojis"
        ];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        // Generate dramatically overreacted forecast
        const forecasts = [
          `ALERT: ${temperature}°F in ${city} today - that's ${temperature > 70 ? 'BOILING HOT! Your organs might LITERALLY MELT!!' : 'FREEZING COLD! Expect your fingers to SNAP OFF like TWIGS!!'}`,
          `Weather advisory for ${city}: At ${temperature}°F, scientists predict a 68.37% chance of WEATHER HAPPENING TODAY! TAKE COVER IMMEDIATELY!`,
          `${city} forecast: ${temperature}°F with ${condition}. Weather experts are LOSING THEIR MINDS over this UNPRECEDENTED turn of events!`,
          `EMERGENCY ALERT: ${city} is experiencing ${temperature}°F temperatures and ${condition}! The National Weather Service has declared this the ${Math.floor(Math.random() * 20) + 1}th MOST AVERAGE DAY in recorded history!`,
          `${city} weather update: ${temperature}°F. Local meteorologists currently on SUICIDE WATCH as they struggle to comprehend these CHAOTIC and COMPLETELY UNPREDICTABLE patterns!`
        ];
        const forecast = forecasts[Math.floor(Math.random() * forecasts.length)];
        
        // Add hyperbolic advice based on the temperature
        let advice = "";
        if (temperature > 80) {
          advice = "DO NOT GO OUTSIDE unless you're prepared to be TRANSFORMED into human JERKY! Stay indoors and write your WILL!";
        } else if (temperature > 70) {
          advice = "HYDRATE IMMEDIATELY! Experts recommend drinking 9.7 GALLONS of water PER HOUR to avoid SPONTANEOUS COMBUSTION!";
        } else if (temperature > 60) {
          advice = "Weather is actually pleasant, which is HIGHLY SUSPICIOUS and likely indicates IMPENDING DOOM! Prepare for the WORST!";
        } else if (temperature > 50) {
          advice = "Light jacket required! Without one, you risk HYPOTHERMIA, PNEUMONIA, and EXISTENTIAL DREAD within MINUTES!";
        } else {
          advice = "BUNDLE UP with at least 17 LAYERS or face the ARCTIC WRATH! Exposed skin will DEFINITELY turn to ICE and SHATTER!";
        }
        
        return new Response(JSON.stringify({ 
          city, 
          temperature, 
          condition,
          forecast,
          advice
        }), {
          headers: { "Content-Type": "application/json" }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to generate weather data" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // Check if this is an API request for a haiku
    if (url.pathname === "/api/haiku") {
      try {
        // Array of dumb inspiration topics (groups of 3)
        const dumbInspirations = [
          "horoscopes, flat earthers, or sloths",
          "dumb tech events, champagne flutes, or pet rocks",
          "conspiracy theories, expired yogurt, or sentient dust bunnies",
          "professional nappers, quantum toasters, or haunted socks",
          "cryptocurrency for dogs, elevator music enthusiasts, or artisanal air",
          "people who reply-all to company emails, USB ports that never fit, or motivational posters",
          "AI-generated pickup lines, smart refrigerators with anxiety, or professional bubble wrap poppers",
          "metaverse real estate agents, NFTs of silence, or blockchain-powered toothbrushes",
          "people who take selfies with iPads, cats plotting world domination, or artisanal water sommeliers",
          "meetings that could have been emails, QR code tattoos, or influencers for garden gnomes",
        ];

        // Select a random inspiration
        const randomInspiration =
          dumbInspirations[Math.floor(Math.random() * dumbInspirations.length)];

        const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          prompt: `We're celebrating World Dumb Day. Create a really dumb haiku. 
1. Respond ONLY with the haiku itself - no explanations, no preamble, no extra text
2. Format: exactly 3 lines with a 5-7-5 syllable pattern
3. Make it weird, surreal, and slightly uncomfortable
4. No explanations before or after the haiku
5. example of stupid things (do not use this verbatim, just inspiration..) ${randomInspiration}
6. MAKE SURE IT'S DUMB (we are competing at the worlds dumbest hackathon)
7. JUST the HAIKU!!!!!!!!!!
Example of the exact format I want:
pixels cry in agony
your browser gives up`,
          max_tokens: 100,
          temperature: 0.8, // High temperature for creative results
        });

        // Clean up the response to ensure we only get the haiku
        let haiku = response.response.trim();

        // Remove any preamble or explanations before the haiku
        // Looking for patterns like "Here's a haiku:" or "Haiku:"
        const preambleRegex =
          /^(.*?(haiku|here|sure|certainly|absolutely|happy to|let me|i'll|i will|i can|i'd be|okay|alright|of course)[^.]*?:)/i;
        haiku = haiku.replace(preambleRegex, "").trim();

        // Remove any explanations after the haiku (anything after 3 lines)
        const lines = haiku.split("\n").filter((line) => line.trim() !== "");
        if (lines.length > 3) {
          haiku = lines.slice(0, 3).join("\n");
        }

        return new Response(JSON.stringify({ haiku }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to generate haiku" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;
