import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { User, CalendarDays, Clock } from "lucide-react";

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

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">最新記事</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader className="flex-1">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString("ja-JP", {
                          month: "short",
                          day: "numeric"
                        })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
