// simple API wrapper for future use. For now we return local data.
import articles from '../data/articles.js';

// Example async fetch wrapper (swap with real fetch / axios later)
export async function fetchArticles() {
  // simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(articles), 300);
  });
}

export async function fetchArticleById(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(articles.find(a => a.id === id)), 200);
  });
}
