import { API_URL } from '../config/api';

export function getImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  try {
    const s = String(pathOrUrl);
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    // normalize windows backslashes and strip leading "public/"
    const normalized = s.replace(/public[\\\/]/g, '').replace(/\\/g, '/');
    return `${API_URL}/${normalized}`;
  } catch (e) {
    return null;
  }
}

export default getImageUrl;
