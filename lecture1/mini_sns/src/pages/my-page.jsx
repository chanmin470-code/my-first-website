import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import BottomNav from '../components/common/bottom-nav';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/use-auth';

/**
 * 마이페이지
 * 내 프로필, 게시물 목록을 표시합니다.
 *
 * Props: 없음
 */
function MyPage() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPosts = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('sns_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPosts(data || []);
    } catch (err) {
      console.error('내 게시글 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 9 }}>
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
          <Typography variant='h6' sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}>
            @{ profile?.username || '...' }
          </Typography>
          <IconButton onClick={handleLogout} sx={{ color: 'text.secondary' }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8 }}>
        {/* 프로필 섹션 */}
        <Box sx={{ bgcolor: 'background.paper', px: 3, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Avatar
              src={profile?.avatar_url || ''}
              sx={{ width: 80, height: 80, bgcolor: 'primary.light', fontSize: '2rem' }}
            >
              { profile?.display_name?.[0] || '?' }
            </Avatar>

            {/* 통계 */}
            <Box sx={{ display: 'flex', gap: 3, flex: 1, justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>{ posts.length }</Typography>
                <Typography variant='caption' color='text.secondary'>게시물</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>0</Typography>
                <Typography variant='caption' color='text.secondary'>팔로워</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant='h6' sx={{ fontWeight: 700 }}>0</Typography>
                <Typography variant='caption' color='text.secondary'>팔로잉</Typography>
              </Box>
            </Box>
          </Box>

          {/* 이름 & 소개 */}
          <Typography variant='subtitle1' sx={{ fontWeight: 600 }}>
            { profile?.display_name }
          </Typography>
          { profile?.bio && (
            <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
              { profile.bio }
            </Typography>
          ) }

          {/* 프로필 수정 버튼 */}
          <Button
            variant='outlined'
            startIcon={<EditIcon />}
            fullWidth
            onClick={() => navigate('/profile/edit')}
            sx={{ mt: 2 }}
          >
            프로필 수정
          </Button>
        </Box>

        {/* 게시물 격자 */}
        { loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
            <Typography>아직 게시글이 없어요.</Typography>
          </Box>
        ) : (
          <Grid container spacing={0.5} sx={{ mt: 0.5 }}>
            { posts.map((post) => (
              <Grid size={{ xs: 4 }} key={post.id}>
                <Box
                  onClick={() => navigate(`/post/${post.id}`)}
                  component='img'
                  src={post.image_url}
                  alt='내 게시글'
                  sx={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    display: 'block',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.8 },
                  }}
                />
              </Grid>
            )) }
          </Grid>
        ) }
      </Box>

      <BottomNav />
    </Box>
  );
}

export default MyPage;
