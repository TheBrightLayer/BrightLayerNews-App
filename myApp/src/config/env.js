// src/config/env.js
import Constants from 'expo-constants';

// Handle both new (expoConfig) and old (manifest) ways Expo exposes `extra`
const extra =
  (Constants.expoConfig && Constants.expoConfig.extra) ||
  (Constants.manifest && Constants.manifest.extra) ||
  {};

export const WORLD_NEWS_API_KEY = extra.WORLD_NEWS_API_KEY ?? null;

// Optional: add other environment variables if you plan to use them later
export const NEWS_API_BASE = extra.NEWS_API_BASE ?? 'https://api.worldnewsapi.com/search-news';
export const APP_ENV = extra.APP_ENV ?? 'development';

// For debugging, uncomment the next line to log once on startup:
// console.log('Loaded environment:', extra);

export default {
  WORLD_NEWS_API_KEY,
  NEWS_API_BASE,
  APP_ENV,
};
