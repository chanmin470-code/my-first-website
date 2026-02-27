import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

/**
 * AuthProvider 컴포넌트
 * 로그인/로그아웃 상태를 전역으로 관리
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('gf_user');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  }, []);

  /** @param {object} user - users 테이블 row */
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('gf_user', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gf_user');
  };

  return (
    <AuthContext.Provider value={ { currentUser, login, logout } }>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth 훅
 * @returns {{ currentUser: object|null, login: function, logout: function }}
 */
export function useAuth() {
  return useContext(AuthContext);
}
