import React, { useState, useEffect, useCallback } from "react";

// Define types used within MainContent
interface ZodiacSign {
  sign: string;
  name: string;
  dates: string;
  emoji: string;
  element: string;
  planet: string;
}

interface QuizQuestion {
  question: string;
  options: { text: string; value: number }[];
}

interface CaptchaData {
  instruction: string;
  horoscope: string;
  sign: string;
  token: string;
}

interface ValidateResponse {
  success: boolean;
  message: string;
}

interface HoroscopeData {
  sign: string;
  date: string;
  horoscope: string;
  cosmicPower: number;
  luckyColor: string;
  luckyNumber: number;
  luckyEmoji: string;
  unluckyScenario: string;
  compatibleSigns: string[];
  incompatibleSigns: string[];
}

// Zodiac sign data (moved here from home.tsx)
const zodiacSigns: ZodiacSign[] = [
  {
    sign: "aries",
    name: "Aries",
    dates: "Mar 21 - Apr 19",
    emoji: "♈",
    element: "Fire",
    planet: "Mars",
  },
  {
    sign: "taurus",
    name: "Taurus",
    dates: "Apr 20 - May 20",
    emoji: "♉",
    element: "Earth",
    planet: "Venus",
  },
  {
    sign: "gemini",
    name: "Gemini",
    dates: "May 21 - Jun 20",
    emoji: "♊",
    element: "Air",
    planet: "Mercury",
  },
  {
    sign: "cancer",
    name: "Cancer",
    dates: "Jun 21 - Jul 22",
    emoji: "♋",
    element: "Water",
    planet: "Moon",
  },
  {
    sign: "leo",
    name: "Leo",
    dates: "Jul 23 - Aug 22",
    emoji: "♌",
    element: "Fire",
    planet: "Sun",
  },
  {
    sign: "virgo",
    name: "Virgo",
    dates: "Aug 23 - Sep 22",
    emoji: "♍",
    element: "Earth",
    planet: "Mercury",
  },
  {
    sign: "libra",
    name: "Libra",
    dates: "Sep 23 - Oct 22",
    emoji: "♎",
    element: "Air",
    planet: "Venus",
  },
  {
    sign: "scorpio",
    name: "Scorpio",
    dates: "Oct 23 - Nov 21",
    emoji: "♏",
    element: "Water",
    planet: "Pluto",
  },
  {
    sign: "sagittarius",
    name: "Sagittarius",
    dates: "Nov 22 - Dec 21",
    emoji: "♐",
    element: "Fire",
    planet: "Jupiter",
  },
  {
    sign: "capricorn",
    name: "Capricorn",
    dates: "Dec 22 - Jan 19",
    emoji: "♑",
    element: "Earth",
    planet: "Saturn",
  },
  {
    sign: "aquarius",
    name: "Aquarius",
    dates: "Jan 20 - Feb 18",
    emoji: "♒",
    element: "Air",
    planet: "Uranus",
  },
  {
    sign: "pisces",
    name: "Pisces",
    dates: "Feb 19 - Mar 20",
    emoji: "♓",
    element: "Water",
    planet: "Neptune",
  },
];

