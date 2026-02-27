import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

/**
 * AuthProvider 컴포넌트
 * Supabase Auth 상태와 sns_users 프로필 정보를 관리합니다.
 *
 * Props:
 * @param {React.ReactNode} children - 자식 컴포넌트 [Required]
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId) => {
    try {
      const { data: existingProfile } = await supabase
        .from('sns_users')
        .select('*')
        .eq('id', userId)
        .single();

      if (existingProfile) {
        setProfile(existingProfile);
        return;
      }

      // 프로필 없으면 auth 메타데이터로 자동 생성 (이메일 인증 후 첫 로그인 시)
      const { data: { user } } = await supabase.auth.getUser();
      const meta = user?.user_metadata;
      if (meta?.username) {
        const { data: newProfile } = await supabase
          .from('sns_users')
          .insert({ id: userId, username: meta.username, display_name: meta.display_name || meta.username })
          .select()
          .single();
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('프로필 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 세션/프로필 로딩 전체에 대한 안전장치 타이머 (취소하지 않음)
    const fallbackTimer = setTimeout(() => setLoading(false), 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // 타이머를 취소하지 않음 - loadProfile이 멈출 경우 타이머가 동작
        loadProfile(session.user.id);
      } else {
        clearTimeout(fallbackTimer);
        setLoading(false);
      }
    }).catch(() => {
      clearTimeout(fallbackTimer);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
  }, []);

  /** 회원가입 */
  const register = async ({ email, password, username, displayName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName },
      },
    });
    if (error) throw error;
    // 프로필은 handle_new_user DB 트리거가 자동 생성하므로 별도 INSERT 불필요
    return data;
  };

  /** 로그인 */
  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  /** 로그아웃 */
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  /** 프로필 업데이트 */
  const updateProfile = async (updates) => {
    const { error } = await supabase
      .from('sns_users')
      .update(updates)
      .eq('id', user.id);
    if (error) throw error;
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, register, login, logout, updateProfile, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
