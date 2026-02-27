import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PetsIcon from '@mui/icons-material/Pets';
import BottomNav from '../components/common/bottom-nav';
import PostCard from '../components/common/post-card';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/use-auth';

/**
 * 홈 페이지 (피드)
 * 전체 게시글을 최신순으로 보여줍니다.
 *
 * Props: 없음
 */
function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedPostIds, setLikedPostIds] = useState(new Set());
  const [commentCounts, setCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      // 1단계: 게시글 목록 가져오기
      const { data: postsData, error } = await supabase
        .from('sns_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // 2단계: 작성자 정보 별도 쿼리 (PostgREST 관계 캐시 의존 방지)
      const userIds = [...new Set(postsData.map((p) => p.user_id))];
      const { data: usersData } = await supabase
        .from('sns_users')
        .select('id, username, display_name, avatar_url')
        .in('id', userIds);

      const usersMap = {};
      usersData?.forEach((u) => { usersMap[u.id] = u; });

      const postsWithUsers = postsData.map((p) => ({
        ...p,
        sns_users: usersMap[p.user_id] || null,
      }));

      setPosts(postsWithUsers);
      await fetchCommentCounts(postsData.map((p) => p.id));
      await fetchLikedPosts(postsData.map((p) => p.id));
    } catch (err) {
      console.error('피드 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedPosts = async (postIds) => {
    if (!user || postIds.length === 0) return;
    const { data } = await supabase
      .from('sns_likes')
      .select('post_id')
      .eq('user_id', user.id)
      .in('post_id', postIds);
    if (data) setLikedPostIds(new Set(data.map((l) => l.post_id)));
  };

  const fetchCommentCounts = async (postIds) => {
    if (postIds.length === 0) return;
    const { data } = await supabase
      .from('sns_comments')
      .select('post_id')
      .in('post_id', postIds);
    if (data) {
      const counts = {};
      data.forEach(({ post_id }) => {
        counts[post_id] = (counts[post_id] || 0) + 1;
      });
      setCommentCounts(counts);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box sx={{ pb: 8, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 상단 앱바 */}
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'primary.light',
          maxWidth: 480,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
        }}
      >
        <Toolbar>
          <PetsIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant='h6' sx={{ color: 'primary.dark', fontWeight: 700 }}>
            abc
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 피드 콘텐츠 */}
      <Box sx={{ pt: 8, px: 1.5 }}>
        { loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
            <PetsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography>아직 게시글이 없어요.</Typography>
            <Typography variant='body2'>첫 게시글을 올려보세요! 🐾</Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={likedPostIds.has(post.id)}
              commentCount={commentCounts[post.id] || 0}
            />
          ))
        ) }
      </Box>

      <BottomNav />
    </Box>
  );
}

export default HomePage;
