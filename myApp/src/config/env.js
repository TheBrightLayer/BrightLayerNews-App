// src/config/env.js
import Constants from 'expo-constants';

const extra = (Constants.expoConfig && Constants.expoConfig.extra) || (Constants.manifest && Constants.manifest.extra) || {};

export const WORLD_NEWS_API_KEY = extra.WORLD_NEWS_API_KEY;
