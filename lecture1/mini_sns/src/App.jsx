import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { AuthProvider, useAuth } from './hooks/use-auth';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import HomePage from './pages/home-page';
import PostDetailPage from './pages/post-detail-page';
import CreatePostPage from './pages/create-post-page';
import MyPage from './pages/my-page';
import EditProfilePage from './pages/edit-profile-page';
import SearchPage from './pages/search-page';

/**
 * 로그인된 사용자만 접근 가능한 라우트
 *
 * Props:
 * @param {React.ReactNode} children - 보호할 컴포넌트 [Required]
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  if (!user) return <Navigate to='/login' replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress color='primary' />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' replace />} />
      <Route path='/register' element={!user ? <RegisterPage /> : <Navigate to='/' replace />} />
      <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path='/post/:id' element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
      <Route path='/create' element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
      <Route path='/search' element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path='/profile' element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
      <Route path='/profile/edit' element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Box className='app-container'>
          <AppRoutes />
        </Box>
      </AuthProvider>
    </HashRouter>
  );
}
