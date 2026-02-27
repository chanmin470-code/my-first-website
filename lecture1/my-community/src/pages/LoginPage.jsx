import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';

/**
 * LoginPage 컴포넌트
 * 이메일/비밀번호로 로그인
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (dbError || !data) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      if (data.password_hash !== password) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      const { password_hash, ...safeUser } = data;
      login(safeUser);
      navigate('/');
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={ {
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at top, #0d1a2d 0%, #0a0e1a 60%)',
      } }
    >
      <Container maxWidth='sm'>
        <Box sx={ { textAlign: 'center', mb: 4 } }>
          <SportsEsportsIcon sx={ { fontSize: 48, color: 'primary.main', mb: 1 } } />
          <Typography
            variant='h4'
            sx={ {
              fontWeight: 700,
              background: 'linear-gradient(90deg, #00b4ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            } }
          >
            Game Friendship
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={ { mt: 0.5 } }>
            게이머들의 친목 공간
          </Typography>
        </Box>

        <Card>
          <CardContent sx={ { p: { xs: 3, md: 4 } } }>
            <Typography variant='h5' sx={ { mb: 3, fontWeight: 700 } }>
              로그인
            </Typography>

            {error && (
              <Alert severity='error' sx={ { mb: 2 } }>
                {error}
              </Alert>
            )}

            <Box component='form' onSubmit={ handleLogin } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
              <TextField
                label='이메일'
                type='email'
                value={ email }
                onChange={ (e) => setEmail(e.target.value) }
                required
                fullWidth
                autoComplete='email'
              />
              <TextField
                label='비밀번호'
                type='password'
                value={ password }
                onChange={ (e) => setPassword(e.target.value) }
                required
                fullWidth
                autoComplete='current-password'
              />
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={ isLoading }
                sx={ { mt: 1 } }
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </Box>

            <Divider sx={ { my: 3 } } />

            <Box sx={ { textAlign: 'center' } }>
              <Typography variant='body2' color='text.secondary'>
                계정이 없으신가요?{' '}
                <Box
                  component='span'
                  sx={ { color: 'primary.main', cursor: 'pointer', fontWeight: 600 } }
                  onClick={ () => navigate('/register') }
                >
                  회원가입
                </Box>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default LoginPage;
