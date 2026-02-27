import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/common/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import WritePostPage from './pages/WritePostPage';

/**
 * App 컴포넌트
 * 전체 라우팅 및 레이아웃 구성
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename='/my-community'>
        <Box sx={ { width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' } }>
          <Routes>
            {/* 헤더 없는 페이지 */}
            <Route path='/login' element={ <LoginPage /> } />
            <Route path='/register' element={ <RegisterPage /> } />

            {/* 헤더 있는 페이지 */}
            <Route
              path='/*'
              element={
                <>
                  <Header />
                  <Box sx={ { flex: 1 } }>
                    <Routes>
                      <Route path='/' element={ <PostListPage /> } />
                      <Route path='/posts/:id' element={ <PostDetailPage /> } />
                      <Route path='/write' element={ <WritePostPage /> } />
                    </Routes>
                  </Box>
                </>
              }
            />
          </Routes>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
