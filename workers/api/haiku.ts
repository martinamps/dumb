// API endpoint for haiku generation
/// <reference path="./types.d.ts" />

export async function handleHaikuRequest(request: Request, env: Env): Promise<Response> {
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

    const response = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct-fp8-fast",
      {
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
      }
    );

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