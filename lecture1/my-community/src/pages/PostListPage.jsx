import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { GAME_TAGS } from '../utils/gameTags';
import GameTagChip from '../components/ui/GameTagChip';

/**
 * PostListPage 컴포넌트
 * 게시물 목록을 카드 형식으로 표시, 게임 태그 필터링
 */
function PostListPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState('all');
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    fetchPosts();
  }, [tagFilter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('posts')
        .select('*, users(name)')
        .order('created_at', { ascending: false });

      if (tagFilter !== 'all') {
        query = query.eq('game_tag', tagFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data || []);

      if (data && data.length > 0) {
        const postIds = data.map((p) => p.id);
        const { data: commentsData } = await supabase
          .from('comments')
          .select('post_id')
          .in('post_id', postIds);

        const counts = {};
        (commentsData || []).forEach((c) => {
          counts[c.post_id] = (counts[c.post_id] || 0) + 1;
        });
        setCommentCounts(counts);
      }
    } catch {
      /* empty */
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <Box sx={ { width: '100%', minHeight: '100vh', backgroundColor: 'background.default' } }>
      <Container maxWidth='lg' sx={ { py: { xs: 3, md: 5 } } }>
        {/* 헤더 영역 */}
        <Box sx={ { display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 } }>
          <Typography variant='h5' sx={ { fontWeight: 700, color: 'primary.main' } }>
            게시판
          </Typography>
          <Box sx={ { display: 'flex', gap: 2, alignItems: 'center' } }>
            <FormControl size='small' sx={ { minWidth: 160 } }>
              <InputLabel>게임 필터</InputLabel>
              <Select
                value={ tagFilter }
                label='게임 필터'
                onChange={ (e) => setTagFilter(e.target.value) }
              >
                <MenuItem value='all'>전체</MenuItem>
                {GAME_TAGS.map((tag) => (
                  <MenuItem key={ tag.value } value={ tag.value }>
                    {tag.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {currentUser && (
              <Button
                variant='contained'
                startIcon={ <EditIcon /> }
                onClick={ () => navigate('/write') }
              >
                글쓰기
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={ { mb: 3 } } />

        {/* 게시물 목록 */}
        {isLoading ? (
          <Box sx={ { display: 'flex', justifyContent: 'center', py: 10 } }>
            <CircularProgress color='primary' />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={ { textAlign: 'center', py: 10 } }>
            <Typography color='text.secondary'>게시물이 없습니다.</Typography>
          </Box>
        ) : (
          <Grid container spacing={ 2 }>
            {posts.map((post) => (
              <Grid size={ { xs: 12, md: 6 } } key={ post.id }>
                <Card sx={ { height: '100%' } }>
                  <CardActionArea onClick={ () => navigate(`/posts/${post.id}`) } sx={ { height: '100%' } }>
                    <CardContent sx={ { p: 3 } }>
                      {/* 태그 + 날짜 */}
                      <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 } }>
                        <GameTagChip tag={ post.game_tag } />
                        <Typography variant='caption' color='text.secondary'>
                          {formatDate(post.created_at)}
                        </Typography>
                      </Box>

                      {/* 제목 */}
                      <Typography
                        variant='h6'
                        sx={ {
                          fontWeight: 700,
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontSize: { xs: '0.95rem', md: '1.05rem' },
                        } }
                      >
                        {post.title}
                      </Typography>

                      {/* 내용 미리보기 */}
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={ {
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        } }
                      >
                        {post.content}
                      </Typography>

                      <Divider sx={ { mb: 1.5 } } />

                      {/* 작성자 + 좋아요/댓글 수 */}
                      <Box sx={ { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }>
                        <Typography variant='caption' color='text.secondary'>
                          {post.users?.name || '알 수 없음'}
                        </Typography>
                        <Box sx={ { display: 'flex', gap: 1.5 } }>
                          <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
                            <FavoriteIcon sx={ { fontSize: 14, color: '#ff4d6d' } } />
                            <Typography variant='caption' color='text.secondary'>
                              {post.likes_count || 0}
                            </Typography>
                          </Box>
                          <Box sx={ { display: 'flex', alignItems: 'center', gap: 0.5 } }>
                            <CommentIcon sx={ { fontSize: 14, color: 'primary.main' } } />
                            <Typography variant='caption' color='text.secondary'>
                              {commentCounts[post.id] || 0}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default PostListPage;
