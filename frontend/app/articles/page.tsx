import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

// ブログ記事の型定義
interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  tags: string[];
  thumbnail?: string;
  readTime: string;
}

// サンプルデータ
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "React 19の新機能とアップデート内容を徹底解説",
    description:
      "React 19で追加された新機能や改善点について、実際のコード例を交えながら詳しく解説します。パフォーマンス向上のポイントも紹介。",
    author: "田中太郎",
    publishedAt: "2024-12-15",
    tags: ["React", "JavaScript", "Frontend"],
    thumbnail: "/images/react19.jpg",
    readTime: "5分"
  },
  {
    id: "2",
    title: "Next.js App RouterとPages Routerの違いと移行のポイント",
    description:
      "Next.js 13以降のApp Routerについて、従来のPages Routerとの違いや移行時の注意点を実例とともに説明します。",
    author: "佐藤花子",
    publishedAt: "2024-12-10",
    tags: ["Next.js", "React", "Web開発"],
    readTime: "8分"
  },
  {
    id: "3",
    title: "TypeScriptの型安全性を活用したAPIクライアント設計",
    description:
      "TypeScriptの強力な型システムを活用して、保守性の高いAPIクライアントを設計する方法を解説します。",
    author: "山田次郎",
    publishedAt: "2024-12-08",
    tags: ["TypeScript", "API", "設計"],
    readTime: "6分"
  },
  {
    id: "4",
    title: "Tailwind CSSでダークモード対応のコンポーネント作成",
    description:
      "Tailwind CSSを使用してダークモードに対応したコンポーネントを作成する方法と、実装時のベストプラクティスを紹介。",
    author: "鈴木一郎",
    publishedAt: "2024-12-05",
    tags: ["Tailwind CSS", "CSS", "UI/UX"],
    readTime: "4分"
  },
  {
    id: "5",
    title: "GraphQLとREST APIの使い分けと実装のコツ",
    description:
      "GraphQLとREST APIそれぞれの特徴を理解し、プロジェクトに適した選択をするための判断基準と実装のポイントを解説。",
    author: "高橋美咲",
    publishedAt: "2024-12-03",
    tags: ["GraphQL", "REST API", "バックエンド"],
    readTime: "7分"
  },
  {
    id: "6",
    title: "Docker Composeを使った開発環境構築の完全ガイド",
    description:
      "Docker Composeを活用して効率的な開発環境を構築する方法を、実際の設定ファイルとともに詳しく解説します。",
    author: "伊藤健太",
    publishedAt: "2024-12-01",
    tags: ["Docker", "DevOps", "環境構築"],
    readTime: "10分"
  }
];

export default function BlogList() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* ヘッダー部分 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Blog</h1>
        <p className="text-lg text-gray-600">
          最新の技術情報や開発のヒントをお届けします
        </p>
      </div>

      {/* フィルター・検索バー */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <input
            type="text"
            placeholder="記事を検索..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">すべてのタグ</option>
          <option value="react">React</option>
          <option value="nextjs">Next.js</option>
          <option value="typescript">TypeScript</option>
          <option value="css">CSS</option>
        </select>
      </div>

      {/* ブログ記事一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              {/* サムネイル画像 */}
              {post.thumbnail && (
                <div className="relative w-full h-48">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl line-clamp-2 hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* ページネーション */}
      <div className="mt-12 flex justify-center">
        <div className="flex gap-2">
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            前へ
          </button>
          <button className="px-3 py-2 bg-blue-500 text-white rounded">
            1
          </button>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            2
          </button>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            3
          </button>
          <button className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded">
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}
