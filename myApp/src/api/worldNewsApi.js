// src/api/worldNewsApi.js
import { WORLD_NEWS_API_KEY } from '../config/env';

// Fetch news from World News API
// Accepts an optional `text` (search term) and `offset` for pagination
export async function fetchWorldNews({ text = 'technology', offset = 0 } = {}) {
  if (!WORLD_NEWS_API_KEY) throw new Error('WORLD_NEWS_API_KEY missing');

  const baseUrl = 'https://api.worldnewsapi.com/search-news';
  const url =
    `${baseUrl}?api-key=${encodeURIComponent(WORLD_NEWS_API_KEY)}` +
    `&text=${encodeURIComponent(text)}` +
    `&language=en` + // You can change or remove this if your API plan supports multiple languages
    `&offset=${encodeURIComponent(offset)}`;

  const res = await fetch(url);

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`World News API error: ${res.status} ${txt}`);
  }

  const json = await res.json();

  // The API returns { news: [...] } — normalize this into your app’s format
  return (json.news ?? []).map((item, i) => ({
  id: item.id ?? item.link ?? `${item.title}-${i}-${Date.now()}`,
  title: item.title,
  url: item.url ?? item.link,
  image: item.image,
  summary: item.text,
  source: item.source || 'WorldNews',
  publishedAt: item.publish_date,
  category: item.category || '',
}));
}
