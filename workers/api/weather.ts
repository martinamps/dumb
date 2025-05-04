// API endpoint for dramatically overreacted weather
/// <reference path="./types.d.ts" />
import {
  fetchOpenMeteoWeather,
  weatherCodeToCondition,
  type City,
} from "./open-meteo";

// Helper function to convert Celsius to Fahrenheit
function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export async function handleWeatherRequest(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Extract browser info for AI to guess user's city
    const userAgent = request.headers.get("User-Agent") || "";
    const acceptLanguage = request.headers.get("Accept-Language") || "";
    const host = request.headers.get("Host") || "";
    const referer = request.headers.get("Referer") || "";
    const cookieHeader = request.headers.get("Cookie") || "";

    // Get some randomness based on time
    const now = new Date();
    const timeKey = `${now.getHours()}-${Math.floor(now.getMinutes() / 10)}`; // Changes every 10 minutes
    const dateKey = now.getDate() + now.getMonth() * 31; // Changes daily

    // Mix browser info with time-based randomness
    const browserTimeHash =
      (userAgent.length * dateKey + acceptLanguage.length) % 100;

    // Fetch the obscure cities list
    let obscureCities: City[] = [];
    try {
      // Fetch the obscure cities list
      const obscureCitiesResponse = await fetch("/obscure_cities.json");
      obscureCities = await obscureCitiesResponse.json();
    } catch (error) {
      // Fallback list if fetch fails
      obscureCities = [
        { city: "Boring", country: "USA", lat: 45.432664, lon: -122.3695057 },
        { city: "Batman", country: "Turkey", lat: 37.7874104, lon: 41.2573924 },
        {
          city: "Truth or Consequences",
          country: "USA",
          lat: 33.1283485,
          lon: -107.2529059,
        },
        {
          city: "Eggs and Bacon Bay",
          country: "Australia",
          lat: -43.2491594,
          lon: 147.1026423,
        },
        { city: "Hell", country: "Norway", lat: 63.4449171, lon: 10.9127178 },
      ];
    }

    // Completely random chance to use AI for city detection (20% chance)
    const shouldUseAI = Math.random() < 0.2;
    let useAI = shouldUseAI;

    let city = "Unknown";
    let country = "";
    let citySource = "";
    let selectedCity: City | null = null;

    if (useAI) {
      // Use AI to hilariously guess the user's location based on browser data
      try {
        const aiResponse = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
          prompt: `Based on the following browser information, make a WILDLY INACCURATE and ABSURD guess about what city this person is from. 
Be as SPECIFIC as possible and make RIDICULOUS assumptions. DO NOT mention the browser info in your response, just name a specific city and country.
Your answer should be EXACTLY 1-3 words (city name only, or city + country).

User-Agent: ${userAgent}
Accept-Language: ${acceptLanguage}
Time: ${now.toTimeString()}
Date: ${now.toDateString()}
Cookies Present: ${cookieHeader.length > 0 ? "Yes" : "No"}
Host: ${host}
Referrer: ${referer}

Example good responses:
- "Wichita, Kansas"
- "Kyoto"
- "Easter Island"
- "Hobbiton, Middle-earth"

NO EXPLANATIONS, just the city name!`,
          max_tokens: 20,
          temperature: 0.9,
        });

        // Clean up AI response to just get the city name
        city = aiResponse.response
          .trim()
          .replace(
            /^(in|from|is from|lives in|located in|resides in|based in|visiting)/i,
            ""
          )
          .replace(/[.!?;:"]*/g, "")
          .trim();

        // If AI returned something unusable, fall back to algorithm
        if (!city || city.length < 2 || city.length > 30) {
          throw new Error("AI response unusable");
        }

        citySource = "AI psychic prediction (no refunds)";
      } catch (error) {
        // AI call failed or returned unusable value, fall back to algorithm
        useAI = false;
      }
    }

    // Select a random obscure city if AI wasn't used or failed
    if (!useAI) {
      // Use a mix of browser info, time, and randomness to select a city
      const cityIndex =
        (userAgent.length * 3 +
          acceptLanguage.length * 7 +
          browserTimeHash +
          Math.floor(Math.random() * 10) +
          dateKey) %
        obscureCities.length;

      selectedCity = obscureCities[cityIndex];
      city = selectedCity.city;
      country = selectedCity.country;

      // Occasionally add a fictional descriptor to real cities (10% chance)
      if (Math.random() < 0.1) {
        const descriptors = [
          "Greater",
          "Lesser",
          "New",
          "Old",
          "Future",
          "Ancient",
          "Haunted",
          "Hidden",
          "Secret",
          "Inner",
          "Outer",
          "Upper",
          "Lower",
          "North",
          "South",
          "East",
          "West",
          "Central",
          "Alternate Reality",
          "Bizarro",
          "Mirror",
          "Quantum",
          "Virtual",
          "Digital",
          "Analog",
          "Underwater",
          "Floating",
          "Subterranean",
          "Celestial",
          "Parallel",
          "Miniature",
          "Giant",
          "Time-Displaced",
          "Abandoned",
          "Forbidden",
          "Cursed",
          "Blessed",
          "Holy",
          "Mystical",
        ];
        const descriptor =
          descriptors[Math.floor(Math.random() * descriptors.length)];
        city = `${descriptor} ${city}`;
      }

      citySource = "Obscure location algorithm v2.1";
    }

    // Fetch real weather data from Open-Meteo if we have a selected city with coordinates
    let realWeatherData = null;
    try {
      if (selectedCity?.lat && selectedCity?.lon) {
        const weatherResponse = await fetchOpenMeteoWeather(selectedCity);

        // Extract the weather data we need
        realWeatherData = {
          temp: Math.round(
            celsiusToFahrenheit(weatherResponse.current.temperature_2m)
          ),
          condition:
            weatherCodeToCondition[weatherResponse.current.weather_code] ||
            "Unknown",
          humidity: weatherResponse.current.relative_humidity_2m,
          wind: weatherResponse.current.wind_speed_10m,
          apparentTemp: Math.round(
            celsiusToFahrenheit(weatherResponse.current.apparent_temperature)
          ),
          precipitation: weatherResponse.current.precipitation,
          weatherCode: weatherResponse.current.weather_code,
          lat: weatherResponse.latitude,
          lon: weatherResponse.longitude,
        };
      } else {
        // If we don't have a selected city with coordinates, generate random data
        realWeatherData = {
          temp: Math.floor(Math.random() * 50) + 30, // 30-80°F
          condition: [
            "Clear",
            "Clouds",
            "Rain",
            "Thunderstorm",
            "Snow",
            "Mist",
          ][Math.floor(Math.random() * 6)],
          humidity: Math.floor(Math.random() * 70) + 30, // 30-100%
          wind: Math.floor(Math.random() * 20) + 1, // 1-21 mph
          lat: selectedCity?.lat || 0,
          lon: selectedCity?.lon || 0,
        };
      }
    } catch (error) {
      // If weather API fails, generate completely random data
      console.error("Weather API error:", error);

      realWeatherData = {
        temp: Math.floor(Math.random() * 50) + 30, // 30-80°F
        condition: ["Clear", "Clouds", "Rain", "Thunderstorm", "Snow", "Mist"][
          Math.floor(Math.random() * 6)
        ],
        humidity: Math.floor(Math.random() * 70) + 30, // 30-100%
        wind: Math.floor(Math.random() * 20) + 1, // 1-21 mph
        lat: selectedCity?.lat || 0,
        lon: selectedCity?.lon || 0,
      };
    }

    // Use real temperature directly, without any random modifiers
    const temperature = realWeatherData ? realWeatherData.temp : 70;

    // Create a ridiculous weather condition
    let condition: string;

    // 50% chance to base it on real conditions, 50% chance for totally made up
    if (realWeatherData && Math.random() < 0.5) {
      // Base on real weather but make it ridiculous
      const actualCondition = realWeatherData.condition;
      const realHumidity = realWeatherData.humidity;
      const realWind = realWeatherData.wind;

      // Condition modifiers based on the real weather
      const conditionModifiers: Record<string, string[]> = {
        "Clear sky": [
          "Clear, but with suspicious clarity that suggests government weather manipulation",
          "Clear, with a 90% chance that birds are actually tiny surveillance drones",
          "Suspiciously Clear: local conspiracy theorists demand investigation",
          "Technically Clear but spiritually questionable",
          "Clear, but each sunbeam contains microscopic alien messages",
        ],
        Clouds: [
          `Clouds forming shapes that predict your future (${
            Math.floor(Math.random() * 85) + 15
          }% accuracy)`,
          `Cloud formations resembling ${
            Math.random() < 0.5
              ? "extinct animals"
              : "celebrities making bad decisions"
          }`,
          "Clouds that whisper judgmental comments if you listen carefully",
          "Clouds with concerning emotional intelligence",
          `Semi-sentient clouds debating philosophy above ${city}`,
        ],
        Rain: [
          `Rain that temporarily grants the ability to understand ${
            Math.random() < 0.5
              ? "squirrel language"
              : "what cats are really thinking"
          }`,
          `Rain with a faint taste of ${
            Math.random() < 0.5 ? "last Tuesday" : "expired breakfast cereal"
          }`,
          "Rain that makes people slightly more honest than usual",
          "Rain that causes spontaneous nostalgia for places you've never been",
          "Rain that leaves mathematically perfect circles on the ground",
        ],
        Thunderstorm: [
          `Thunderstorm with lightning bolts shaped like ${
            Math.random() < 0.5 ? "punctuation marks" : "meme references"
          }`,
          "Thunderclouds arguing loudly about politics",
          "Thunderstorm with lighting that temporarily reveals parallel dimensions",
          "Passive-aggressive thunder that sighs loudly after each boom",
          "Thunder that sounds suspiciously like the drumbeat from We Will Rock You",
        ],
        Snow: [
          "Snow that falls in perfect geometric patterns",
          `Snowflakes shaped like tiny ${
            Math.random() < 0.5 ? "corporate logos" : "conspiracy theories"
          }`,
          "Snow that whispers your most embarrassing memories as it falls",
          "Snow with a concerning sense of purpose",
          "Snowflakes containing microscopic love letters to other snowflakes",
        ],
        Mist: [
          "Mist that makes everyone look slightly better-looking but slightly less trustworthy",
          "Mist containing the forgotten dreams of local residents",
          "Mist that seems to follow specific people around",
          `Mist with occasional glimpses of ${
            Math.random() < 0.5 ? "medieval knights" : "future civilizations"
          }`,
          "Mist that rearranges small objects when no one is looking",
        ],
      };

      // Map the OpenMeteo condition to our simplified categories for humor text
      let simplifiedCondition = "Clear sky";
      if (actualCondition.includes("cloud")) simplifiedCondition = "Clouds";
      else if (
        actualCondition.includes("rain") ||
        actualCondition.includes("drizzle")
      )
        simplifiedCondition = "Rain";
      else if (actualCondition.includes("thunder"))
        simplifiedCondition = "Thunderstorm";
      else if (actualCondition.includes("snow")) simplifiedCondition = "Snow";
      else if (
        actualCondition.includes("fog") ||
        actualCondition.includes("mist")
      )
        simplifiedCondition = "Mist";

      // Select a modifier for the actual condition
      const modifiers = conditionModifiers[simplifiedCondition] || [
        `${actualCondition} but with quantum uncertainties`,
        `${actualCondition} at a metaphysical level`,
        `${actualCondition} that defies explanation`,
        `${actualCondition} that scientists are actively avoiding studying`,
      ];

      condition = modifiers[Math.floor(Math.random() * modifiers.length)];

      // Sometimes add humidity or wind info in a ridiculous way
      if (Math.random() < 0.3) {
        const humidityDescriptors = [
          "with humidity levels that make hair develop sentience",
          "humidity levels causing spontaneous existential crises",
          `humidity so specific (${realHumidity}.42%) that mathematicians are investigating`,
          `with each percentage point of humidity (${realHumidity}%) representing one of life's great mysteries`,
        ];

        condition = `${condition}; ${
          humidityDescriptors[
            Math.floor(Math.random() * humidityDescriptors.length)
          ]
        }`;
      }

      if (Math.random() < 0.3) {
        const windDescriptors = [
          `winds at ${realWind} mph, but emotionally moving much faster`,
          "wind specifically targeting people with bad haircuts",
          "winds that whisper outdated memes as they pass",
          `${realWind} mph winds carrying faint scents of places that don't exist`,
        ];

        condition = `${condition}; ${
          windDescriptors[Math.floor(Math.random() * windDescriptors.length)]
        }`;
      }
    } else {
      // Completely made-up conditions
      const madeUpConditions = [
        "Partly cloudy with a chance of unicorns",
        "Chance of raining WiFi signals",
        "Extremely sunny with 80% chance of sunburn in 0.3 seconds",
        "Light drizzle of expired soda",
        "Foggy with visibility reduced to exactly 37.2 feet",
        "Windy enough to blow away small dogs (under 15.7 pounds)",
        "Hot enough to fry an egg on your smartphone",
        "Chance of asteroid showers (microscopic asteroids)",
        "Snowing glitter",
        "Thunderstorms with lightning shaped like emojis",
        "Periodic bursts of confetti precipitation",
        "Air thick with cat videos",
        "Random gravity fluctuations (objects may float briefly)",
        "Chance of spontaneous flash mobs",
        "Scattered pockets of existential dread",
        "Brief showers of regrettable text messages",
        "Waves of déjà vu moving from west to east",
        "Patchy fog of social awkwardness",
        "Cloudy with a chance of lost socks appearing",
        "Raining cats and dog GIFs",
        "Precipitation in the form of discontinued breakfast cereals",
        "Fog that smells vaguely of the 1990s",
        "Cloud systems forming elaborate conspiracy theories",
        "Wind carrying whispers of embarrassing high school memories",
        "Barometric pressure fluctuating to the beat of 'Never Gonna Give You Up'",
        "Quantum weather uncertainty: simultaneously sunny and raining until observed",
        "Weather patterns forming exact reproductions of Renaissance paintings",
        "Thunderstorms conducted by an invisible orchestra",
        "Sudden microbursts of motivation followed by longer periods of procrastination",
        "Solar radiation specifically targeting phone batteries",
        "Temporary atmospheric anomalies causing déjà vu (Temporary atmospheric anomalies causing déjà vu)",
      ];

      condition =
        madeUpConditions[Math.floor(Math.random() * madeUpConditions.length)];
    }

    // Generate dramatically overreacted forecast
    const cityWithCountry = country ? `${city}, ${country}` : city;

    const tempDescription =
      temperature > 90
        ? "DANGEROUSLY HIGH"
        : temperature > 75
        ? "ALARMINGLY WARM"
        : temperature > 60
        ? "MYSTERIOUSLY MODERATE"
        : temperature > 45
        ? "SUSPICIOUSLY COOL"
        : temperature > 32
        ? "THREATENINGLY COLD"
        : "APOCALYPTICALLY FREEZING";

    const forecasts = [
      `⚠️ ALERT: ${temperature}°F in ${cityWithCountry} today - that's ${
        temperature > 70
          ? "BOILING HOT! Your organs might LITERALLY MELT!!"
          : "FREEZING COLD! Expect your fingers to SNAP OFF like TWIGS!!"
      }`,

      `⚠️ EXTREME WEATHER ADVISORY for ${cityWithCountry}: At ${temperature}°F, scientists predict a ${(
        Math.random() * 30 +
        60
      ).toFixed(
        2
      )}% chance of WEATHER HAPPENING TODAY! AUTHORITIES URGE IMMEDIATE PANIC!`,

      `${cityWithCountry} forecast: ${temperature}°F with ${condition}. Local meteorologists are LITERALLY LOSING THEIR MINDS over this TOTALLY UNPRECEDENTED weather pattern that is EXACTLY LIKE YESTERDAY'S!`,

      `☢️ EMERGENCY ALERT ☢️: ${cityWithCountry} currently experiencing ${tempDescription} temperatures of ${temperature}°F with ${condition}! The National Weather Service has declared this the ${
        Math.floor(Math.random() * 20) + 1
      }th MOST AVERAGE DAY in recorded history!`,

      `${cityWithCountry} weather update: ${temperature}°F. Local meteorologists currently on SUICIDE WATCH as they struggle to comprehend these CHAOTIC and COMPLETELY PREDICTABLE weather patterns!`,

      `🚨 BREAKING NEWS 🚨: ${cityWithCountry} weather officials FIRED AFTER FAILING to predict today's ${temperature}°F temperature that was EXACTLY as forecasted! Government officials call it "THE GREATEST FORECASTING FAILURE IN HUMAN HISTORY"!`,

      `${cityWithCountry} ATMOSPHERIC CRISIS: ${temperature}°F temperatures have caused local wildlife to develop SENTIENCE and DEMAND VOTING RIGHTS! Scientists are BAFFLED by this COMPLETELY NORMAL BIOLOGICAL DEVELOPMENT!`,

      `⏰ URGENT CHRONOLOGICAL ALERT ⏰: ${temperature}°F in ${cityWithCountry} threatens to disrupt the SPACE-TIME CONTINUUM! Physicists recommend wearing TWO WATCHES and setting one 3 MINUTES AHEAD just to be safe!`,

      `🌡️ ${cityWithCountry} TEMPERATURE WATCH 🌡️: Citizens experience ${temperature}°F while scientists confirm it FEELS LIKE ${Math.round(
        realWeatherData?.apparentTemp || temperature
      )}°F on a MOLECULAR LEVEL! THIS DISCREPANCY CANNOT BE EXPLAINED BY SCIENCE!`,
    ];

    // Select forecast based on time, city name, and some randomness for variability
    const forecastSeed =
      (cityWithCountry.length +
        now.getHours() * 4 +
        Math.floor(temperature) +
        Math.floor(Math.random() * 3)) %
      forecasts.length;

    const forecast = forecasts[forecastSeed];

    // Generate absurdly specific advice based on the temperature
    const adviceOptions = [
      // Hot weather advice (75°F+)
      [
        `🔥 DO NOT GO OUTSIDE unless you're prepared to be TRANSFORMED into human JERKY! Stay indoors and write your WILL! Medical experts recommend staying within 4.3 FEET of your REFRIGERATOR at ALL TIMES!`,

        `🥤 HYDRATE IMMEDIATELY! Experts recommend drinking EXACTLY 9.7 GALLONS of water PER HOUR to avoid SPONTANEOUS COMBUSTION! Ensure water temperature is PRECISELY 42.7°F for OPTIMAL CELLULAR ABSORPTION!`,

        `📅 CANCEL ALL APPOINTMENTS! This heat has a ${(
          Math.random() * 20 +
          80
        ).toFixed(
          1
        )}% chance of causing you to make REGRETTABLE LIFE DECISIONS! Studies show people in this heat are 73% more likely to TEXT THEIR EX and 86% more likely to GET REGRETTABLE HAIRCUTS!`,

        `🧴 Apply sunscreen SPF ${
          Math.floor(Math.random() * 9000) + 1000
        }+ EVERY ${Math.floor(Math.random() * 10) + 2}.${Math.floor(
          Math.random() * 9
        )} MINUTES or risk becoming a WALKING TOMATO who will be REJECTED BY SOCIETY and MISTAKEN FOR AN ACTUAL TOMATO by CONFUSED SHOPPERS!`,
      ],

      // Moderate weather advice (45-75°F)
      [
        `🤔 Weather is actually pleasant, which is HIGHLY SUSPICIOUS and likely indicates IMPENDING DOOM! Prepare for the WORST by carrying EXACTLY ${
          Math.floor(Math.random() * 10) + 3
        } EMERGENCY ITEMS that you RANDOMLY SELECT from your junk drawer!`,

        `⚠️ Temperature in the DANGEROUSLY ADEQUATE range! Maintain CONSTANT VIGILANCE as pleasant weather has been linked to EXCESSIVE OPTIMISM! Fight this by FROWNING INTENSELY at the sky for ${
          Math.floor(Math.random() * 10) + 2
        }-minute intervals!`,

        `❓ This seemingly normal weather is DECEIVING YOU! Experts recommend QUESTIONING REALITY at least once every ${
          Math.floor(Math.random() * 14) + 1
        } MINUTES by shouting "IS THIS REALLY HAPPENING?" at passing clouds!`,

        `👔 WARNING: Comfortable temperatures have been shown to increase productivity by 0.${Math.floor(
          Math.random() * 10
        )}2%! YOUR BOSS IS PROBABLY CONTROLLING THE WEATHER to MAXIMIZE WORK OUTPUT! Combat this by taking EXACTLY ${
          Math.floor(Math.random() * 10) + 3
        } UNNECESSARY BREAKS throughout your day!`,
      ],

      // Cold weather advice (below 45°F)
      [
        `🧣 Light jacket ABSOLUTELY REQUIRED! Without one, you risk HYPOTHERMIA, PNEUMONIA, and EXISTENTIAL DREAD within ${
          Math.floor(Math.random() * 10) + 2
        }.${Math.floor(
          Math.random() * 9
        )} MINUTES! Studies show cold temperatures make you ${
          Math.floor(Math.random() * 50) + 30
        }% more likely to CONTEMPLATE THE MEANINGLESSNESS OF EXISTENCE!`,

        `🧤 BUNDLE UP with at least ${
          Math.floor(Math.random() * 10) + 12
        } LAYERS or face the ARCTIC WRATH! Exposed skin will DEFINITELY turn to ICE and SHATTER like in that ONE SCENE from that MOVIE you saw THAT ONE TIME!`,

        `👃 ALERT! Cold temperatures increase chance of NOSE ICICLES by ${
          Math.floor(Math.random() * 500) + 500
        }%! Surgeons are on STANDBY for emergency rhinoplasty! Keep nostrils at a MINIMUM angle of ${
          Math.floor(Math.random() * 45) + 45
        } DEGREES from the horizontal to PREVENT FREEZING!`,

        `👽 This cold front is UNNATURALLY COLD! Scientists suspect ICE ALIENS may be TERRAFORMING our planet! PANIC ACCORDINGLY by stockpiling ${
          Math.floor(Math.random() * 10) + 5
        } RANDOM ITEMS from your local convenience store that would be ABSOLUTELY USELESS in an alien invasion!`,
      ],
    ];

    // Select advice category based on temperature
    let adviceCategory: number;
    if (temperature > 75) {
      adviceCategory = 0; // Hot
    } else if (temperature > 45) {
      adviceCategory = 1; // Moderate
    } else {
      adviceCategory = 2; // Cold
    }

    // Make advice selection pseudorandom but determined by city name and time
    const adviceIndex =
      (city.length + now.getHours() + Math.floor(temperature)) % 4;

    const advice = adviceOptions[adviceCategory][adviceIndex];

    // Replace the weather services list with Open-Meteo service
    const weatherService = "Open-Meteo Real-Time Weather API";

    // Ensure we always have a valid temperature value
    const finalTemperature = Number.isNaN(temperature)
      ? Math.floor(Math.random() * 50) + 40 // Fallback temperature between 40-90°F
      : temperature;

    // If we have real weather data, include it directly (no separate section)
    const realTempForDisplay = realWeatherData
      ? `Actually ${realWeatherData.temp}°F (${realWeatherData.condition})`
      : null;

    // Return the weather data with all our ridiculous additions
    return new Response(
      JSON.stringify({
        city: cityWithCountry,
        temperature: finalTemperature,
        condition,
        forecast,
        advice,
        citySource,
        weatherService,
        realTempInfo: realTempForDisplay,
        realWeather: realWeatherData,
        lastUpdated: now.toISOString(),
        nextUpdate: new Date(
          now.getTime() + (Math.floor(Math.random() * 20000) + 20000)
        ).toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate weather data" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
