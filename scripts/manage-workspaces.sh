#!/bin/bash

# ワークプレイス管理スクリプト
# 使用方法: ./manage-workspaces.sh [command] [options]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 色付き出力用の関数
print_info() {
    echo -e "\033[1;34mℹ️  $1\033[0m"
}

print_success() {
    echo -e "\033[1;32m✅ $1\033[0m"
}

print_warning() {
    echo -e "\033[1;33m⚠️  $1\033[0m"
}

print_error() {
    echo -e "\033[1;31m❌ $1\033[0m"
}

# ヘルプ表示
show_help() {
    cat << 'EOF'
ワークプレイス管理スクリプト

使用方法:
  ./manage-workspaces.sh [command] [options]

コマンド:
  split          ワークプレイスを分割する
  setup [name]   ワークプレイスをセットアップする
  status         ワークプレイスの状態を確認する
  clean          ワークプレイスをクリーンアップする
  sync           ワークプレイス間の同期を行う
  help           このヘルプを表示する

オプション:
  [name]         ワークプレイス名 (typescript, go, infrastructure, docs, all)

例:
  ./manage-workspaces.sh split
  ./manage-workspaces.sh setup typescript
  ./manage-workspaces.sh setup all
  ./manage-workspaces.sh status
  ./manage-workspaces.sh clean
EOF
}

# ワークプレイス分割
split_workspaces() {
    print_info "ワークプレイス分割を開始します..."
    
    if [ -f "$SCRIPT_DIR/split-workspaces.sh" ]; then
        chmod +x "$SCRIPT_DIR/split-workspaces.sh"
        "$SCRIPT_DIR/split-workspaces.sh"
        print_success "ワークプレイス分割が完了しました"
    else
        print_error "split-workspaces.sh が見つかりません"
        exit 1
    fi
}

# ワークプレイスセットアップ
setup_workspaces() {
    local workspace_name=${1:-"all"}
    
    print_info "ワークプレイスセットアップを開始します..."
    
    if [ -f "$SCRIPT_DIR/setup-workspaces.sh" ]; then
        chmod +x "$SCRIPT_DIR/setup-workspaces.sh"
        "$SCRIPT_DIR/setup-workspaces.sh" "$workspace_name"
        print_success "ワークプレイスセットアップが完了しました"
    else
        print_error "setup-workspaces.sh が見つかりません"
        exit 1
    fi
}

# ワークプレイス状態確認
check_status() {
    print_info "ワークプレイスの状態を確認中..."
    
    local workspaces=(
        "typescript-workspace:TypeScript/JavaScript"
        "go-workspace:Go"
        "infrastructure-workspace:Infrastructure"
        "docs-workspace:Documentation"
    )
    
    echo ""
    echo "📊 ワークプレイス状態レポート"
    echo "================================"
    
    for workspace in "${workspaces[@]}"; do
        IFS=':' read -r dir_name display_name <<< "$workspace"
        local workspace_path="$PROJECT_ROOT/../$dir_name"
        
        if [ -d "$workspace_path" ]; then
            print_success "$display_name ワークプレイス: 存在"
            
            # ファイル数の確認
            local file_count=$(find "$workspace_path" -type f | wc -l | tr -d ' ')
            echo "   📁 ファイル数: $file_count"
            
            # ディレクトリサイズの確認
            local dir_size=$(du -sh "$workspace_path" 2>/dev/null | cut -f1 || echo "不明")
            echo "   💾 サイズ: $dir_size"
            
            # 言語固有の情報
            case "$dir_name" in
                "typescript-workspace")
                    if [ -f "$workspace_path/package.json" ]; then
                        echo "   📦 package.json: 存在"
                    else
                        print_warning "   📦 package.json: 未作成"
                    fi
                    ;;
                "go-workspace")
                    if [ -f "$workspace_path/go.work" ]; then
                        echo "   🐹 go.work: 存在"
                    else
                        print_warning "   🐹 go.work: 未作成"
                    fi
                    ;;
                "infrastructure-workspace")
                    if [ -d "$workspace_path/docker" ]; then
                        echo "   🐳 Docker設定: 存在"
                    else
                        print_warning "   🐳 Docker設定: 未作成"
                    fi
                    ;;
                "docs-workspace")
                    if [ -f "$workspace_path/README.md" ]; then
                        echo "   📚 README: 存在"
                    else
                        print_warning "   📚 README: 未作成"
                    fi
                    ;;
            esac
        else
            print_error "$display_name ワークプレイス: 未作成"
        fi
        echo ""
    done
}

# ワークプレイスクリーンアップ
clean_workspaces() {
    print_warning "ワークプレイスのクリーンアップを開始します..."
    
    local workspaces=(
        "typescript-workspace"
        "go-workspace"
        "infrastructure-workspace"
        "docs-workspace"
    )
    
    for workspace in "${workspaces[@]}"; do
        local workspace_path="$PROJECT_ROOT/../$workspace"
        
        if [ -d "$workspace_path" ]; then
            print_info "$workspace を削除中..."
            rm -rf "$workspace_path"
            print_success "$workspace を削除しました"
        else
            print_info "$workspace は存在しません"
        fi
    done
    
    print_success "クリーンアップが完了しました"
}

# ワークプレイス間同期
sync_workspaces() {
    print_info "ワークプレイス間の同期を開始します..."
    
    # 共有設定ファイルの同期
    local shared_configs=(
        ".gitignore"
        ".editorconfig"
        "README.md"
    )
    
    for config in "${shared_configs[@]}"; do
        if [ -f "$PROJECT_ROOT/$config" ]; then
            print_info "$config を同期中..."
            
            local workspaces=(
                "typescript-workspace"
                "go-workspace"
                "infrastructure-workspace"
                "docs-workspace"
            )
            
            for workspace in "${workspaces[@]}"; do
                local workspace_path="$PROJECT_ROOT/../$workspace"
                if [ -d "$workspace_path" ]; then
                    cp "$PROJECT_ROOT/$config" "$workspace_path/" 2>/dev/null || true
                fi
            done
        fi
    done
    
    print_success "同期が完了しました"
}

# メイン処理
case "${1:-help}" in
    "split")
        split_workspaces
        ;;
    "setup")
        setup_workspaces "$2"
        ;;
    "status")
        check_status
        ;;
    "clean")
        clean_workspaces
        ;;
    "sync")
        sync_workspaces
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "無効なコマンドです: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 