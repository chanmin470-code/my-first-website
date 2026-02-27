import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

/**
 * RegisterPage 컴포넌트
 * 새 계정 등록 (이름, 이메일, 비밀번호, 전화번호)
 */
function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleRegister = async (e) => {
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

    setIsLoading(true);

    try {
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', form.email.trim())
        .single();

      if (existing) {
        setError('이미 사용 중인 이메일입니다.');
        return;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert({
          name: form.name.trim(),
          email: form.email.trim(),
          password_hash: form.password,
          phone: form.phone.trim() || null,
        });

      if (insertError) throw insertError;

      navigate('/login');
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
    } catch {
      setError('회원가입 중 오류가 발생했습니다.');
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
        py: { xs: 4, md: 6 },
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
        </Box>

        <Card>
          <CardContent sx={ { p: { xs: 3, md: 4 } } }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1, mb: 3 } }>
              <ArrowBackIcon
                sx={ { cursor: 'pointer', color: 'text.secondary' } }
                onClick={ () => navigate('/login') }
              />
              <Typography variant='h5' sx={ { fontWeight: 700 } }>
                회원가입
              </Typography>
            </Box>

            {error && (
              <Alert severity='error' sx={ { mb: 2 } }>
                {error}
              </Alert>
            )}

            <Box component='form' onSubmit={ handleRegister } sx={ { display: 'flex', flexDirection: 'column', gap: 2 } }>
              <TextField
                label='이름 (닉네임)'
                value={ form.name }
                onChange={ handleChange('name') }
                required
                fullWidth
              />
              <TextField
                label='이메일'
                type='email'
                value={ form.email }
                onChange={ handleChange('email') }
                required
                fullWidth
              />
              <TextField
                label='비밀번호 (6자 이상)'
                type='password'
                value={ form.password }
                onChange={ handleChange('password') }
                required
                fullWidth
              />
              <TextField
                label='비밀번호 확인'
                type='password'
                value={ form.passwordConfirm }
                onChange={ handleChange('passwordConfirm') }
                required
                fullWidth
              />
              <TextField
                label='전화번호 (선택)'
                value={ form.phone }
                onChange={ handleChange('phone') }
                fullWidth
                placeholder='010-0000-0000'
              />
              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={ isLoading }
                sx={ { mt: 1 } }
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default RegisterPage;
