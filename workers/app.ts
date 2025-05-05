import { createRequestHandler } from "react-router";
// import * as fs from "node:fs";
// import * as path from "node:path";
import {
  handleHaikuRequest,
  handleWeatherRequest,
  handleStockRequest,
  handleGetCaptchaRequest,
  handleValidateCaptchaRequest,
  handleGetHoroscopeRequest,
} from "./api";
import { handleDumbLandingRequest } from "./dumbLanding";

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
      // Use the imported handler for the dumb landing page
      if (url.pathname === "/dumb_domain.html" || url.pathname === "/") {
        // If there's an ASSETS binding, prioritize that for other assets potentially hosted
        // on the same domain, but serve the hardcoded HTML for the root/specific path.
        // Note: This logic might need adjustment if other static assets are expected
        // to be served from the root path besides the HTML.
        // For now, assume root path "/" and "/dumb_domain.html" are specifically for the landing page.
        // if (env.ASSETS) {
        //   return env.ASSETS.fetch(request);
        // }

        return handleDumbLandingRequest();

        // Remove the old filesystem reading logic
        /*
        try {
          const filePath = path.join(
            process.cwd(),
            "public",
            "dumb_domain.html"
          );
          const htmlContent = fs.readFileSync(filePath, "utf8");

          return new Response(htmlContent, {
            headers: {
              "Content-Type": "text/html;charset=UTF-8",
            },
          });
        } catch (error) {
          console.error("Error reading dumb_domain.html:", error);

          // Fallback to a simple placeholder if file reading fails
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
        */
      }
      // If it's the correct hostname but not the root path or dumb_domain.html,
      // let ASSETS handle it if the binding exists.
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      // Otherwise (no ASSETS binding), requests to this hostname for non-root paths
      // will fall through to the API/React Router handlers below, or could return 404.
      // For now, allow fall-through.
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
