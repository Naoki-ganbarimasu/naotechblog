# GitHub管理とデプロイメント構成ガイド

## 1. GitHubリポジトリ構成

### モノリポ構成（推奨）
```
techblog/                           # メインリポジトリ
├── .github/
│   └── workflows/
│       ├── backend-deploy.yml      # バックエンドCI/CD
│       ├── frontend-deploy.yml     # フロントエンドCI/CD
│       ├── docker-build.yml        # Dockerイメージビルド
│       └── tests.yml               # テスト実行
├── backend/                        # Golangバックエンド
├── frontend/                       # Next.jsフロントエンド
├── docker/                         # Docker設定
├── scripts/                        # デプロイスクリプト
├── docs/                          # ドキュメント
├── .env.example                   # 環境変数例
├── .gitignore
├── README.md
└── docker-compose.yml
```

### 分離リポジトリ構成（オプション）
```
techblog-backend/                   # バックエンド専用リポジトリ
├── .github/workflows/
├── cmd/
├── internal/
├── Dockerfile
└── README.md

techblog-frontend/                  # フロントエンド専用リポジトリ
├── .github/workflows/
├── src/
├── Dockerfile
└── README.md
```

## 2. .gitignore 設定

**ルート .gitignore**
```gitignore
# 環境変数
.env
.env.local
.env.production

# OS関連
.DS_Store
Thumbs.db

# IDEファイル
.vscode/
.idea/
*.swp
*.swo

# ログファイル
*.log
logs/

# 一時ファイル
tmp/
temp/

# Docker関連
docker-compose.override.yml

# 本番環境設定（秘匿情報を含む可能性）
docker-compose.prod.yml
```

**backend/.gitignore**
```gitignore
# Go関連
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work

# ビルド成果物
main
dist/
build/

# 環境変数
.env
.env.local

# テスト関連
coverage.txt
coverage.html

# Air（ホットリロード）
tmp/
.air.toml.local

# IDE
.vscode/
.idea/
```

**frontend/.gitignore**
```gitignore
# Node.js関連
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Next.js関連
.next/
out/
build/
dist/

# 環境変数
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# キャッシュ
.cache/
.parcel-cache/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

## 3. GitHub Actions CI/CD設定

### 3.1 バックエンドデプロイ

**.github/workflows/backend-deploy.yml**
```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
          
      - name: Run tests
        working-directory: ./backend
        run: |
          go mod download
          go test ./...
          
  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
          
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/techblog-backend:latest
            ${{ secrets.DOCKER_USERNAME }}/techblog-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          
      # Railway デプロイ例
      - name: Deploy to Railway
        uses: railway-deploy@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
          
      # または VPS デプロイ例
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USERNAME }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            docker pull ${{ secrets.DOCKER_USERNAME }}/techblog-backend:latest
            docker stop techblog-backend || true
            docker rm techblog-backend || true
            docker run -d \
              --name techblog-backend \
              --network techblog-network \
              -e DB_HOST=${{ secrets.DB_HOST }} \
              -e DB_PASSWORD=${{ secrets.DB_PASSWORD }} \
              -e JWT_SECRET=${{ secrets.JWT_SECRET }} \
              ${{ secrets.DOCKER_USERNAME }}/techblog-backend:latest
```

### 3.2 フロントエンドデプロイ

**.github/workflows/frontend-deploy.yml**
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'
          
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
        
      - name: Run linting
        working-directory: ./frontend
        run: npm run lint
        
      - name: Run type check
        working-directory: ./frontend
        run: npm run type-check
        
      - name: Build
        working-directory: ./frontend
        run: npm run build
        
  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
          vercel-args: '--prod'
          
  # または Netlify デプロイ
  deploy-netlify:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: './frontend/package-lock.json'
          
      - name: Install and build
        working-directory: ./frontend
        run: |
          npm ci
          npm run build
          
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './frontend/out'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 4. デプロイ先別の構成

### 4.1 Vercel + Railway 構成（推奨）

```yaml
# デプロイ構成
Frontend (Next.js):  Vercel
Backend (Golang):    Railway
Database:            Railway PostgreSQL
```

**メリット:**
- フロントエンドの高速デプロイ・CDN配信
- バックエンドの簡単スケーリング
- 無料枠での運用可能

**設定例:**
```bash
# Vercelプロジェクト設定
vercel --prod
vercel env add NEXT_PUBLIC_API_URL production

