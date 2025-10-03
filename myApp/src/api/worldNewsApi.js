// src/api/worldNewsApi.js
import { WORLD_NEWS_API_KEY } from '../config/env';

export async function fetchWorldNews({ text = 'technology', offset = 0 } = {}) {
  if (!WORLD_NEWS_API_KEY) throw new Error('WORLD_NEWS_API_KEY missing');
  const url =
    `https://api.worldnewsapi.com/search-news?` +
    `api-key=${encodeURIComponent(WORLD_NEWS_API_KEY)}` +
    `&text=${encodeURIComponent(text)}` +
    `&offset=${encodeURIComponent(offset)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`WorldNews API error: ${res.status} ${txt}`);
  }
  const json = await res.json();
  // adjust mapping depending on API response structure
  return (json?.news ?? []).map((it, i) => ({
    id: it.id ?? it.link ?? `${it.title}-${i}`,
    title: it.title,
    url: it.url ?? it.link,
    image: it.image,
    summary: it.text,
    source: it.source || 'WorldNews',
  }));
}