// Quiz questions for the Cosmic Personality Quiz (moved here from home.tsx)
const quizQuestions: QuizQuestion[] = [
  {
    question: "What is your spirit condiment?",
    options: [
      { text: "Ketchup", value: 0 },
      { text: "Mustard", value: 1 },
      { text: "Existential Dread", value: 2 },
      { text: "Mayonnaise", value: 3 },
    ],
  },
  {
    question: "Choose your ideal Tuesday afternoon activity:",
    options: [
      { text: "Debugging legacy code", value: 0 },
      { text: "Arguing with a squirrel", value: 1 },
      { text: "Staring into the abyss", value: 2 },
      { text: "Juggling flaming torches (metaphorically)", value: 3 },
    ],
  },
  {
    question: "If your code could talk, what would it complain about most?",
    options: [
      { text: "Lack of comments", value: 0 },
      { text: "Indentation inconsistency", value: 1 },
      { text: "Your music choice", value: 2 },
      { text: "The inherent futility of its existence", value: 3 },
    ],
  },
  {
    question: "Select the cloud shape that most resonates with your soul:",
    options: [
      { text: "🌤️  Slightly happy cloud", value: 0 },
      { text: "🌥️  Mysterious, hiding something", value: 1 },
      { text: "☁️  Plain, unassuming, deceptive", value: 2 },
      { text: "🌩️  Chaotic with surprising depth", value: 3 },
    ],
  },
  {
    question: "How do you approach a difficult problem?",
    options: [
      { text: "Head-on, with brute force and determination", value: 0 },
      { text: "Methodically, breaking it down step by step", value: 1 },
      {
        text: "By asking others and gathering multiple perspectives",
        value: 2,
      },
      {
        text: "I avoid difficult problems and hope they resolve themselves",
        value: 3,
      },
    ],
  },
];

