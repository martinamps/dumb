import type { Route } from "./+types/home";
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
  // Create random floating emojis for the background
  const generateEmojis = () => {
    const emojis = ['🤪', '💩', '🙃', '🤡', '👽', '🤖', '👾', '🤯', '🧠', '👁️', '🔥', '⭐', '💫', '🌈'];
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
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </div>
      );
    }
    
    return floatingEmojis;
  };

  return (
    <div className="dumb-body min-h-screen p-4 md:p-8">
      <div className="dumb-emoji-background">
        {generateEmojis()}
      </div>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <MainContent />
        <RightPanel />
      </div>
    </div>
  );
}
