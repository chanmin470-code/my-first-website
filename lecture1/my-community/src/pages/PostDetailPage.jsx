import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import GameTagChip from '../components/ui/GameTagChip';
import CommentSection from '../components/landing/CommentSection';

/**
 * PostDetailPage 컴포넌트
 * 게시물 상세 - 내용, 좋아요, 댓글/대댓글 표시
 */
function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  useEffect(() => {
    if (currentUser && post) {
      checkLiked();
    }
  }, [currentUser, post]);

  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*, users(name)')
        .eq('id', id)
        .single();

      if (error || !data) {
        navigate('/');
        return;
      }
      setPost(data);
    } catch {
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, users(name)')
      .eq('post_id', id)
      .order('created_at', { ascending: true });
    setComments(data || []);
  };

  const checkLiked = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', currentUser.id)
      .eq('post_id', id)
      .single();
    setIsLiked(!!data);
  };

  const handleLike = async () => {
    if (!currentUser || isLiking) return;
    setIsLiking(true);

    try {
      if (isLiked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', currentUser.id)
          .eq('post_id', id);
        setIsLiked(false);
        setPost((prev) => ({ ...prev, likes_count: prev.likes_count - 1 }));
      } else {
        await supabase.from('likes').insert({
          user_id: currentUser.id,
          post_id: Number(id),
        });
        setIsLiked(true);
        setPost((prev) => ({ ...prev, likes_count: prev.likes_count + 1 }));
      }
    } catch {
      /* empty */
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('게시물을 삭제하시겠습니까?')) return;
    await supabase.from('posts').delete().eq('id', id);
    navigate('/');
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box sx={ { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' } }>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  if (!post) return null;

  return (
    <Box sx={ { width: '100%', minHeight: '100vh', backgroundColor: 'background.default', py: { xs: 3, md: 5 } } }>
      <Container maxWidth='md'>
        {/* 뒤로가기 */}
        <Button
          startIcon={ <ArrowBackIcon /> }
          variant='text'
          color='inherit'
          onClick={ () => navigate('/') }
          sx={ { mb: 3, color: 'text.secondary' } }
        >
          목록으로
        </Button>

        {/* 게시물 헤더 */}
        <Box sx={ { mb: 3 } }>
          <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 } }>
            <GameTagChip tag={ post.game_tag } size='medium' />
            {currentUser?.id === post.user_id && (
              <IconButton color='error' size='small' onClick={ handleDelete }>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Typography variant='h4' sx={ { fontWeight: 700, mb: 1.5, fontSize: { xs: '1.5rem', md: '2rem' } } }>
            {post.title}
          </Typography>

          <Box sx={ { display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' } }>
            <Typography variant='body2' sx={ { color: 'primary.light', fontWeight: 600 } }>
              {post.users?.name || '알 수 없음'}
            </Typography>
            <Typography variant='caption' color='text.secondary'>
              {formatDate(post.created_at)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={ { mb: 3 } } />

        {/* 게시물 내용 */}
        <Box
          sx={ {
            minHeight: 200,
            mb: 4,
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            color: 'text.primary',
            fontSize: { xs: '0.95rem', md: '1rem' },
          } }
        >
          {post.content}
        </Box>

        {/* 좋아요 */}
        <Box sx={ { display: 'flex', justifyContent: 'center', mb: 4 } }>
          <Box
            sx={ {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 3,
              border: `1px solid ${isLiked ? '#ff4d6d' : 'rgba(255,255,255,0.1)'}`,
              cursor: currentUser ? 'pointer' : 'default',
              transition: 'all 0.2s',
              '&:hover': currentUser ? { borderColor: '#ff4d6d', boxShadow: '0 0 12px rgba(255, 77, 109, 0.3)' } : {},
            } }
            onClick={ handleLike }
          >
            {isLiked ? (
              <FavoriteIcon sx={ { color: '#ff4d6d', fontSize: 24 } } />
            ) : (
              <FavoriteBorderIcon sx={ { color: isLiking ? '#ff4d6d' : 'text.secondary', fontSize: 24 } } />
            )}
            <Typography variant='h6' sx={ { fontWeight: 700, color: isLiked ? '#ff4d6d' : 'text.secondary' } }>
              {post.likes_count || 0}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* 댓글 영역 */}
        <CommentSection
          comments={ comments }
          postId={ Number(id) }
          onRefresh={ fetchComments }
        />
      </Container>
    </Box>
  );
}

export default PostDetailPage;
