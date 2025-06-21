# Golang + Next.js + Docker テックブログ構築ガイド

## 1. プロジェクト構成

```
techblog/
├── backend/                     # Golang API サーバー
│   ├── cmd/
│   │   └── server/
│   │       └── main.go         # エントリーポイント
│   ├── internal/
│   │   ├── handlers/           # HTTP ハンドラー
│   │   │   ├── auth.go
│   │   │   ├── blog.go
│   │   │   ├── post.go
│   │   │   └── admin.go
│   │   ├── models/            # データベースモデル
│   │   │   ├── blog.go
│   │   │   ├── post.go
│   │   │   ├── user.go
│   │   │   └── like.go
│   │   ├── database/          # DB接続・マイグレーション
│   │   │   ├── connection.go
│   │   │   └── migration.go
│   │   ├── middleware/        # ミドルウェア
│   │   │   ├── cors.go
│   │   │   ├── auth.go
│   │   │   └── logging.go
│   │   └── utils/            # ユーティリティ
│   │       ├── markdown.go
│   │       ├── slug.go
│   │       └── validation.go
│   ├── configs/              # 設定ファイル
│   │   └── config.go
│   ├── migrations/           # DBマイグレーションファイル
│   ├── go.mod
│   ├── go.sum
│   ├── Dockerfile
│   └── .env.example
├── frontend/                   # Next.js フロントエンド
│   ├── src/
│   │   ├── app/               # App Router
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── login/
│   │   │   │   └── posts/
│   │   │   │       ├── new/
│   │   │   │       └── [id]/
│   │   │   ├── [blogSlug]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [postSlug]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/        # 再利用可能コンポーネント
│   │   │   ├── ui/
│   │   │   ├── MarkdownEditor.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   ├── RecommendedPosts.tsx
│   │   │   └── PopularPosts.tsx
│   │   ├── lib/              # ユーティリティ・API
│   │   │   ├── api.ts
│   │   │   ├── admin-api.ts
│   │   │   └── utils.ts
│   │   └── types/            # TypeScript型定義
│   │       ├── blog.ts
│   │       └── admin.ts
│   ├── public/               # 静的ファイル
│   ├── package.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── Dockerfile
│   └── .env.local.example
├── docker/                    # Docker設定
│   ├── docker-compose.yml
│   ├── docker-compose.dev.yml
│   ├── postgres/
│   │   └── init.sql
│   └── nginx/
│       └── nginx.conf
├── scripts/                  # 便利スクリプト
│   ├── setup.sh
│   ├── dev.sh
│   └── deploy.sh
├── docs/                     # ドキュメント
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
├── .env.example
├── .gitignore
└── README.md
```

## 2. 初期セットアップ

### 2.1 プロジェクトディレクトリ作成

```bash
# プロジェクトディレクトリを作成
mkdir techblog
cd techblog

# 各ディレクトリを作成
mkdir -p backend/{cmd/server,internal/{handlers,models,database,middleware,utils},configs,migrations}
mkdir -p frontend/src/{app,components,lib,types}
mkdir -p docker/{postgres,nginx}
mkdir -p scripts docs
```

### 2.2 Docker環境構築

**docker/docker-compose.yml**
```yaml
version: '3.8'

services:
  # PostgreSQL データベース
  postgres:
    image: postgres:15-alpine
    container_name: techblog_postgres
    environment:
      POSTGRES_DB: techblog
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - techblog_network

  # Redis (キャッシュ・セッション管理)
  redis:
    image: redis:7-alpine
    container_name: techblog_redis
    ports:
      - "6379:6379"
    networks:
      - techblog_network

  # Golang API サーバー
  backend:
    build:
      context: ../backend
      dockerfile: Dockerfile
    container_name: techblog_backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: password
      DB_NAME: techblog
      REDIS_HOST: redis
      REDIS_PORT: 6379
      JWT_SECRET: your-secret-key
      PORT: 8080
    ports:
      - "8080:8080"
    depends_on:
      - postgres
      - redis
    volumes:
      - ../backend:/app
    networks:
      - techblog_network
    restart: unless-stopped

  # Next.js フロントエンド
  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile
    container_name: techblog_frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8080/api
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ../frontend:/app
      - /app/node_modules
    networks:
      - techblog_network
    restart: unless-stopped

  # Nginx (プロダクション用リバースプロキシ)
  nginx:
    image: nginx:alpine
    container_name: techblog_nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
      - frontend
    networks:
      - techblog_network
    profiles:
      - production

volumes:
  postgres_data:

networks:
  techblog_network:
    driver: bridge
```

