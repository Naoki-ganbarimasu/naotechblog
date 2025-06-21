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