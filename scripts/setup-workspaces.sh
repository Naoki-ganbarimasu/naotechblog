#!/bin/bash

# ワークプレイス開発環境セットアップスクリプト
# 使用方法: ./setup-workspaces.sh [workspace-name]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# ワークプレイス名を取得
WORKSPACE_NAME=${1:-"all"}

echo "🔧 ワークプレイス開発環境セットアップを開始します..."
echo "📁 プロジェクトルート: $PROJECT_ROOT"
echo "🎯 対象ワークプレイス: $WORKSPACE_NAME"

# TypeScript/JavaScript ワークプレイスのセットアップ
setup_typescript_workspace() {
    echo "📦 TypeScript/JavaScript ワークプレイスをセットアップ中..."
    
    local workspace_path="$PROJECT_ROOT/../typescript-workspace"
    
    if [ ! -d "$workspace_path" ]; then
        echo "❌ TypeScript ワークプレイスが見つかりません。先に split-workspaces.sh を実行してください。"
        return 1
    fi
    
    cd "$workspace_path"
    
    # 共有ライブラリの package.json を作成
    if [ ! -f "shared/package.json" ]; then
        cat > "shared/package.json" << 'EOF'
{
  "name": "@naotechblog/shared",
  "version": "1.0.0",
  "description": "Shared TypeScript utilities and types",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0"
  }
}
EOF
    fi
    
    # ツール用の package.json を作成
    if [ ! -f "tools/package.json" ]; then
        cat > "tools/package.json" << 'EOF'
{
  "name": "@naotechblog/tools",
  "version": "1.0.0",
  "description": "Development tools and scripts",
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
EOF
    fi
    
    # 依存関係をインストール
    echo "📥 依存関係をインストール中..."
    npm install
    
    # TypeScript設定ファイルを作成
    if [ ! -f "shared/tsconfig.json" ]; then
        cat > "shared/tsconfig.json" << 'EOF'
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    fi
    
    if [ ! -f "tools/tsconfig.json" ]; then
        cat > "tools/tsconfig.json" << 'EOF'
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    fi
    
    # ベース TypeScript設定
    if [ ! -f "tsconfig.base.json" ]; then
        cat > "tsconfig.base.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true
  }
}
EOF
    fi
    
    echo "✅ TypeScript/JavaScript ワークプレイスのセットアップが完了しました"
}

# Go ワークプレイスのセットアップ
setup_go_workspace() {
    echo "🐹 Go ワークプレイスをセットアップ中..."
    
    local workspace_path="$PROJECT_ROOT/../go-workspace"
    
    if [ ! -d "$workspace_path" ]; then
        echo "❌ Go ワークプレイスが見つかりません。先に split-workspaces.sh を実行してください。"
        return 1
    fi
    
    cd "$workspace_path"
    
    # 共有ライブラリの go.mod を作成
    if [ ! -f "shared/go.mod" ]; then
        cat > "shared/go.mod" << 'EOF'
module github.com/naotechblog/shared

go 1.21

require (
    github.com/stretchr/testify v1.8.4
)
EOF
    fi
    
    # ツール用の go.mod を作成
    if [ ! -f "tools/go.mod" ]; then
        cat > "tools/go.mod" << 'EOF'
module github.com/naotechblog/tools

go 1.21

require (
    github.com/spf13/cobra v1.7.0
)
EOF
    fi
    
    # 依存関係をダウンロード
    echo "📥 依存関係をダウンロード中..."
    go work sync
    
    # .gitignore を作成
    if [ ! -f ".gitignore" ]; then
        cat > ".gitignore" << 'EOF'
# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with `go test -c`
*.test

# Output of the go coverage tool, specifically when used with LiteIDE
*.out

# Dependency directories (remove the comment below to include it)
# vendor/

# Go workspace file
go.work.sum

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
    fi
    
    echo "✅ Go ワークプレイスのセットアップが完了しました"
}

# Infrastructure ワークプレイスのセットアップ
setup_infrastructure_workspace() {
    echo "🏗️ Infrastructure ワークプレイスをセットアップ中..."
    
    local workspace_path="$PROJECT_ROOT/../infrastructure-workspace"
    
    if [ ! -d "$workspace_path" ]; then
        echo "❌ Infrastructure ワークプレイスが見つかりません。先に split-workspaces.sh を実行してください。"
        return 1
    fi
    
    cd "$workspace_path"
    
    # .gitignore を作成
    if [ ! -f ".gitignore" ]; then
        cat > ".gitignore" << 'EOF'
# Terraform
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl

# Kubernetes
*.kubeconfig

# Docker
.env
.env.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
    fi
    
    # スクリプトに実行権限を付与
    chmod +x scripts/*.sh 2>/dev/null || true
    
    echo "✅ Infrastructure ワークプレイスのセットアップが完了しました"
}

# Documentation ワークプレイスのセットアップ
setup_docs_workspace() {
    echo "📚 Documentation ワークプレイスをセットアップ中..."
    
    local workspace_path="$PROJECT_ROOT/../docs-workspace"
    
    if [ ! -d "$workspace_path" ]; then
        echo "❌ Documentation ワークプレイスが見つかりません。先に split-workspaces.sh を実行してください。"
        return 1
    fi
    
    cd "$workspace_path"
    
    # package.json を作成（ドキュメント生成ツール用）
    if [ ! -f "package.json" ]; then
        cat > "package.json" << 'EOF'
{
  "name": "naotechblog-docs",
  "version": "1.0.0",
  "description": "Documentation for naotechblog project",
  "scripts": {
    "dev": "docsify serve .",
    "build": "docsify generate .",
    "lint": "markdownlint **/*.md"
  },
  "devDependencies": {
    "docsify-cli": "^4.4.4",
    "markdownlint-cli": "^0.33.0"
  }
}
EOF
    fi
    
    # .gitignore を作成
    if [ ! -f ".gitignore" ]; then
        cat > ".gitignore" << 'EOF'
# Generated documentation
_site/
dist/

# Node modules
node_modules/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
    fi
    
    echo "✅ Documentation ワークプレイスのセットアップが完了しました"
}

# メイン処理
case "$WORKSPACE_NAME" in
    "typescript"|"ts"|"js")
        setup_typescript_workspace
        ;;
    "go"|"golang")
        setup_go_workspace
        ;;
    "infrastructure"|"infra")
        setup_infrastructure_workspace
        ;;
    "docs"|"documentation")
        setup_docs_workspace
        ;;
    "all")
        setup_typescript_workspace
        setup_go_workspace
        setup_infrastructure_workspace
        setup_docs_workspace
        ;;
    *)
        echo "❌ 無効なワークプレイス名です: $WORKSPACE_NAME"
        echo "使用可能なオプション:"
        echo "  - typescript, ts, js"
        echo "  - go, golang"
        echo "  - infrastructure, infra"
        echo "  - docs, documentation"
        echo "  - all (デフォルト)"
        exit 1
        ;;
esac

echo ""
echo "🎉 ワークプレイスセットアップが完了しました！"
echo ""
echo "📋 次のステップ:"
echo "  1. 各ワークプレイスで開発を開始"
echo "  2. CI/CDパイプラインの設定"
echo "  3. チーム開発フローの確立"
echo ""
echo "💡 ヒント:"
echo "  - 各ワークプレイスは独立して開発できます"
echo "  - 共有ライブラリを使用してコードの重複を避けましょう"
echo "  - 定期的にワークプレイス間の依存関係を見直しましょう" 