**docker/docker-compose.dev.yml** (開発用)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: techblog_postgres_dev
    environment:
      POSTGRES_DB: techblog_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - techblog_dev_network

  redis:
    image: redis:7-alpine
    container_name: techblog_redis_dev
    ports:
      - "6379:6379"
    networks:
      - techblog_dev_network

volumes:
  postgres_dev_data:

networks:
  techblog_dev_network:
    driver: bridge
```

### 2.3 データベース初期化

**docker/postgres/init.sql**
```sql
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
```

## 3. バックエンド（Golang）セットアップ

### 3.1 Go モジュール初期化

```bash
cd backend
go mod init techblog-backend

# 必要なパッケージをインストール
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/postgres
go get github.com/golang-jwt/jwt/v5
go get github.com/joho/godotenv
go get github.com/russross/blackfriday/v2
go get golang.org/x/crypto/bcrypt
go get github.com/go-redis/redis/v8
```

### 3.2 Dockerfile作成

**backend/Dockerfile**
```dockerfile
# 開発用
FROM golang:1.21-alpine AS development

WORKDIR /app

# 依存関係をインストール
COPY go.mod go.sum ./
RUN go mod download

# Air (ホットリロード) をインストール
RUN go install github.com/cosmtrek/air@latest

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["air", "-c", ".air.toml"]

# プロダクション用ビルド
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main cmd/server/main.go

# プロダクション用最終イメージ
FROM alpine:latest AS production

RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

CMD ["./main"]
```

### 3.3 設定ファイル

**backend/.env.example**
```env
# データベース設定
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=techblog
DB_SSLMODE=disable

# Redis設定
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT設定
JWT_SECRET=your-super-secret-key-change-this-in-production

# サーバー設定
PORT=8080
GIN_MODE=debug

# CORS設定
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

**backend/.air.toml** (ホットリロード設定)
```toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = []
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main cmd/server/main.go"
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  kill_delay = "0s"
  log = "build-errors.log"
  send_interrupt = false
  stop_on_root = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  time = false

[misc]
  clean_on_exit = false

[screen]
  clear_on_rebuild = false
```

## 4. フロントエンド（Next.js）セットアップ

### 4.1 Next.js プロジェクト作成

```bash
cd frontend

# package.json を作成
npm init -y

# 必要なパッケージをインストール
npm install next@latest react@latest react-dom@latest typescript @types/react @types/node

# 開発用パッケージ
npm install -D tailwindcss postcss autoprefixer @types/react-dom

# 追加パッケージ
npm install lucide-react @tailwindcss/typography

# Tailwind CSS 初期化
npx tailwindcss init -p
```

### 4.2 Dockerfile作成

**frontend/Dockerfile**
```dockerfile
# 開発用
FROM node:18-alpine AS development

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# 開発サーバーを起動
CMD ["npm", "run", "dev"]

# プロダクション用ビルド
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# プロダクション用最終イメージ
FROM node:18-alpine AS production

WORKDIR /app

# 必要なファイルのみコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### 4.3 設定ファイル

**frontend/package.json**
```json
{
  "name": "techblog-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "lucide-react": "^0.263.1",
    "@tailwindcss/typography": "^0.5.10"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**frontend/next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
};

