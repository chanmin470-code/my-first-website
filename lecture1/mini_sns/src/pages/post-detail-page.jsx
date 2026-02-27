import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SendIcon from '@mui/icons-material/Send';
import TopBar from '../components/common/top-bar';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/use-auth';

/**
 * 게시글 상세 페이지
 * 사진, 작성자 정보, 캡션, 좋아요, 댓글을 표시합니다.
 *
 * Props: 없음 (useParams로 id 가져옴)
 */
function PostDetailPage() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const commentInputRef = useRef(null);

  const fetchPost = async () => {
    try {
      const { data: postData } = await supabase
        .from('sns_posts')
        .select('*, sns_users(id, username, display_name, avatar_url)')
        .eq('id', id)
        .single();
      setPost(postData);
      setLikesCount(postData?.likes_count || 0);

      const { data: likeData } = await supabase
        .from('sns_likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', id)
        .single();
      setLiked(!!likeData);

      const { data: commentData } = await supabase
        .from('sns_comments')
        .select('*, sns_users(username, display_name, avatar_url)')
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      setComments(commentData || []);
    } catch (err) {
      console.error('게시글 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      if (liked) {
        await supabase.from('sns_likes').delete().eq('user_id', user.id).eq('post_id', id);
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase.from('sns_likes').insert({ user_id: user.id, post_id: id });
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('좋아요 오류:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await supabase.from('sns_comments').insert({
        user_id: user.id,
        post_id: Number(id),
        content: commentText.trim(),
      }).select('*, sns_users(username, display_name, avatar_url)').single();

      setComments((prev) => [...prev, data]);
      setCommentText('');
    } catch (err) {
      console.error('댓글 작성 오류:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    return `${Math.floor(hours / 24)}일 전`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography>게시글을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      <TopBar title='게시글' />

      <Box sx={{ pt: 8 }}>
        {/* 작성자 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, bgcolor: 'background.paper' }}>
          <Avatar src={post.sns_users?.avatar_url} sx={{ width: 40, height: 40, mr: 1.5, bgcolor: 'primary.light' }}>
            { post.sns_users?.display_name?.[0] }
          </Avatar>
          <Box>
            <Typography variant='subtitle2' sx={{ fontWeight: 600 }}>{ post.sns_users?.display_name }</Typography>
            <Typography variant='caption' color='text.secondary'>
              @{ post.sns_users?.username } · { formatTime(post.created_at) }
            </Typography>
          </Box>
        </Box>

        {/* 이미지 */}
        <Box
          component='img'
          src={post.image_url}
          alt='게시글 이미지'
          sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
        />

        {/* 좋아요 */}
        <Box sx={{ px: 1, py: 0.5, bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleLike} sx={{ color: liked ? 'error.main' : 'text.secondary' }}>
            { liked ? <FavoriteIcon /> : <FavoriteBorderIcon /> }
          </IconButton>
          <Typography variant='body2'>{ likesCount }</Typography>
        </Box>

        {/* 캡션 */}
        <Box sx={{ px: 2, py: 1, bgcolor: 'background.paper' }}>
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, mr: 0.5 }}>{ post.sns_users?.username }</Box>
            { post.caption }
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* 댓글 목록 */}
        <Box sx={{ px: 2, bgcolor: 'background.paper' }}>
          <Typography variant='subtitle2' sx={{ py: 1, color: 'text.secondary' }}>
            댓글 { comments.length }개
          </Typography>
          { comments.map((comment) => (
            <Box key={comment.id} sx={{ display: 'flex', mb: 2, gap: 1.5 }}>
              <Avatar
                src={comment.sns_users?.avatar_url}
                sx={{ width: 32, height: 32, flexShrink: 0, bgcolor: 'primary.light' }}
              >
                { comment.sns_users?.display_name?.[0] }
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant='caption' sx={{ fontWeight: 600 }}>
                    { comment.sns_users?.username }
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    { formatTime(comment.created_at) }
                  </Typography>
                </Box>
                <Typography variant='body2'>{ comment.content }</Typography>
              </Box>
            </Box>
          )) }
        </Box>
      </Box>

      {/* 댓글 입력란 (하단 고정) */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar src={profile?.avatar_url} sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
          { profile?.display_name?.[0] }
        </Avatar>
        <TextField
          inputRef={commentInputRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder='댓글 달기...'
          size='small'
          fullWidth
          onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 20 } }}
        />
        <IconButton
          onClick={handleCommentSubmit}
          disabled={!commentText.trim() || submitting}
          sx={{ color: 'primary.main' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default PostDetailPage;
