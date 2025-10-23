// frontend/src/api/authApi.js
import { post, get } from './apiClient';

// signup expects { name, email, password }
export async function signup({ name, email, password }) {
  // returns parsed JSON from backend, e.g. { message, user }
  return await post('/auth/signup', { name, email, password });
}

export async function login(email, password) {
  return await post('/auth/login', { email, password });
}

export async function getProfile() {
  return await get('/auth/me');
}
