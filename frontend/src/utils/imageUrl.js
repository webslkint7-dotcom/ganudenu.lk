import API_URL from '../config';

/**
 * Resolves an image path to a full URL.
 * If the path starts with 'uploads/', it prepends the backend base origin.
 * Otherwise, it returns the path as is (for Base64 or external URLs).
 * @param {string} path - The image path or Base64 string.
 * @returns {string} - The resolved full URL.
 */
export const resolveImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=400';
  if (path.startsWith('uploads/')) {
    const origin = API_URL.replace('/api', '');
    return `${origin}/${path}`;
  }
  return path;
};
