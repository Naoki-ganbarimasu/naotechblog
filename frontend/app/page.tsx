import {
  Card,
  CardHeader,
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
const blogPosts = [
  {
    id: 1,
    title: "Next.js 15の新機能を徹底解説",
    description:
      "Next.js 15で追加された新機能とパフォーマンス改善について詳しく解説します。",
    date: "2024-01-15",
    readTime: "8分",
    author: "田中太郎",
    tags: ["Next.js", "React", "Web開発"],
    slug: "nextjs-15-features",
    image: "/placeholder.svg?height=200&width=400&text=Next.js+15"
  },
  {
    id: 2,
    title: "TypeScriptの型安全性を活用したAPI設計",
    description:
      "TypeScriptの強力な型システムを使って、保守性の高いAPIを設計する方法を紹介します。",
    date: "2024-01-10",
    readTime: "12分",
    author: "佐藤花子",
    tags: ["TypeScript", "API", "設計"],
    slug: "typescript-api-design",
    image: "/placeholder.svg?height=200&width=400&text=TypeScript+API"
  },
  {
    id: 3,
    title: "React Server Componentsの実践的な使い方",
    description:
      "React Server Componentsを実際のプロジェクトで活用する際のベストプラクティスを解説します。",
    date: "2024-01-05",
    readTime: "10分",
    author: "山田次郎",
    tags: ["React", "Server Components", "パフォーマンス"],
    slug: "react-server-components",
    image: "/placeholder.svg?height=200&width=400&text=React+Server"
  },
  {
    id: 4,
    title: "Tailwind CSSで効率的なスタイリング",
    description:
      "Tailwind CSSを使った効率的なスタイリング手法とベストプラクティスを紹介します。",
    date: "2024-01-03",
    readTime: "6分",
    author: "鈴木一郎",
    tags: ["CSS", "Tailwind", "デザイン"],
    slug: "tailwind-css-styling",
    image: "/placeholder.svg?height=200&width=400&text=Tailwind+CSS"
  },
  {
    id: 5,
    title: "GraphQLとREST APIの比較検討",
    description:
      "GraphQLとREST APIのメリット・デメリットを比較し、適切な選択指針を提示します。",
    date: "2024-01-01",
    readTime: "15分",
    author: "高橋美咲",
    tags: ["GraphQL", "REST", "API"],
    slug: "graphql-vs-rest",
    image: "/placeholder.svg?height=200&width=400&text=GraphQL+vs+REST"
  },
  {
    id: 6,
    title: "Docker環境でのNext.js開発",
    description:
      "Dockerを使ったNext.jsアプリケーションの開発環境構築と運用のコツを解説します。",
    date: "2023-12-28",
    readTime: "9分",
    author: "伊藤健太",
    tags: ["Docker", "Next.js", "DevOps"],
    slug: "nextjs-docker-development",
    image: "/placeholder.svg?height=200&width=400&text=Docker+Next.js"
  },
  {
    id: 7,
    title: "WebAssemblyの基礎と活用事例",
    description:
      "WebAssemblyの基本概念から実際の活用事例まで、幅広く紹介します。",
    date: "2023-12-25",
    readTime: "11分",
    author: "渡辺真理",
    tags: ["WebAssembly", "パフォーマンス", "ブラウザ"],
    slug: "webassembly-basics",
    image: "/placeholder.svg?height=200&width=400&text=WebAssembly"
  },
  {
    id: 8,
    title: "モダンJavaScriptのテスト戦略",
    description:
      "Jest、Testing Library、Playwrightを使った包括的なテスト戦略について解説します。",
    date: "2023-12-22",
    readTime: "13分",
    author: "中村雅人",
    tags: ["JavaScript", "テスト", "Jest"],
    slug: "modern-javascript-testing",
    image: "/placeholder.svg?height=200&width=400&text=JavaScript+Testing"
  }
];

export default function BlogList() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
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
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="タグでフィルター"
        >
          <option value="">すべてのタグ</option>
          <option value="react">React</option>
          <option value="nextjs">Next.js</option>
          <option value="typescript">TypeScript</option>
          <option value="css">CSS</option>
        </select>
      </div>

      {/* Blog Posts */}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">TechBlog</h3>
          <p className="text-slate-400 mb-6">技術の力で世界をより良くする</p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/privacy"
              className="text-slate-400 hover:text-white transition-colors"
            >
              プライバシーポリシー
            </Link>
            <Link
              href="/terms"
              className="text-slate-400 hover:text-white transition-colors"
            >
              利用規約
            </Link>
            <Link
              href="/contact"
              className="text-slate-400 hover:text-white transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