module.exports = nextConfig;
```

**frontend/tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

## 5. 便利スクリプト作成

### 5.1 セットアップスクリプト

**scripts/setup.sh**
```bash
#!/bin/bash

echo "🚀 テックブログプロジェクトのセットアップを開始します..."

# 環境ファイルをコピー
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ .env ファイルを作成しました"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ backend/.env ファイルを作成しました"
fi

if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "✅ frontend/.env.local ファイルを作成しました"
fi

# Docker コンテナを起動
echo "🐳 Docker コンテナを起動しています..."
cd docker
docker-compose -f docker-compose.dev.yml up -d postgres redis

# データベースの起動を待つ
echo "⏳ データベースの起動を待っています..."
sleep 10

# バックエンドの依存関係をインストール
echo "📦 バックエンドの依存関係をインストール中..."
cd ../backend
go mod tidy

# フロントエンドの依存関係をインストール
echo "📦 フロントエンドの依存関係をインストール中..."
cd ../frontend
npm install

echo "✅ セットアップが完了しました！"
echo ""
echo "開発を開始するには以下を実行してください:"
echo "  ./scripts/dev.sh"
```

### 5.2 開発サーバー起動スクリプト

**scripts/dev.sh**
```bash
#!/bin/bash

echo "🔥 開発サーバーを起動しています..."

# Docker サービスを起動
echo "🐳 データベースとRedisを起動中..."
cd docker
docker-compose -f docker-compose.dev.yml up -d

cd ..

# バックエンドとフロントエンドを並列で起動
echo "🚀 バックエンドとフロントエンドを起動中..."

# バックエンドを起動 (バックグラウンド)
cd backend
air &
BACKEND_PID=$!

# フロントエンドを起動 (バックグラウンド)
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ 開発サーバーが起動しました！"
echo ""
echo "🌐 フロントエンド: http://localhost:3000"
echo "🔗 API: http://localhost:8080"
echo "📊 管理画面: http://localhost:3000/admin"
echo ""
echo "停止するには Ctrl+C を押してください"

# シグナルハンドリング
trap 'kill $BACKEND_PID $FRONTEND_PID; exit' INT

# プロセスの完了を待つ
wait
```

## 6. 初回起動手順

```bash
# 1. プロジェクトをクローン/作成
git clone <repository-url> techblog
cd techblog

# 2. 実行権限を付与
chmod +x scripts/*.sh

# 3. セットアップを実行
./scripts/setup.sh

# 4. 開発サーバーを起動
./scripts/dev.sh
```

## 7. 開発ワークフロー

### 日常的な開発
```bash
# 開発サーバー起動
./scripts/dev.sh

# 新しいマイグレーション作成
cd backend
go run cmd/migrate/main.go create migration_name

# テスト実行
cd backend && go test ./...
cd frontend && npm test
```

### データベース操作
```bash
# PostgreSQL に接続
docker exec -it techblog_postgres_dev psql -U postgres -d techblog_dev

# データベースリセット
docker-compose -f docker/docker-compose.dev.yml down -v
docker-compose -f docker/docker-compose.dev.yml up -d
```

## 8. トラブルシューティング

### よくある問題と解決方法

**ポートが使用中の場合**
```bash
# ポート確認
lsof -i :3000
lsof -i :8080
lsof -i :5432

# プロセス終了
kill -9 <PID>
```

**Dockerコンテナの問題**
```bash
# 全コンテナ停止
docker-compose -f docker/docker-compose.dev.yml down

# ボリューム削除してクリーンスタート
docker-compose -f docker/docker-compose.dev.yml down -v
docker-compose -f docker/docker-compose.dev.yml up -d
```

**依存関係の問題**
```bash
# Go モジュールクリーンアップ
cd backend
go clean -modcache
go mod download

# Node.js モジュールクリーンアップ
cd frontend
rm -rf node_modules package-lock.json
npm install
```

これで完全な開発環境が構築できます！🚀