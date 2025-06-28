#!/bin/bash

# 言語別ワークプレイス分割スクリプト
# 使用方法: ./split-workspaces.sh

set -e

echo "🚀 言語別ワークプレイス分割を開始します..."

# 作業ディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📁 プロジェクトルート: $PROJECT_ROOT"

# 1. TypeScript/JavaScript ワークプレイス
echo "📦 TypeScript/JavaScript ワークプレイスを作成中..."
mkdir -p "$PROJECT_ROOT/../typescript-workspace"
mkdir -p "$PROJECT_ROOT/../typescript-workspace/frontend"
mkdir -p "$PROJECT_ROOT/../typescript-workspace/shared"
mkdir -p "$PROJECT_ROOT/../typescript-workspace/tools"

# Frontend ファイルを移動
cp -r "$PROJECT_ROOT/frontend/"* "$PROJECT_ROOT/../typescript-workspace/frontend/"

# 2. Go ワークプレイス
echo "🐹 Go ワークプレイスを作成中..."
mkdir -p "$PROJECT_ROOT/../go-workspace"
mkdir -p "$PROJECT_ROOT/../go-workspace/backend"
mkdir -p "$PROJECT_ROOT/../go-workspace/shared"
mkdir -p "$PROJECT_ROOT/../go-workspace/tools"

# Backend ファイルを移動
cp -r "$PROJECT_ROOT/backend/"* "$PROJECT_ROOT/../go-workspace/backend/"

# 3. Infrastructure ワークプレイス
echo "🏗️ Infrastructure ワークプレイスを作成中..."
mkdir -p "$PROJECT_ROOT/../infrastructure-workspace"
mkdir -p "$PROJECT_ROOT/../infrastructure-workspace/docker"
mkdir -p "$PROJECT_ROOT/../infrastructure-workspace/kubernetes"
mkdir -p "$PROJECT_ROOT/../infrastructure-workspace/terraform"
mkdir -p "$PROJECT_ROOT/../infrastructure-workspace/scripts"

# Docker ファイルを移動
cp -r "$PROJECT_ROOT/docker/"* "$PROJECT_ROOT/../infrastructure-workspace/docker/"

# Scripts ファイルを移動
cp -r "$PROJECT_ROOT/scripts/"* "$PROJECT_ROOT/../infrastructure-workspace/scripts/"

# 4. Documentation ワークプレイス
echo "📚 Documentation ワークプレイスを作成中..."
mkdir -p "$PROJECT_ROOT/../docs-workspace"
mkdir -p "$PROJECT_ROOT/../docs-workspace/api"
mkdir -p "$PROJECT_ROOT/../docs-workspace/architecture"
mkdir -p "$PROJECT_ROOT/../docs-workspace/deployment"
mkdir -p "$PROJECT_ROOT/../docs-workspace/user-guide"

# Docs ファイルを移動
if [ -d "$PROJECT_ROOT/docs" ]; then
    cp -r "$PROJECT_ROOT/docs/"* "$PROJECT_ROOT/../docs-workspace/"
fi

# README ファイルをコピー
cp "$PROJECT_ROOT/README.md" "$PROJECT_ROOT/../docs-workspace/"

# 5. 各ワークプレイス用の設定ファイルを作成
echo "⚙️ ワークプレイス設定ファイルを作成中..."

# TypeScript ワークプレイス用 package.json
cat > "$PROJECT_ROOT/../typescript-workspace/package.json" << 'EOF'
{
  "name": "naotechblog-typescript-workspace",
  "version": "1.0.0",
  "description": "TypeScript/JavaScript workspace for naotechblog",
  "private": true,
  "workspaces": [
    "frontend",
    "shared",
    "tools"
  ],
  "scripts": {
    "dev": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Go ワークプレイス用 go.work
cat > "$PROJECT_ROOT/../go-workspace/go.work" << 'EOF'
go 1.21

use (
    ./backend
    ./shared
    ./tools
)
EOF

# Infrastructure ワークプレイス用 README
cat > "$PROJECT_ROOT/../infrastructure-workspace/README.md" << 'EOF'
# Infrastructure Workspace

このワークプレイスは、naotechblogプロジェクトのインフラストラクチャ関連の設定を管理します。

## 構成

- `docker/`: Docker設定ファイル
- `kubernetes/`: Kubernetes設定（将来的に）
- `terraform/`: Terraform設定（将来的に）
- `scripts/`: インフラ関連スクリプト

## 使用方法

```bash
# Docker環境の起動
cd docker
docker-compose up -d

# スクリプトの実行
cd scripts
./dev.sh
```
EOF

# Documentation ワークプレイス用 README
cat > "$PROJECT_ROOT/../docs-workspace/README.md" << 'EOF'
# Documentation Workspace

このワークプレイスは、naotechblogプロジェクトのドキュメントを管理します。

## 構成

- `api/`: API仕様書
- `architecture/`: アーキテクチャ図
- `deployment/`: デプロイメントガイド
- `user-guide/`: ユーザーガイド

## ドキュメント管理

- Markdown形式で記述
- 図表は `assets/` ディレクトリに配置
- API仕様はOpenAPI形式で管理
EOF

# 6. 開発環境設定ファイルを作成
echo "🔧 開発環境設定ファイルを作成中..."

# TypeScript ワークプレイス用 .vscode/settings.json
mkdir -p "$PROJECT_ROOT/../typescript-workspace/.vscode"
cat > "$PROJECT_ROOT/../typescript-workspace/.vscode/settings.json" << 'EOF'
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.ts": "typescript",
    "*.tsx": "typescriptreact"
  }
}
EOF

# Go ワークプレイス用 .vscode/settings.json
mkdir -p "$PROJECT_ROOT/../go-workspace/.vscode"
cat > "$PROJECT_ROOT/../go-workspace/.vscode/settings.json" << 'EOF'
{
  "go.useLanguageServer": true,
  "go.formatTool": "goimports",
  "go.lintTool": "golangci-lint",
  "editor.formatOnSave": true,
  "files.associations": {
    "*.go": "go"
  }
}
EOF

echo "✅ ワークプレイス分割が完了しました！"
echo ""
echo "📁 作成されたワークプレイス:"
echo "  - typescript-workspace/     (TypeScript/JavaScript)"
echo "  - go-workspace/             (Go)"
echo "  - infrastructure-workspace/ (Docker, K8s, Terraform)"
echo "  - docs-workspace/           (Documentation)"
echo ""
echo "🚀 次のステップ:"
echo "  1. 各ワークプレイスで依存関係をインストール"
echo "  2. 開発環境を設定"
echo "  3. CI/CDパイプラインを更新"
echo "  4. チーム開発フローを調整" 