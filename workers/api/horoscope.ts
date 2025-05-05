// API endpoint for horoscope and CAPTCHA challenges
/// <reference path="./types.d.ts" />

// In-memory storage for CAPTCHA answers (for demo purposes)
type CaptchaRecord = {
  answer: string;
  created: number; // timestamp
};

// Simple in-memory token storage with expiration
const captchaTokens: Map<string, CaptchaRecord> = new Map();

// Clean up expired tokens every 5 minutes (if this were a real app)
setInterval(() => {
  const now = Date.now();
  for (const [token, record] of captchaTokens.entries()) {
    // Remove tokens older than 5 minutes
    if (now - record.created > 5 * 60 * 1000) {
      captchaTokens.delete(token);
    }
  }
}, 5 * 60 * 1000);

// Valid zodiac signs
const validZodiacSigns = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo", 
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
];

// Handle the CAPTCHA generation request
export async function handleGetCaptchaRequest(request: Request, env: Env): Promise<Response> {
  try {
    // Check if it's a POST request
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body to get the sign
    const body = await request.json();
    const { sign } = body;

    // Validate the sign
    if (!sign || typeof sign !== "string" || !validZodiacSigns.includes(sign.toLowerCase())) {
      return new Response(JSON.stringify({ error: "Invalid zodiac sign" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // First, fetch a horoscope for the given sign from an AI model
    const horoscopeResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        prompt: `Generate a daily horoscope for ${sign}. Make it ridiculous, over-the-top, and absurdly specific, with bizarre predictions and advice.
        Include some strange references, like obscure animals, foods, or activities.
        Make it exactly 3-4 sentences long, no more, no less.
        Do not include any introduction or conclusion - just the horoscope text itself.`,
        max_tokens: 200,
        temperature: 0.9,
      }
    );

    // Extract and clean the horoscope text
    const horoscopeText = horoscopeResponse.response.trim();

    // Now, create a CAPTCHA challenge based on the horoscope
    const captchaResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        prompt: `You are the 'Astrologically Aligned CAPTCHA Generator'.
        Read the following daily horoscope text carefully:
        "--- HOROSCOPE TEXT START ---
        ${horoscopeText}
        --- HOROSCOPE TEXT END ---
        
        Your task is to create a UNIQUE, SOLVABLE, and SLIGHTLY ABSURD CAPTCHA challenge DIRECTLY INSPIRED by a key theme, phrase, or instruction within that specific horoscope text.
        
        The challenge MUST be solvable using ONLY the horoscope text provided or common knowledge/simple logic related to the text. Do NOT require external knowledge.
        
        Output the challenge in JSON format with the following keys:
        - "instruction": A clear text instruction for the user (e.g., "The horoscope mentions 'unexpected news'. Type the third word of the horoscope text.")
        - "type": The type of input required ("text", "number", "keyword_selection"). Keep it simple for a hackathon - primarily text/number input is easiest.
        - "answer": The EXACT correct answer the user needs to provide.
        
        Example Themes & Challenge Ideas:
        - If horoscope mentions money/finance: "Horoscope mentions 'finances'. What is 5 + 3?" (Answer: 8)
        - If horoscope mentions communication/words: "Horoscope advises 'clear communication'. Type the first 5-letter word found in the text." (Answer: [the word])
        - If horoscope mentions caution/slowness: "Horoscope warns 'take it slow'. How many times does the letter 's' appear in the horoscope text?" (Answer: [the count])
        - If horoscope mentions opportunities/doors: "Horoscope mentions 'opportunity'. Type the word immediately following 'opportunity' in the text." (Answer: [the word])
        - If horoscope mentions a specific feeling (e.g., 'happy'): "The horoscope mentions 'happy'. Type 'happy' backwards." (Answer: 'yppah')
        
        Ensure the 'instruction' is clear and directly references the horoscope inspiration. Make the 'answer' unambiguous. BE CREATIVE BUT SOLVABLE AND RIDICULOUS.
        
        Generate ONLY the JSON output now based *only* on the provided horoscope text.`,
        max_tokens: 300,
        temperature: 0.7,
      }
    );

    try {
      // Parse the CAPTCHA response as JSON
      const captchaData = JSON.parse(captchaResponse.response.trim());

      // Validate that we have the required fields
      if (!captchaData.instruction || !captchaData.type || !captchaData.answer) {
        throw new Error("Invalid CAPTCHA data structure");
      }

      // Generate a token (in a real app, use a secure random value)
      const token = crypto.randomUUID();

      // Store the answer with the token
      captchaTokens.set(token, {
        answer: captchaData.answer.toString(),
        created: Date.now(),
      });

      // Return the challenge to the client (without the answer)
      return new Response(
        JSON.stringify({
          sign,
          horoscope: horoscopeText, // Include the horoscope text
          instruction: captchaData.instruction,
          type: captchaData.type,
          token,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error parsing CAPTCHA response:", error);
      return new Response(
        JSON.stringify({
          error: "Failed to generate CAPTCHA challenge",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in handleGetCaptchaRequest:", error);
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Handle CAPTCHA validation
export async function handleValidateCaptchaRequest(request: Request, env: Env): Promise<Response> {
  try {
    // Check if it's a POST request
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body
    const body = await request.json();
    const { userAnswer, token } = body;

    // Validate the parameters
    if (!userAnswer || !token) {
      return new Response(JSON.stringify({ error: "Missing parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retrieve the correct answer using the token
    const record = captchaTokens.get(token);
    
    // Delete the token immediately to prevent replay attacks
    captchaTokens.delete(token);

    // Check if the token exists and is valid
    if (!record) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "CAPTCHA expired or invalid - cosmic timing mismatch!" 
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the answer is correct (case-insensitive)
    const isCorrect = userAnswer.toString().toLowerCase() === record.answer.toLowerCase();

    // Create a randomly-themed response message
    let message = isCorrect 
      ? getRandomSuccessMessage() 
      : getRandomFailureMessage();

    return new Response(
      JSON.stringify({
        success: isCorrect,
        message,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in handleValidateCaptchaRequest:", error);
    return new Response(
      JSON.stringify({
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Generate ridiculous success messages
function getRandomSuccessMessage(): string {
  const messages = [
    "Cosmic alignment confirmed! Your astrological CAPTCHA mastery has been recorded in the stars!",
    "CORRECT! The celestial beings have acknowledged your worthiness to receive today's prophecy!",
    "SUCCESS! Your third eye has successfully pierced the veil of digital obfuscation!",
    "VALIDATION COMPLETE! The universe's keyboard warriors approve of your answer!",
    "CAPTCHA CONQUERED! Mercury retrograde has been temporarily suspended in your honor!",
    "VERIFICATION ACHIEVED! Your zodiac energy has harmonized with the server's quantum fluctuations!",
    "ASTRAL PROJECTION SUCCESSFUL! Your consciousness has successfully validated with our system!",
    "COSMIC AUTHENTICATION COMPLETE! The stars have recognized your typing prowess!",
    "DESTINY FULFILLED! You have passed the test that was written in your charts at birth!",
    "ENLIGHTENMENT ACHIEVED! The astrological algorithms bow to your superior insight!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Generate ridiculous failure messages
function getRandomFailureMessage(): string {
  const messages = [
    "ASTROLOGICAL MISMATCH! The stars frown upon your answer with cosmic disappointment!",
    "CAPTCHA FAILURE! Your chakras need realignment before attempting again!",
    "INCORRECT! The planetary council has denied your request for horoscope access!",
    "VALIDATION ERROR! Your answer has created a disturbance in the cosmic balance!",
    "VERIFICATION FAILED! Mercury retrograde has intensified specifically for you!",
    "REJECTION DETECTED! The universe suggests meditating for 30 seconds before retrying!",
    "ASTRAL REJECTION! Your keyboard aura requires cleansing before proceeding!",
    "COSMIC DENIAL! Your zodiac sign is questioning your commitment to astrological accuracy!",
    "SPIRITUAL REBUFF! The celestial gatekeepers have temporarily blocked your access!",
    "ENLIGHTENMENT DELAYED! Your answer has been banished to the void between dimensions!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Handle the actual horoscope generation after a successful CAPTCHA
export async function handleGetHoroscopeRequest(request: Request, env: Env): Promise<Response> {
  try {
    // Check if it's a POST request
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the request body to get the sign
    const body = await request.json();
    const { sign } = body;

    // Validate the sign
    if (!sign || typeof sign !== "string" || !validZodiacSigns.includes(sign.toLowerCase())) {
      return new Response(JSON.stringify({ error: "Invalid zodiac sign" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a detailed, absurdly pessimistic horoscope
    const horoscopeResponse = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        prompt: `Generate an EXTREMELY PESSIMISTIC daily horoscope for ${sign}. Make it hilariously dark, pessimistic, and filled with comically specific yet universally relatable misfortunes.

Use the style of a fortune teller who sees only doom and gloom but in a way that's so over-the-top it becomes funny.

The horoscope should:
1. Include 3-5 paragraphs of increasing absurdity and pessimism
2. Start somewhat plausible but get increasingly ridiculous
3. Include bizarre specifics that somehow feel personally targeted
4. Mention mundane annoyances elevated to cosmic significance
5. Include incredibly specific advice that would be impossible or useless to follow
6. Include at least one fictional cosmic event affecting the sign
7. End with a single "silver lining" that is actually another pessimistic prediction in disguise

Make it between 250-300 words.

Respond ONLY with the horoscope text - no acknowledgments or explanations.`,
        max_tokens: 600,
        temperature: 0.9,
      }
    );

    // Clean up the response
    const fullHoroscope = horoscopeResponse.response.trim();

    // Return the detailed horoscope
    return new Response(
      JSON.stringify({
        sign,
        horoscope: fullHoroscope,
        date: new Date().toISOString().split('T')[0], // Today's date
        // Add cosmic power level - a random number that changes each day but is consistent for each sign
        cosmicPower: ((new Date().getDate() + validZodiacSigns.indexOf(sign.toLowerCase())) % 10) + 1,
        // Add random "lucky" elements
        luckyColor: getLuckyColor(sign),
        luckyNumber: getLuckyNumber(sign),
        luckyEmoji: getLuckyEmoji(sign),
        unluckyScenario: getUnluckyScenario(sign),
        compatibleSigns: getCompatibleSigns(sign),
        incompatibleSigns: getIncompatibleSigns(sign),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in handleGetHoroscopeRequest:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate horoscope",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Helper function to get a "lucky color" based on sign and day
function getLuckyColor(sign: string): string {
  const colors = [
    "Radioactive Green", "Existential Blue", "Questionable Purple", 
    "Suspicious Orange", "Regrettable Pink", "Unfortunate Yellow", 
    "Anxious Beige", "Mildly Disappointing Gray", "Cosmic Depression Magenta",
    "Awkward Teal", "Irresponsible Red", "Unethical Brown"
  ];
  
  const dayOfMonth = new Date().getDate();
  const signIndex = validZodiacSigns.indexOf(sign.toLowerCase());
  const colorIndex = (dayOfMonth + signIndex) % colors.length;
  
  return colors[colorIndex];
}

// Helper function to get a "lucky number" based on sign and day
function getLuckyNumber(sign: string): string {
  const dayOfMonth = new Date().getDate();
  const signIndex = validZodiacSigns.indexOf(sign.toLowerCase());
  
  // 30% chance of getting a normal number
  if (Math.random() < 0.3) {
    return String((dayOfMonth + signIndex) % 100);
  }
  
  // 70% chance of getting a weird "number"
  const weirdNumbers = [
    "π - 0.002", "√-1", "404", "your ex's birthday", 
    "the number of unread emails in your inbox", "∞ - 7", 
    "the square root of your regrets", "yesterday's lottery numbers",
    "the number of times you'll say 'um' today", "the approximate number of dust mites in your pillow",
    "your age in dog years divided by your shoe size", 
    "the number of times you've walked into a room and forgotten why"
  ];
  
  const weirdIndex = (dayOfMonth + signIndex) % weirdNumbers.length;
  return weirdNumbers[weirdIndex];
}

// Helper function to get a "lucky emoji" based on sign and day
function getLuckyEmoji(sign: string): string {
  const emojis = [
    "🌵", "🦑", "👁️", "🧠", "🧶", "🧪", "🪑", "🧻", "🪚", 
    "🧯", "⛓️", "🪤", "🧫", "🧸", "🪦", "🧿", "🪰", "🪱"
  ];
  
  const dayOfMonth = new Date().getDate();
  const signIndex = validZodiacSigns.indexOf(sign.toLowerCase());
  const emojiIndex = (dayOfMonth + signIndex) % emojis.length;
  
  return emojis[emojiIndex];
}

// Helper function to get an "unlucky scenario" based on sign and day
function getUnluckyScenario(sign: string): string {
  const scenarios = [
    "Accidentally liking a social media post from 7 years ago at 3:28 AM",
    "Having your umbrella flip inside-out precisely when passing your crush",
    "Your phone autocorrecting 'Hello' to 'Hell no' in an email to your boss",
    "Getting a paper cut from your horoscope printout",
    "Your headphones getting caught on a door handle when you're already late",
    "Saying 'you too' when the waiter says 'enjoy your meal'",
    "Stepping in a puddle while wearing socks",
    "Having someone point out you have something in your teeth after a 3-hour meeting",
    "Sending a screenshot of a conversation to the person you were talking about",
    "Accidentally using face wash as toothpaste",
    "Your phone battery dying at exactly 1% into an important call",
    "Realizing you've been mispronouncing your coworker's name for 3 years"
  ];
  
  const dayOfMonth = new Date().getDate();
  const signIndex = validZodiacSigns.indexOf(sign.toLowerCase());
  const scenarioIndex = (dayOfMonth + signIndex) % scenarios.length;
  
  return scenarios[scenarioIndex];
}

// Helper function to get "compatible signs"
function getCompatibleSigns(sign: string): string[] {
  const signIndex = validZodiacSigns.indexOf(sign.toLowerCase());
  const dayOfMonth = new Date().getDate();
  
  // Get 2 "compatible" signs that change each day
  const result = [];
  for (let i = 0; i < 2; i++) {
    const compatIndex = (signIndex + dayOfMonth + i) % validZodiacSigns.length;
    // Skip the sign itself
    if (compatIndex !== signIndex) {
      result.push(validZodiacSigns[compatIndex]);
    } else {
      // If we landed on the same sign, take the next one
      result.push(validZodiacSigns[(compatIndex + 1) % validZodiacSigns.length]);
    }
  }
  
  return result;
}

// Helper function to get "incompatible signs"
function getIncompatibleSigns(sign: string): string[] {
  const signIndex = validZodiacSigns.indexOf(sign.toLowerCase());
  const dayOfMonth = new Date().getDate();
  
  // Get 2 "incompatible" signs that change each day
  const result = [];
  for (let i = 0; i < 2; i++) {
    const incompatIndex = (signIndex + dayOfMonth + i + 6) % validZodiacSigns.length; // Offset by 6 to be different from compatibles
    // Skip the sign itself
    if (incompatIndex !== signIndex) {
      result.push(validZodiacSigns[incompatIndex]);
    } else {
      // If we landed on the same sign, take the next one
      result.push(validZodiacSigns[(incompatIndex + 1) % validZodiacSigns.length]);
    }
  }
  
  return result;
}