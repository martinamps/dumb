// API routes index file
export { handleHaikuRequest } from './haiku';
export { handleWeatherRequest } from './weather';
export { handleStockRequest } from './stocks';
export { fetchStockPrice, fetchMultipleStockPrices, clearStockCache, getStockCache } from './stockCache';