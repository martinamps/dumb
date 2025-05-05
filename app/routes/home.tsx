import type { Route } from "./+types/home";
import { useState, useEffect } from "react";
import { MainContent } from "../components/MainContent";
import { RightPanel } from "../components/RightPanel";

export function meta(args: Route.MetaArgs) {
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

export default function Home({ loaderData }: Route.ComponentProps) {
  // Client-side emojis to avoid hydration mismatch
  const [emojis, setEmojis] = useState<React.ReactNode[]>([]);
  
  // Use useEffect to generate emojis only on the client side
  useEffect(() => {
    const emojiList = ['🤪', '💩', '🙃', '🤡', '👽', '🤖', '👾', '🤯', '🧠', '👁️', '🔥', '⭐', '💫', '🌈'];
    const floatingEmojis = [];
    
    for (let i = 0; i < 20; i++) {
      const style = {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${3 + Math.random() * 7}s`,
        animationDelay: `${Math.random() * 5}s`
      };
      
      floatingEmojis.push(
        <div 
          key={`emoji-${i}`} 
          className="floating-emoji" 
          style={style}
        >
          {emojiList[Math.floor(Math.random() * emojiList.length)]}
        </div>
      );
    }
    
    setEmojis(floatingEmojis);
  }, []);

  return (
    <div className="dumb-body min-h-screen p-2 sm:p-4 md:p-8 flex flex-col">
      <div className="dumb-emoji-background">
        {emojis}
      </div>
      
      <div className="w-full mx-auto flex flex-col md:flex-row gap-3 md:gap-6 max-w-[95vw] md:max-w-6xl flex-grow">
        <MainContent />
        <div className="hidden md:block">
          <RightPanel />
        </div>
      </div>
      
      {/* Footer with poop emoji - Now at the very bottom of the page */}
      <div className="w-full mt-12 text-center p-4 border-t-4 border-dashed border-yellow-400">
        <a
          href="https://x.com/martinamps"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200 dumb-text"
          style={{
            fontSize: "clamp(0.9rem, 3.5vw, 1.1rem)",
            textShadow: "1px 1px 0 black",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            padding: "6px 12px",
            borderRadius: "20px",
            fontWeight: "bold",
          }}
        >
          Built with{" "}
          <span className="mx-1 text-brown-400" style={{ fontSize: "1.2em" }}>
            💩
          </span>{" "}
          by @martinamps
        </a>
      </div>
    </div>
  );
}
