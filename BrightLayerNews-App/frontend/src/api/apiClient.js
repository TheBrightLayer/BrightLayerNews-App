// frontend/src/api/apiClient.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEV_PORT = 5000;

function getBaseHost() {
  if (typeof process !== 'undefined' && process.env && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  if (Platform.OS === 'web') return `http://localhost:${DEV_PORT}`;
  if (Platform.OS === 'android') return `http://10.0.2.2:${DEV_PORT}`;
  return `http://localhost:${DEV_PORT}`;
}

export const BASE_HOST = getBaseHost();
export const BASE = `${BASE_HOST}/api`;

// Core fetch wrapper
async function safeFetch(url, opts = {}) {
  const finalOpts = Object.assign({ credentials: 'same-origin' }, opts);

  // attach JWT token if available
  const token = await AsyncStorage.getItem('token');
  if (token) {
    finalOpts.headers = finalOpts.headers || {};
    finalOpts.headers['Authorization'] = `Bearer ${token}`;
  }

  if (!finalOpts.method || finalOpts.method.toUpperCase() === 'GET') {
    finalOpts.cache = finalOpts.cache || 'no-store';
  }

  const res = await fetch(url, finalOpts);

  if (res.status === 204 || res.status === 304) {
    return null;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const err = new Error(`Request failed ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }

  const text = await res.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

// helpers that accept a path starting with a leading slash like '/auth/login'
export async function get(path, qs = {}) {
  const qsString =
    qs && Object.keys(qs).length
      ? '?' +
        Object.entries(qs)
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')
      : '';
  const url = `${BASE}${path}${qsString}`;
  return safeFetch(url, { method: 'GET' });
}

export async function post(path, body = {}) {
  return safeFetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function put(path, body = {}) {
  return safeFetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function del(path) {
  return safeFetch(`${BASE}${path}`, {
    method: 'DELETE',
  });
}

// default export to be compatible with older style imports
export default {
  get,
  post,
  put,
  del,
  BASE,
};
