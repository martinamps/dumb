import { createRequestHandler } from "react-router";
import { handleHaikuRequest, handleWeatherRequest, handleStockRequest } from "./api";

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

    // Route API requests to their respective handlers
    if (url.pathname === "/api/stocks") {
      return handleStockRequest(request, env);
    }

    if (url.pathname === "/api/weather") {
      return handleWeatherRequest(request, env);
    }

    if (url.pathname === "/api/haiku") {
      return handleHaikuRequest(request, env);
    }

    // All other requests are handled by React Router
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;