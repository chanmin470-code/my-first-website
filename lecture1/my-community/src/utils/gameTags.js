/** 지원하는 게임 태그 목록 */
export const GAME_TAGS = [
  { value: 'lol', label: 'League of Legends', color: '#C89B3C' },
  { value: 'valorant', label: 'Valorant', color: '#FF4655' },
  { value: 'lostark', label: 'Lost Ark', color: '#C3A050' },
  { value: 'diablo2', label: 'Diablo II', color: '#B22222' },
];

/**
 * 태그 값으로 태그 정보 조회
 * @param {string} value
 * @returns {{ value: string, label: string, color: string }}
 */
export const getTagInfo = (value) => {
  return GAME_TAGS.find((t) => t.value === value) || GAME_TAGS[0];
};
