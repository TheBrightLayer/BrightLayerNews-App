// frontend/src/api/worldNewsApi.js
import { get } from './apiClient';

/** helpers **/
function normalizeUrl(u) {
  if (!u || typeof u !== 'string') return null;
  let url = u.trim();
  if (url.startsWith('//')) url = 'https:' + url;
  if (url.startsWith('http://')) url = url.replace(/^http:\/\//i, 'https://');
  return url;
}
function extractImageFromArticle(a) {
  if (!a) return null;
  const candidates = [
    a.image,
    a.leadImage,
    a.lead_image_url,
    a.leadImageUrl,
    a.lead_image,
    a.thumbnail,
    a.thumb,
    a.media && a.media.url,
    (a.enclosure && a.enclosure.url),
    (a.enclosures && Array.isArray(a.enclosures) && a.enclosures[0] && a.enclosures[0].url)
  ].filter(Boolean);
  if (candidates.length) return normalizeUrl(candidates[0]);

  if (a.raw) {
    const raw = a.raw;
    if (raw.enclosure && raw.enclosure.url) return normalizeUrl(raw.enclosure.url);
    if (raw['media:content'] && raw['media:content'].$ && raw['media:content'].$.url) return normalizeUrl(raw['media:content'].$.url);
    if (raw['media:thumbnail'] && raw['media:thumbnail'].$ && raw['media:thumbnail'].$.url) return normalizeUrl(raw['media:thumbnail'].$.url);
    if (raw['media:content'] && raw['media:content'].url) return normalizeUrl(raw['media:content'].url);
    if (raw.thumbnail && raw.thumbnail.url) return normalizeUrl(raw.thumbnail.url);
  }

  const htmlCandidates = [
    a.contentHtml,
    a.content,
    a.description,
    a.summary,
    (a.raw && a.raw['content:encoded']),
    (a.raw && a.raw.content)
  ];
  for (const h of htmlCandidates) {
    if (!h || typeof h !== 'string') continue;
    const m = h.match(/<img[^>]+src=(?:'|")([^'"]+)(?:'|")[^>]*>/i);
    if (m && m[1]) return normalizeUrl(m[1]);
  }
  return null;
}

function normalizeArticle(a) {
  if (!a) return null;
  const image = extractImageFromArticle(a);
  return {
    id: a._id || a.id || a.guid || a.link || a.url || a.title,
    title: a.title || a.headline || '',
    url: a.link || a.url || a['link'],
    image,
    summary: a.description || a.summary || (a.content ? String(a.content).slice(0, 300) : ''),
    source: a.source || 'Unknown',
    publishedAt: a.publishedAt || a.pubDate || a.publish_date || null,
    content: a.content || a.contentHtml || ''
  };
}

/** known categories we want to treat specially (force list+filter) **/
const KNOWN_CATEGORIES = ['technology', 'business', 'sports', 'health', 'entertainment'];

/**
 * fetchWorldNews
 * - if text empty -> list endpoint
 * - if text is a known category -> fetch a larger list and filter locally for that category
 * - otherwise -> call search endpoint
 */
export async function fetchWorldNews({ text = '', offset = 0, pageSize = 20 } = {}) {
  try {
    const pageNum = Math.floor(offset / pageSize) + 1;
    const q = (text || '').trim();
    let items = [];

    // 1) If empty -> list endpoint (normal)
    if (!q) {
      console.log('[worldNewsApi] list request page=', pageNum, 'pageSize=', pageSize);
      const res = await get('/articles', { limit: pageSize, page: pageNum });
      items = res?.data ?? res ?? [];
    } else {
      const lower = q.toLowerCase();

      // 2) If it's a known category, prefer list+filter
      if (KNOWN_CATEGORIES.includes(lower)) {
        console.log('[worldNewsApi] category requested -> list+filter for=', lower);
        // fetch large set and filter client-side
        const res = await get('/articles', { limit: 300, page: 1 });
        const listItems = res?.data ?? res ?? [];
        items = (Array.isArray(listItems) ? listItems : []).filter(it => {
          const hay = ((it.title || '') + ' ' + (it.description || '') + ' ' + (it.content || '')).toLowerCase();
          return hay.indexOf(lower) !== -1;
        });
        console.log('[worldNewsApi] category filtered count=', items.length);
      } else {
        // 3) general search (non-category text)
        console.log('[worldNewsApi] calling search with q=', q);
        const res = await get('/articles/search', { q });
        items = res?.data ?? res ?? [];
      }
    }

    return (Array.isArray(items) ? items : []).map(normalizeArticle).filter(Boolean);
  } catch (err) {
    console.warn('[worldNewsApi] fetchWorldNews error', err);
    throw err;
  }
}

export default fetchWorldNews;