# Railwayプロジェクト設定
railway login
railway link
railway add postgresql
railway deploy
```

### 4.2 フル VPS 構成

```yaml
# VPS 上での構成
Frontend:  Nginx + Next.js (static export)
Backend:   Docker + Golang
Database:  PostgreSQL
Proxy:     Nginx Reverse Proxy
```

**docker-compose.production.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - techblog-network
    restart: unless-stopped

  backend:
    image: ${DOCKER_USERNAME}/techblog-backend:latest
    environment:
      DB_HOST: postgres
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    networks:
      - techblog-network
    restart: unless-stopped
    depends_on:
      - postgres

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/out:/usr/share/nginx/html
      - ./ssl:/etc/nginx/ssl
    networks:
      - techblog-network
    restart: unless-stopped
    depends_on:
      - backend

volumes:
  postgres_data:

networks:
  techblog-network:
    driver: bridge
```

### 4.3 AWS 構成

```yaml
Frontend:  S3 + CloudFront
Backend:   ECS Fargate
Database:  RDS PostgreSQL
```

## 5. 環境変数管理

### GitHub Secrets設定

```bash
# Docker関連
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password

# Vercel関連
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id

# Railway関連
RAILWAY_TOKEN=your-railway-token

# VPS関連
VPS_HOST=your-server-ip
VPS_USERNAME=your-username
VPS_SSH_KEY=your-private-key

# データベース関連
DB_HOST=your-db-host
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
```

### 環境別設定ファイル

**frontend/vercel.json**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "https://your-backend-url.railway.app/api"
  },
  "functions": {
    "app/api/**": {
      "includeFiles": "app/**"
    }
  }
}
```

## 6. デプロイフロー例

### 開発フロー
```bash
# 1. 機能開発
git checkout -b feature/new-post-editor
# 開発作業...

# 2. プルリクエスト作成
git push origin feature/new-post-editor
# GitHub でPR作成

# 3. プレビューデプロイ（自動）
# Vercel/Netlifyが自動でプレビュー環境を作成

# 4. コードレビュー後、main にマージ
# 自動で本番デプロイが実行される
```

### 本番デプロイフロー
```bash
# main ブランチへのプッシュで自動実行
1. テスト実行 → 2. ビルド → 3. デプロイ → 4. 通知
```

## 7. モニタリング・ロギング

### GitHub Actions通知

**.github/workflows/notify.yml**
```yaml
name: Deploy Notification

on:
  workflow_run:
    workflows: ["Deploy Backend", "Deploy Frontend"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Notify Slack
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 8. 推奨GitHub管理プラクティス

### ブランチ保護設定
```yaml
Branch Protection Rules (main):
- Require pull request reviews
- Require status checks to pass
- Require up-to-date branches
- Include administrators
```

### Issue・PR テンプレート

**.github/ISSUE_TEMPLATE/bug_report.md**
```markdown
## バグの概要
簡潔に説明してください

## 再現手順
1. 
2. 
3. 

## 期待される動作

## 実際の動作

## 環境
- OS:
- ブラウザ:
- バージョン:
```

**.github/pull_request_template.md**
```markdown
## 変更の概要

## 変更内容
- [ ] 新機能
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント更新

## テスト
- [ ] 単体テスト通過
- [ ] 結合テスト確認
- [ ] 手動テスト実施

## その他
```

この構成により、効率的な開発とデプロイが可能になります！