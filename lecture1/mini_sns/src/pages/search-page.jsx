import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import BottomNav from '../components/common/bottom-nav';
import { supabase } from '../utils/supabase';

/**
 * 검색 페이지
 * 게시글 캡션을 검색합니다.
 *
 * Props: 없음
 */
function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    if (!value.trim()) { setResults([]); setSearched(false); return; }

    setLoading(true);
    try {
      const { data } = await supabase
        .from('sns_posts')
        .select('*, sns_users(username, display_name)')
        .ilike('caption', `%${value}%`)
        .order('created_at', { ascending: false })
        .limit(20);
      setResults(data || []);
      setSearched(true);
    } catch (err) {
      console.error('검색 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 9 }}>
      {/* 검색 앱바 */}
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
        <Toolbar sx={{ gap: 1 }}>
          <SearchIcon sx={{ color: 'text.secondary' }} />
          <InputBase
            value={query}
            onChange={handleSearch}
            placeholder='게시글 검색...'
            fullWidth
            autoFocus
            sx={{ fontSize: '1rem', color: 'text.primary' }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ pt: 8 }}>
        { loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) }

        { !loading && searched && results.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
            <Typography>검색 결과가 없습니다.</Typography>
          </Box>
        ) }

        { !loading && results.length > 0 && (
          <Grid container spacing={0.5}>
            { results.map((post) => (
              <Grid size={{ xs: 4 }} key={post.id}>
                <Box
                  onClick={() => navigate(`/post/${post.id}`)}
                  component='img'
                  src={post.image_url}
                  alt={post.caption}
                  sx={{
                    width: '100%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    display: 'block',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.85 },
                  }}
                />
              </Grid>
            )) }
          </Grid>
        ) }

        { !searched && !loading && (
          <Box sx={{ textAlign: 'center', mt: 8, color: 'text.secondary' }}>
            <SearchIcon sx={{ fontSize: 64, opacity: 0.3, mb: 1 }} />
            <Typography>검색어를 입력하세요</Typography>
          </Box>
        ) }
      </Box>

      <BottomNav />
    </Box>
  );
}

export default SearchPage;
