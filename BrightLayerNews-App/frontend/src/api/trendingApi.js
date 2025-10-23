// frontend/src/api/trendingApi.js
import { get } from "./apiClient";

export const fetchTrendingArticles = async () => {
  try {
    const res = await get("/trending/trending?limit=20&minViews=5&days=7");
    return res.data;
  } catch (err) {
    console.warn("Failed to fetch trending articles:", err);
    return [];
  }
};
