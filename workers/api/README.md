# API Routes

This directory contains modular API routes for the World's Dumbest Website.

## Structure

- `index.ts` - Exports all API route handlers
- `types.d.ts` - Shared type definitions for the API routes
- `haiku.ts` - Handles the Dumb Haiku generation API
- `weather.ts` - Handles the Dramatically Overreacted Weather API
- `stocks.ts` - Handles the Stock Market Emoji Translator API

## Adding New Routes

1. Create a new file for your route (e.g., `horoscope.ts`)
2. Add the type reference at the top: `/// <reference path="./types.d.ts" />`
3. Export a handler function with the signature: `export async function handleHoroscopeRequest(request: Request, env: Env): Promise<Response>`
4. Import your handler in `index.ts` and export it
5. Add your route to the router in `app.ts`

## Benefits of This Structure

- **Modularity**: Each API route is isolated in its own file
- **Maintainability**: Easier to understand and maintain individual features
- **Collaboration**: Multiple developers can work on different routes simultaneously
- **Organization**: Clear separation of concerns for different API endpoints