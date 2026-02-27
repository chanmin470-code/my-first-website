import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

/**
 * Header 컴포넌트
 * 전체 페이지 공통 상단 네비게이션 바
 */
function Header() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position='sticky'>
      <Toolbar sx={ { maxWidth: 'lg', width: '100%', mx: 'auto' } }>
        <Box
          sx={ { display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, cursor: 'pointer' } }
          onClick={ () => navigate('/') }
        >
          <SportsEsportsIcon sx={ { color: 'primary.main', fontSize: 28 } } />
          <Typography
            variant='h6'
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

        <Box sx={ { display: 'flex', gap: 1, alignItems: 'center' } }>
          {currentUser ? (
            <>
              <Typography variant='body2' sx={ { color: 'text.secondary', mr: 1 } }>
                {currentUser.name}
              </Typography>
              <Button
                variant='outlined'
                size='small'
                color='primary'
                onClick={ () => navigate('/write') }
              >
                글쓰기
              </Button>
              <Button
                variant='text'
                size='small'
                color='inherit'
                onClick={ handleLogout }
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button
                variant='text'
                size='small'
                color='inherit'
                onClick={ () => navigate('/login') }
              >
                로그인
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={ () => navigate('/register') }
              >
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
