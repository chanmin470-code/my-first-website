import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * 상단 앱바 컴포넌트 (세부 페이지용)
 * 뒤로가기 버튼과 제목, 오른쪽 액션을 포함합니다.
 *
 * Props:
 * @param {string} title - 앱바 제목 [Required]
 * @param {React.ReactNode} rightAction - 오른쪽 버튼/액션 [Optional]
 * @param {function} onBack - 뒤로가기 커스텀 핸들러 [Optional]
 *
 * Example usage:
 * <TopBar title='게시글' rightAction={<Button>저장</Button>} />
 */
function TopBar({ title, rightAction, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
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
        <IconButton edge='start' onClick={handleBack} sx={{ color: 'text.primary', mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant='h6'
          sx={{ flexGrow: 1, color: 'text.primary', fontSize: '1rem' }}
        >
          { title }
        </Typography>
        { rightAction }
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
