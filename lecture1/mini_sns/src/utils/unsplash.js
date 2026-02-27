const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = 'https://api.unsplash.com';

/**
 * Unsplash API로 랜덤 사진을 가져옵니다.
 * API 키가 없으면 picsum.photos 폴백 사용
 *
 * @param {number} count - 가져올 사진 수 [Optional, 기본값: 9]
 * @param {string} query - 검색 키워드 [Optional, 기본값: 'pet']
 * @returns {Promise<Array>} 사진 배열
 */
export const fetchRandomPhotos = async (count = 9, query = 'pet') => {
  if (!UNSPLASH_ACCESS_KEY) {
    return Array.from({ length: count }, (_, i) => ({
      id: `picsum-${Date.now()}-${i}`,
      urls: {
        regular: `https://picsum.photos/seed/${Date.now() + i}/600/600`,
        thumb: `https://picsum.photos/seed/${Date.now() + i}/300/300`,
      },
      user: { name: 'Picsum' },
    }));
  }

  const response = await fetch(
    `${UNSPLASH_API_URL}/photos/random?count=${count}&query=${query}`,
    { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
  );

  if (!response.ok) throw new Error('Unsplash API 오류');
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
};
