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
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <MainContent />
        <RightPanel />
      </div>
    </div>
  );
}
