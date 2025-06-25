"use client";

import { Edit, Eye, FileText, Save, Settings } from "lucide-react";
import { useEffect, useState } from "react";

interface MarkdownEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave: (data: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    published: boolean;
    blogId: number;
  }) => void;
  isLoading?: boolean;
  blogs: Array<{ id: number; name: string; slug: string }>;
}

export default function MarkdownEditor({
  initialContent = "",
  initialTitle = "",
  onSave,
  isLoading = false,
  blogs,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [published, setPublished] = useState(false);
  const [blogId, setBlogId] = useState(blogs[0]?.id || 1);
  const [previewMode, setPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // マークダウンをHTMLに変換（簡易版）
  const renderMarkdown = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/\n/g, "<br>");
  };

  // タグ追加
  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // タグ削除
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 自動保存機能
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (title && content) {
        // ローカルストレージに自動保存
        localStorage.setItem(
          "draft_post",
          JSON.stringify({
            title,
            content,
            excerpt,
            tags,
            published,
            blogId,
            timestamp: new Date().toISOString(),
          })
        );
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [title, content, excerpt, tags, published, blogId]);

  // 下書きを復元
  useEffect(() => {
    const savedDraft = localStorage.getItem("draft_post");
    if (savedDraft && !initialContent) {
      const draft = JSON.parse(savedDraft);
      const confirm = window.confirm(
        "保存された下書きが見つかりました。復元しますか？"
      );
      if (confirm) {
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setExcerpt(draft.excerpt || "");
        setTags(draft.tags || []);
        setPublished(draft.published || false);
        setBlogId(draft.blogId || blogs[0]?.id || 1);
      }
    }
  }, [initialContent, blogs]);

  const handleSave = () => {
    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }
    if (!content.trim()) {
      alert("本文を入力してください");
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim() || content.slice(0, 150) + "...",
      tags,
      published,
      blogId,
    });

    // 保存後は下書きを削除
    localStorage.removeItem("draft_post");
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="記事のタイトルを入力..."
              className="text-2xl font-bold border-none outline-none bg-transparent placeholder-gray-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <Settings size={20} />
            </button>

            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                previewMode
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {previewMode ? <Edit size={18} /> : <Eye size={18} />}
              <span className="ml-2">
                {previewMode ? "編集" : "プレビュー"}
              </span>
            </button>

            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`flex items-center px-6 py-2 rounded-lg text-white transition-colors ${
                published
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {published ? "公開" : "下書き保存"}
            </button>
          </div>
        </div>

        {/* 設定パネル */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* ブログ選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  投稿先ブログ
                </label>
                <select
                  value={blogId}
                  onChange={(e) => setBlogId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {blogs.map((blog) => (
                    <option key={blog.id} value={blog.id}>
                      {blog.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 公開設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  公開設定
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={!published}
                      onChange={() => setPublished(false)}
                      className="mr-2"
                    />
                    下書き
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={published}
                      onChange={() => setPublished(true)}
                      className="mr-2"
                    />
                    公開
                  </label>
                </div>
              </div>

              {/* 抜粋 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  抜粋（任意）
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="記事の概要を入力..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* タグ */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="タグを入力してEnterで追加..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </header>

      {/* メインエディタエリア */}
      <div className="flex-1 flex overflow-hidden">
        {!previewMode ? (
          /* マークダウンエディタ */
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`# 記事タイトル

ここに本文を書いてください...

## セクション1

マークダウン記法が使えます：

- **太字**
- *斜体*
- \`コード\`
- [リンク](https://example.com)

\`\`\`javascript
// コードブロック
function hello() {
  console.log('Hello, World!');
}
\`\`\`

## まとめ

記事の内容をまとめてください。`}
                className="w-full h-full resize-none border-none outline-none font-mono text-sm leading-relaxed"
                style={{ minHeight: "500px" }}
              />
            </div>

            {/* ツールバー */}
            <div className="border-t border-gray-200 bg-white px-6 py-3">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <FileText size={16} className="mr-1" />
                  {content.length} 文字
                </span>
                <span>行数: {content.split("\n").length}</span>
                <span className="text-green-600">✓ 自動保存済み</span>
              </div>
            </div>
          </div>
        ) : (
          /* プレビュー */
          <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6">
              <article className="prose prose-lg max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {title || "タイトルが入力されていません"}
                </h1>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      renderMarkdown(content) ||
                      "<p>本文が入力されていません</p>",
                  }}
                />
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
