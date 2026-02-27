-- =============================================
-- mini_sns 데이터베이스 마이그레이션 스크립트
-- Supabase Dashboard > SQL Editor 에서 실행
-- =============================================

-- sns_users 테이블 (Supabase Auth와 연동)
CREATE TABLE IF NOT EXISTS sns_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- sns_posts 테이블
CREATE TABLE IF NOT EXISTS sns_posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES sns_users(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  image_url TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- sns_comments 테이블
CREATE TABLE IF NOT EXISTS sns_comments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES sns_users(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES sns_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- sns_likes 테이블 (좋아요 중복 방지)
CREATE TABLE IF NOT EXISTS sns_likes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES sns_users(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES sns_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- RLS 활성화
ALTER TABLE sns_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sns_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sns_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sns_likes ENABLE ROW LEVEL SECURITY;

-- sns_users 정책
CREATE POLICY "공개 읽기" ON sns_users FOR SELECT USING (true);
CREATE POLICY "본인만 삽입" ON sns_users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "본인만 수정" ON sns_users FOR UPDATE USING (auth.uid() = id);

-- sns_posts 정책
CREATE POLICY "공개 읽기" ON sns_posts FOR SELECT USING (true);
CREATE POLICY "인증 사용자 작성" ON sns_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인만 삭제" ON sns_posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "likes_count 업데이트 허용" ON sns_posts FOR UPDATE USING (true);

-- sns_comments 정책
CREATE POLICY "공개 읽기" ON sns_comments FOR SELECT USING (true);
CREATE POLICY "인증 사용자 작성" ON sns_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인만 삭제" ON sns_comments FOR DELETE USING (auth.uid() = user_id);

-- sns_likes 정책
CREATE POLICY "공개 읽기" ON sns_likes FOR SELECT USING (true);
CREATE POLICY "인증 사용자 좋아요" ON sns_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "본인만 취소" ON sns_likes FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- 회원가입 시 sns_users 자동 생성 트리거
-- (이메일 인증 여부와 관계없이 동작)
-- =============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sns_users (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_on_auth_user_created ON auth.users;
CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- likes_count 자동 업데이트 트리거
-- =============================================
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE sns_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE sns_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_update_likes_count ON sns_likes;
CREATE TRIGGER trigger_update_likes_count
AFTER INSERT OR DELETE ON sns_likes
FOR EACH ROW EXECUTE FUNCTION update_likes_count();
