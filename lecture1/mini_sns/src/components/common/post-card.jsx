import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { supabase } from '../../utils/supabase';
import { useAuth } from '../../hooks/use-auth';

/**
 * 게시글 카드 컴포넌트
 * 피드에서 각 게시글을 표시합니다.
 *
 * Props:
 * @param {object} post - 게시글 데이터 [Required]
 * @param {boolean} isLiked - 현재 사용자의 좋아요 여부 [Optional, 기본값: false]
 * @param {function} onLikeToggle - 좋아요 토글 콜백 [Optional]
 * @param {number} commentCount - 댓글 수 [Optional, 기본값: 0]
 *
 * Example usage:
 * <PostCard post={post} isLiked={false} onLikeToggle={handleLike} />
 */
function PostCard({ post, isLiked = false, onLikeToggle, commentCount = 0 }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [liked, setLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user || loading) return;

    setLoading(true);
    try {
      if (liked) {
        await supabase.from('sns_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase.from('sns_likes').insert({ user_id: user.id, post_id: post.id });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      if (onLikeToggle) onLikeToggle(post.id, !liked);
    } catch (err) {
      console.error('좋아요 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 1.5,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'primary.light',
        cursor: 'pointer',
        '&:hover': { boxShadow: 2 },
      }}
      onClick={handleCardClick}
    >
      {/* 작성자 정보 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5 }}>
        <Avatar
          src={post.sns_users?.avatar_url || ''}
          sx={{ width: 36, height: 36, mr: 1.5, bgcolor: 'primary.light' }}
        >
          {post.sns_users?.display_name?.[0] || '?'}
        </Avatar>
        <Box>
          <Typography variant='subtitle2' sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
            { post.sns_users?.display_name || '사용자' }
          </Typography>
          <Typography variant='caption' color='text.secondary'>
            @{ post.sns_users?.username } · { formatTime(post.created_at) }
          </Typography>
        </Box>
      </Box>

      {/* 게시글 이미지 */}
      <CardMedia
        component='img'
        image={post.image_url}
        alt='게시글 이미지'
        sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
      />

      {/* 액션 버튼 */}
      <CardActions sx={{ px: 1, py: 0.5 }} onClick={(e) => e.stopPropagation()}>
        <IconButton onClick={handleLike} size='small' sx={{ color: liked ? 'error.main' : 'text.secondary' }}>
          { liked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
        </IconButton>
        <Typography variant='body2' sx={{ mr: 1.5 }}>{ likesCount }</Typography>
        <IconButton size='small' sx={{ color: 'text.secondary' }} onClick={handleCardClick}>
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant='body2'>{ commentCount }</Typography>
      </CardActions>

      {/* 캡션 */}
      <CardContent sx={{ pt: 0, pb: '12px !important' }}>
        <Typography variant='body2' color='text.primary'>
          <Box component='span' sx={{ fontWeight: 600, mr: 0.5 }}>
            { post.sns_users?.username }
          </Box>
          { post.caption }
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard;
