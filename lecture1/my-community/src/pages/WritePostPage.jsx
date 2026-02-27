import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { GAME_TAGS } from '../utils/gameTags';

/**
 * WritePostPage 컴포넌트
 * 게시물 작성 페이지
 */
function WritePostPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [gameTag, setGameTag] = useState('lol');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          game_tag: gameTag,
          user_id: currentUser.id,
        });

      if (insertError) throw insertError;
      navigate('/');
    } catch {
      setError('게시물 작성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={ { width: '100%', minHeight: '100vh', backgroundColor: 'background.default', py: { xs: 3, md: 5 } } }>
      <Container maxWidth='md'>
        <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 3 } }>
          <ArrowBackIcon
            sx={ { cursor: 'pointer', color: 'text.secondary' } }
            onClick={ () => navigate('/') }
          />
          <Typography variant='h5' sx={ { fontWeight: 700 } }>
            글쓰기
          </Typography>
        </Box>

        <Card>
          <CardContent sx={ { p: { xs: 3, md: 4 } } }>
            {error && (
              <Alert severity='error' sx={ { mb: 2 } }>
                {error}
              </Alert>
            )}

            <Box component='form' onSubmit={ handleSubmit } sx={ { display: 'flex', flexDirection: 'column', gap: 2.5 } }>
              <FormControl fullWidth>
                <InputLabel>게임 태그</InputLabel>
                <Select
                  value={ gameTag }
                  label='게임 태그'
                  onChange={ (e) => setGameTag(e.target.value) }
                >
                  {GAME_TAGS.map((tag) => (
                    <MenuItem key={ tag.value } value={ tag.value }>
                      {tag.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label='제목'
                value={ title }
                onChange={ (e) => setTitle(e.target.value) }
                required
                fullWidth
                inputProps={ { maxLength: 100 } }
              />

              <TextField
                label='내용'
                value={ content }
                onChange={ (e) => setContent(e.target.value) }
                required
                fullWidth
                multiline
                rows={ 12 }
              />

              <Box sx={ { display: 'flex', gap: 2, justifyContent: 'flex-end' } }>
                <Button
                  variant='outlined'
                  color='inherit'
                  onClick={ () => navigate('/') }
                >
                  취소
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={ isLoading }
                >
                  {isLoading ? '게시 중...' : '게시하기'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default WritePostPage;
