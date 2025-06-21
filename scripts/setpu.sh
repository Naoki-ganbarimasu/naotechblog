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