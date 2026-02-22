export function getImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  try {
    const s = String(pathOrUrl);
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    // normalize windows backslashes and strip leading "public/"
    const normalized = s.replace(/public[\\\/]/g, '').replace(/\\/g, '/');
    return `http://localhost:8000/${normalized}`;
  } catch (e) {
    return null;
  }
}

export default getImageUrl;
