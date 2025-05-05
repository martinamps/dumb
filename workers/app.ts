import { createRequestHandler } from "react-router";
import {
  handleHaikuRequest,
  handleWeatherRequest,
  handleStockRequest,
  handleGetCaptchaRequest,
  handleValidateCaptchaRequest,
  handleGetHoroscopeRequest,
} from "./api";

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

    // Check if the request is coming from worldsdumbestdomain.com
    if (
      url.hostname === "worldsdumbestdomain.com" ||
      url.hostname === "www.worldsdumbestdomain.com"
    ) {
      // Instead of fetching the file from the same origin (which causes 522 errors),
      // directly return the dumb_domain.html content if it's specifically requested
      if (url.pathname === "/dumb_domain.html" || url.pathname === "/") {
        // If there's a binding for static assets, use that
        if (env.ASSETS) {
          return env.ASSETS.fetch(request);
        } else {
          // Return a simple placeholder if the asset isn't available
          return new Response(
            `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>World's Dumbest Domain</title>
              <style>
                body { font-family: sans-serif; text-align: center; padding: 50px; }
                h1 { color: #ff6b6b; }
              </style>
            </head>
            <body>
              <h1>World's Dumbest Domain</h1>
              <p>This is indeed the world's dumbest domain. Nothing to see here!</p>
              <p>Visit <a href="https://dumb.dev">dumb.dev</a> for the real content.</p>
            </body>
            </html>`,
            {
              headers: {
                "Content-Type": "text/html;charset=UTF-8",
              },
            }
          );
        }
      }
      
      // For all other paths under this domain, redirect to the main site
      return Response.redirect("https://dumb.dev", 302);
    }

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

    // Horoscope and CAPTCHA routes
    if (url.pathname === "/api/horoscope/captcha") {
      return handleGetCaptchaRequest(request, env);
    }

    if (url.pathname === "/api/horoscope/validate") {
      return handleValidateCaptchaRequest(request, env);
    }

    if (url.pathname === "/api/horoscope") {
      return handleGetHoroscopeRequest(request, env);
    }

    // All other requests are handled by React Router
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<Env>;