-- 初期データベース設定
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 検索用の拡張（全文検索）
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- 初期ブログデータ
INSERT INTO blogs (name, slug, description, domain, created_at, updated_at) 
VALUES 
  ('Tech Blog', 'tech-blog', 'プログラミングとテクノロジーについてのブログ', 'localhost:3000', NOW(), NOW()),
  ('Dev Notes', 'dev-notes', '開発メモとTips集', 'localhost:3000', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 初期管理者アカウント (パスワード: admin123)
INSERT INTO admins (username, email, password, name, created_at, updated_at)
VALUES (
  'admin',
  'admin@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  '管理者',
  NOW(),
  NOW()
) ON CONFLICT (username) DO NOTHING;