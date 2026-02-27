import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

/** 경로 → 네비게이션 인덱스 매핑 */
const pathToIndex = {
  '/': 0,
  '/create': 1,
  '/search': 2,
  '/profile': 3,
};

/**
 * 하단 네비게이션 바 컴포넌트
 * 화면 하단에 고정되어 홈, 글쓰기, 검색, 마이페이지 탭을 제공합니다.
 *
 * Props: 없음
 *
 * Example usage:
 * <BottomNav />
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const index = pathToIndex[location.pathname] ?? 0;
    setValue(index);
  }, [location.pathname]);

  const handleChange = (_event, newValue) => {
    setValue(newValue);
    const paths = ['/', '/create', '/search', '/profile'];
    navigate(paths[newValue]);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label='홈' icon={<HomeIcon />} />
        <BottomNavigationAction label='글쓰기' icon={<AddBoxIcon />} />
        <BottomNavigationAction label='검색' icon={<SearchIcon />} />
        <BottomNavigationAction label='마이페이지' icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
