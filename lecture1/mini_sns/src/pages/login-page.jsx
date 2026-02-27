import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '../hooks/use-auth';

/**
 * 로그인 페이지
 * 이메일과 비밀번호로 로그인합니다.
 *
 * Props: 없음
 */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
      <Container maxWidth='sm' sx={{ py: 4 }}>
        {/* 로고 영역 */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <PetsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 1 }} />
          <Typography variant='h4' sx={{ fontWeight: 700, color: 'primary.dark' }}>
            abc
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.5 }}>
            반려동물 일상 공유 SNS
          </Typography>
        </Box>

        {/* 로그인 폼 */}
        <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          { error && <Alert severity='error'>{ error }</Alert> }

          <TextField
            name='email'
            label='이메일'
            type='email'
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete='email'
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />
          <TextField
            name='password'
            label='비밀번호'
            type='password'
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete='current-password'
            sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
          />

          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}
          >
            { loading ? '로그인 중...' : '로그인' }
          </Button>

          <Button
            variant='outlined'
            fullWidth
            onClick={() => navigate('/register')}
            sx={{ py: 1.5, fontSize: '1rem' }}
          >
            회원가입
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