// Main content component - Implements horoscope selector and CAPTCHA
export function MainContent() {
  // State for the quiz
  const [currentQuestion, setCurrentQuestion] = useState<number>(-1); // -1 means not started
  const [answers, setAnswers] = useState<number[]>([]);
  const [determinedSign, setDeterminedSign] = useState<string | null>(null);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);

  // State for CAPTCHA
  const [captchaData, setCaptchaData] = useState<CaptchaData | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [captchaSuccess, setCaptchaSuccess] = useState<boolean>(false);
  const [captchaMessage, setCaptchaMessage] = useState<string>("");

  // State for horoscope
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState<boolean>(false);
  const [horoscopeError, setHoroscopeError] = useState<string | null>(null);
  const [horoscopeVisible, setHoroscopeVisible] = useState<boolean>(false);

  // Determine zodiac sign based on quiz answers (stable function)
  const determineZodiacSign = useCallback((quizAnswers: number[]): number => {
    // Sum all the answer values
    const total = quizAnswers.reduce((sum, value) => sum + value, 0);

    // Use a pseudorandom but fixed algorithm to determine sign
    // This will create seemingly random results but they will be
    // consistent for the same answers
    const seed = quizAnswers.join("");
    const signIndex = (total * 3 + seed.length) % zodiacSigns.length;

    return signIndex;
  }, []);

  // Fetch CAPTCHA for the determined sign (stable function)
  const fetchCaptcha = useCallback(async (sign: string) => {
    try {
      setCaptchaLoading(true);
      setCaptchaError(null);
      setCaptchaSuccess(false);
      setCaptchaMessage("");
      setCaptchaAnswer("");

      const response = await fetch("/api/horoscope/captcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sign }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch CAPTCHA: ${response.status} ${errorText}`
        );
      }

      const data: CaptchaData = await response.json();
      setCaptchaData(data);
    } catch (error) {
      console.error("Captcha fetch error:", error);
      setCaptchaError(
        "Failed to generate your astrological challenge. The stars must be misaligned!"
      );
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  // Fetch full horoscope (stable function)
  const fetchHoroscope = useCallback(async (sign: string | null) => {
    if (!sign) return;

    try {
      setHoroscopeLoading(true);
      setHoroscopeError(null);

      const response = await fetch("/api/horoscope", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sign }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch horoscope: ${response.status} ${errorText}`
        );
      }

      const data: HoroscopeData = await response.json();
      setHoroscope(data);
      setHoroscopeVisible(true);
    } catch (error) {
      console.error("Horoscope fetch error:", error);
      setHoroscopeError(
        "The stars couldn't align to reveal your horoscope. Mercury must be in retrograde!"
      );
    } finally {
      setHoroscopeLoading(false);
    }
  }, []);

  // Start the quiz
  const startQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setDeterminedSign(null);
    setQuizComplete(false);
    setCaptchaData(null);
    setCaptchaAnswer("");
    setCaptchaSuccess(false);
    setCaptchaMessage("");
    setHoroscope(null);
    setHoroscopeVisible(false);
    setCaptchaError(null);
    setHoroscopeError(null);
  };

  // Handle selecting an answer
  const selectAnswer = (answerValue: number) => {
    const newAnswers = [...answers, answerValue];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete, determine sign
      const signIndex = determineZodiacSign(newAnswers);
      const sign = zodiacSigns[signIndex].sign;
      setDeterminedSign(sign);
      setQuizComplete(true);

      // Fetch CAPTCHA for this sign
      fetchCaptcha(sign);
    }
  };

  // Validate CAPTCHA answer
  const validateCaptcha = async () => {
    if (!captchaData?.token) return;
    try {
      setCaptchaLoading(true);
      setCaptchaError(null);

      const response = await fetch("/api/horoscope/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAnswer: captchaAnswer,
          token: captchaData.token,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to validate CAPTCHA: ${response.status} ${errorText}`
        );
      }

      const data: ValidateResponse = await response.json();
      setCaptchaSuccess(data.success);
      setCaptchaMessage(data.message);

      if (data.success) {
        // If successful, fetch the full horoscope
        fetchHoroscope(determinedSign);
      } else {
        // For failed validation, we'll just show the error message
        // We won't fetch a new CAPTCHA immediately - let user try again with the same one
        // The token will eventually expire after 3 attempts (as configured in the API)
      }
    } catch (error) {
      console.error("Captcha validation error:", error);
      setCaptchaError(
        "The cosmic forces rejected your answer. Please try again."
      );
      // Do not fetch a new CAPTCHA on error - let user retry with the same one
    } finally {
      setCaptchaLoading(false);
    }
  };

  // Format the captcha instruction with highlighted references to the horoscope
  const formatCaptchaInstruction = (
    instruction: string,
    horoscopeText: string
  ): React.ReactNode => {
    if (!instruction || !horoscopeText) return instruction;

    // Find words from the horoscope mentioned in the instruction
    // Split by space or punctuation, filter out short words and duplicates
    const horoscopeWords = [
      ...new Set(
        horoscopeText
          .split(/\s+|[.,!?;:'"()]/g)
          .filter((word) => word.length > 3)
      ),
    ];

    const nodes: React.ReactNode[] = [];

    // Use reduce to build the nodes array safely without dangerouslySetInnerHTML
    const processedText = instruction
      .split(/(\b(?:${horoscopeWords.join('|')})\b)/gi)
      .filter(Boolean); // Filter out empty strings from split

    processedText.forEach((part, index) => {
      const isMatch = horoscopeWords.some((word) =>
        new RegExp(`^${word}$`, "i").test(part)
      );
      if (isMatch) {
        nodes.push(
          <span
            key={`match-${part}-${Math.random()}`}
            className="font-bold text-purple-500 dark:text-purple-300"
          >
            {part}
          </span>
        );
      } else {
        nodes.push(
          <React.Fragment key={`text-${part}-${Math.random()}`}>
            {part}
          </React.Fragment>
        );
      }
    });

    return nodes;
  };

  // Random warning icons (reused from other widgets)
  const warningIcons = ["⚠️", "🚨", "⛔", "🆘", "‼️"];
  const randomWarning = () =>
    warningIcons[Math.floor(Math.random() * warningIcons.length)];

  // Render functions for different states
  const renderStartScreen = () => (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-6 text-purple-600 dark:text-purple-400">
        Unlock Your Cosmic Horoscope
      </h2>
      <p className="mb-8 text-gray-700 dark:text-gray-300">
        Discover what the stars have pessimistically prepared for your future
        through our scientifically dubious personality assessment.
      </p>
      <button
        type="button"
        onClick={startQuiz}
        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
      >
        Begin Cosmic Personality Quiz
      </button>
    </div>
  );

  const renderQuizQuestion = () => (
    <div className="py-6">
      <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center">
        Question {currentQuestion + 1} of {quizQuestions.length}
      </div>
      <h3 className="text-xl font-bold mb-6 text-center text-purple-600 dark:text-purple-400">
        {quizQuestions[currentQuestion].question}
      </h3>
      <div className="grid gap-4 max-w-md mx-auto">
        {quizQuestions[currentQuestion].options.map((option, index) => (
          <button
            type="button"
            // Use a more stable key if option.text is unique per question
            key={`${currentQuestion}-${option.value}-${option.text.slice(
              0,
              5
            )}`}
            onClick={() => selectAnswer(option.value)}
            className="p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSignReveal = () => {
    if (!determinedSign) return null;

    const signData = zodiacSigns.find((s) => s.sign === determinedSign);
    if (!signData) return null;

    return (
      <div className="py-6 text-center">
        <div className="mb-4 text-6xl">{signData.emoji}</div>
        <h3 className="text-2xl font-bold mb-2 text-purple-600 dark:text-purple-400">
          {signData.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-1">
          {signData.dates}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Element: {signData.element} • Ruling Planet: {signData.planet}
        </p>
        <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-6 max-w-md mx-auto">
          <p className="text-sm italic">
            Through rigorous cosmic analysis, our algorithm has determined you
            are a <span className="font-bold">{signData.name}</span>!
          </p>
          <p className="text-sm mt-2 italic">
            Prepare for your astrologically-aligned verification challenge.
          </p>
        </div>
      </div>
    );
  };

  const renderCaptcha = () => {
    if (captchaLoading && !captchaData) {
      // Show loading only on initial captcha fetch
      return (
        <div className="py-6 text-center">
          <p className="animate-pulse">Consulting the astral plane...</p>
        </div>
      );
    }

    if (captchaError && !captchaData) {
      // Show error only if captcha never loaded
      return (
        <div className="py-6 text-center">
          <p className="text-red-500">{captchaError}</p>
          <button
            type="button"
            onClick={() => {
              if (determinedSign) {
                fetchCaptcha(determinedSign);
              }
            }} // Check determinedSign before calling
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!captchaData) return null; // Don't render if no data yet and not loading/error

    if (captchaSuccess) {
      // Don't show CAPTCHA form if validation succeeded
      return (
        <div className="py-6 text-center">
          <p className="text-green-600 dark:text-green-400 font-bold">
            {captchaMessage}
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
            Congratulations on solving our purposely dumb CAPTCHA! 
            Your equally dumb horoscope is being calculated...
          </p>
          {horoscopeLoading && (
            <p className="mt-4 animate-pulse">
              Decoding your cosmic destiny...
            </p>
          )}
        </div>
      );
    }

    // Format the horoscope text for display in the CAPTCHA box
    const formattedCaptchaDisplayInstruction = formatCaptchaInstruction(
      captchaData.instruction,
      captchaData.horoscope
    );

    return (
      <div className="py-6 max-w-xl mx-auto">
        <h3 className="text-xl font-bold mb-2 text-center text-purple-600 dark:text-purple-400">
          {randomWarning()} Astrological Verification Required {randomWarning()}
        </h3>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-sm mb-2 text-yellow-800 dark:text-yellow-200">
            Your Personal Daily{" "}
            {captchaData.sign.charAt(0).toUpperCase() +
              captchaData.sign.slice(1)}{" "}
            Horoscope Preview:
          </h4>
          <p className="text-sm italic">{captchaData.horoscope}</p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-4">
          <p className="font-bold text-sm mb-2">CAPTCHA Challenge:</p>
          <p className="text-sm">{formattedCaptchaDisplayInstruction}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            validateCaptcha();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={captchaAnswer}
            onChange={(e) => setCaptchaAnswer(e.target.value)}
            placeholder="Your cosmic answer..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
            aria-label="CAPTCHA Answer"
            disabled={captchaLoading}
          />
          <button
            type="submit"
            disabled={captchaLoading || !captchaAnswer}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {captchaLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        {captchaMessage && !captchaSuccess && (
          <p className="mt-2 text-red-500 text-sm text-center">
            {captchaMessage}
          </p>
        )}
        {captchaError && (
          <p className="mt-2 text-red-500 text-sm text-center">
            {captchaError}
          </p>
        )}
      </div>
    );
  };

  const renderHoroscope = () => {
    if (!horoscope || !horoscopeVisible) return null;

    if (horoscopeLoading) {
      return (
        <div className="py-6 text-center">
          <p className="animate-pulse">Decoding your cosmic destiny...</p>
        </div>
      );
    }

    if (horoscopeError) {
      return (
        <div className="py-6 text-center">
          <p className="text-red-500">{horoscopeError}</p>
          <button
            type="button"
            onClick={startQuiz} // Allow restarting if horoscope fetch fails
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      );
    }

    return (
      <div className="py-6 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center text-purple-600 dark:text-purple-400">
          Your Cosmic Destiny Revealed
        </h3>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-xl font-bold">
                {horoscope.sign.charAt(0).toUpperCase() +
                  horoscope.sign.slice(1)}{" "}
                Horoscope
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(horoscope.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-4xl">
              {zodiacSigns.find((s) => s.sign === horoscope.sign)?.emoji ||
                "♈"}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="prose dark:prose-invert max-w-none">
              {horoscope.horoscope
                .split("\n\n")
                .map((paragraph: string, i: number) => (
                  <p
                    key={`horoscope-p-${paragraph.slice(0, 10)}-${i}`}
                    className="mb-3"
                  >
                    {paragraph}
                  </p> // More stable key
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h5 className="font-bold mb-2">Cosmic Power Level</h5>
              <div className="flex items-center gap-2">
                <div
                  className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="h-full bg-purple-600 dark:bg-purple-400 rounded-full"
                    style={{ width: `${horoscope.cosmicPower * 10}%` }}
                  />
                </div>
                <span className="text-sm font-mono">
                  {horoscope.cosmicPower}/10
                </span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h5 className="font-bold mb-2">Lucky Elements</h5>
              <ul className="text-sm space-y-1">
                <li>
                  <span className="font-bold">Color:</span>{" "}
                  {horoscope.luckyColor}
                </li>
                <li>
                  <span className="font-bold">Number:</span>{" "}
                  {horoscope.luckyNumber}
                </li>
                <li>
                  <span className="font-bold">Emoji:</span>{" "}
                  {horoscope.luckyEmoji}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h5 className="font-bold mb-2">Avoid At All Costs Today</h5>
            <p className="text-sm italic">{horoscope.unluckyScenario}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-bold mb-2">Compatible Signs</h5>
              <div className="flex gap-2 flex-wrap">
                {horoscope.compatibleSigns.map((sign: string) => {
                  const signData = zodiacSigns.find((s) => s.sign === sign);
                  return (
                    <div
                      key={`comp-${sign}`}
                      className="bg-green-50 dark:bg-green-900/20 p-2 rounded flex items-center gap-1 text-xs"
                    >
                      <span>{signData?.emoji}</span>
                      <span>{signData?.name ?? sign}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h5 className="font-bold mb-2">Incompatible Signs</h5>
              <div className="flex gap-2 flex-wrap">
                {horoscope.incompatibleSigns.map((sign: string) => {
                  const signData = zodiacSigns.find((s) => s.sign === sign);
                  return (
                    <div
                      key={`incomp-${sign}`}
                      className="bg-red-50 dark:bg-red-900/20 p-2 rounded flex items-center gap-1 text-xs"
                    >
                      <span>{signData?.emoji}</span>
                      <span>{signData?.name ?? sign}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={startQuiz}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  };

  // Main render logic
  return (
    <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h1 className="text-4xl font-bold text-center text-purple-600 dark:text-purple-400 mb-6">
        World's Dumbest Horoscopes
      </h1>

      {currentQuestion === -1 && !quizComplete && renderStartScreen()}
      {currentQuestion >= 0 && !quizComplete && renderQuizQuestion()}
      {quizComplete && !horoscopeVisible && (
        <>
          {renderSignReveal()}
          {renderCaptcha()}
        </>
      )}
      {horoscopeVisible && renderHoroscope()}
    </div>
  );
}
