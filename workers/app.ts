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
      // Serve the static dumb_domain.html file
      return new Response(
        // The HTML content from public/dumb_domain.html will be included in your deployment
        await fetch(new Request(`${url.origin}/dumb_domain.html`)).then((res) =>
          res.text()
        ),
        {
          headers: {
            "Content-Type": "text/html;charset=UTF-8",
          },
        }
      );
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
