import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PetsIcon from '@mui/icons-material/Pets';
import { useAuth } from '../hooks/use-auth';

/**
 * 회원가입 페이지
 * 이메일, 사용자명, 이름, 비밀번호로 회원가입합니다.
 *
 * Props: 없음
 */
function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    email: '',
    username: '',
    displayName: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (form.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(form.username)) {
      setError('사용자명은 영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다.');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: form.email,
        password: form.password,
        username: form.username,
        displayName: form.displayName,
      });
      setSuccess(true);
    } catch (err) {
      if (err.message?.includes('unique')) {
        setError('이미 사용 중인 사용자명 또는 이메일입니다.');
      } else {
        setError(err.message || '회원가입에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default' }}>
        <Container maxWidth='sm' sx={{ py: 4, textAlign: 'center' }}>
          <PetsIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant='h5' sx={{ fontWeight: 700, mb: 1 }}>회원가입 완료! 🎉</Typography>
          <Typography color='text.secondary' sx={{ mb: 3 }}>
            이메일 인증 후 로그인해 주세요.
          </Typography>
          <Button variant='contained' fullWidth onClick={() => navigate('/login')}>
            로그인하러 가기
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 상단 뒤로가기 */}
      <Box sx={{ p: 1 }}>
        <IconButton onClick={() => navigate('/login')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth='sm' sx={{ pb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PetsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          <Typography variant='h5' sx={{ fontWeight: 700, color: 'primary.dark', mt: 1 }}>
            회원가입
          </Typography>
        </Box>

        <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          { error && <Alert severity='error'>{ error }</Alert> }

          <TextField
            name='email'
            label='이메일 (계정)'
            type='email'
            value={form.email}
            onChange={handleChange}
            required
            fullWidth
            autoComplete='email'
            sx={{ bgcolor: 'background.paper' }}
          />
          <TextField
            name='username'
            label='사용자명 (@아이디)'
            value={form.username}
            onChange={handleChange}
            required
            fullWidth
            helperText='영문 소문자, 숫자, _ 만 사용'
            sx={{ bgcolor: 'background.paper' }}
          />
          <TextField
            name='displayName'
            label='이름'
            value={form.displayName}
            onChange={handleChange}
            required
            fullWidth
            sx={{ bgcolor: 'background.paper' }}
          />
          <TextField
            name='password'
            label='비밀번호'
            type='password'
            value={form.password}
            onChange={handleChange}
            required
            fullWidth
            autoComplete='new-password'
            helperText='6자 이상'
            sx={{ bgcolor: 'background.paper' }}
          />
          <TextField
            name='passwordConfirm'
            label='비밀번호 확인'
            type='password'
            value={form.passwordConfirm}
            onChange={handleChange}
            required
            fullWidth
            autoComplete='new-password'
            sx={{ bgcolor: 'background.paper' }}
          />

          <Button
            type='submit'
            variant='contained'
            fullWidth
            disabled={loading}
            sx={{ mt: 1, py: 1.5, fontSize: '1rem' }}
          >
            { loading ? '처리 중...' : '회원가입' }
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default RegisterPage;
