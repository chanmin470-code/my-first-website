import Chip from '@mui/material/Chip';
import { getTagInfo } from '../../utils/gameTags';

/**
 * GameTagChip 컴포넌트
 * 게임 태그를 색상 칩으로 표시
 *
 * Props:
 * @param {string} tag - 게임 태그 값 [Required]
 * @param {string} size - MUI Chip size [Optional, 기본값: 'small']
 *
 * Example usage:
 * <GameTagChip tag="lol" />
 */
function GameTagChip({ tag, size = 'small' }) {
  const tagInfo = getTagInfo(tag);

  return (
    <Chip
      label={ tagInfo.label }
      size={ size }
      sx={ {
        backgroundColor: `${tagInfo.color}22`,
        color: tagInfo.color,
        border: `1px solid ${tagInfo.color}66`,
        fontWeight: 600,
        fontSize: '0.7rem',
      } }
    />
  );
}

export default GameTagChip;
