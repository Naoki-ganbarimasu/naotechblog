import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Calendar,
  Clock,
  User,
  Github,
  Twitter,
  Linkedin,
  Menu,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function Component() {
  const blogPosts = [
    {
      id: 1,
      title: "Next.js 15の新機能を徹底解説",
      excerpt:
        "Next.js 15で追加された新機能について、実際のコード例とともに詳しく解説します。App Routerの改善点やパフォーマンス向上について...",
      author: "田中太郎",
      date: "2024年1月15日",
      readTime: "5分",
      tags: ["Next.js", "React", "JavaScript"],
      image: "/placeholder.svg?height=200&width=400"
    },
    {
      id: 2,
      title: "TypeScriptの型安全性を活用したAPI設計",
      excerpt:
        "TypeScriptを使ったAPI設計のベストプラクティスを紹介。型安全性を保ちながら、保守性の高いコードを書く方法について...",
      author: "佐藤花子",
      date: "2024年1月12日",
      readTime: "8分",
      tags: ["TypeScript", "API", "Backend"],
      image: "/placeholder.svg?height=200&width=400"
    },
    {
      id: 3,
      title: "React Server Componentsの実践的な使い方",
      excerpt:
        "React Server Componentsを実際のプロジェクトで活用する方法を解説。パフォーマンス改善とSEO対策の観点から...",
      author: "山田次郎",
      date: "2024年1月10日",
      readTime: "6分",
      tags: ["React", "Server Components", "Performance"],
      image: "/placeholder.svg?height=200&width=400"
    },
    {
      id: 4,
      title: "TailwindCSSでモダンなUIを構築する",
      excerpt:
        "TailwindCSSを使ったモダンなUI構築のテクニックを紹介。レスポンシブデザインやダークモード対応について...",
      author: "鈴木一郎",
      date: "2024年1月8日",
      readTime: "7分",
      tags: ["TailwindCSS", "UI/UX", "CSS"],
      image: "/placeholder.svg?height=200&width=400"
    }
  ];

  const categories = [
    { name: "JavaScript", count: 24 },
    { name: "React", count: 18 },
    { name: "Next.js", count: 15 },
    { name: "TypeScript", count: 12 },
    { name: "Node.js", count: 10 },
    { name: "CSS", count: 8 }
  ];

  const popularPosts = [
    "Next.js 15の新機能を徹底解説",
    "TypeScriptの型安全性を活用したAPI設計",
    "React Server Componentsの実践的な使い方"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                TechBlog
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                ホーム
              </Link>
              <Link
                href="/articles"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                記事一覧
              </Link>
              <Link
                href="/categories"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                カテゴリ
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="記事を検索..." className="pl-10 w-64" />
              </div>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Tech Blog</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            最新の技術情報とプログラミングのベストプラクティスをお届け
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            記事を読む
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Articles */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">最新記事</h2>
              <Link
                href="/articles"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                すべて見る
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid gap-8">
              {blogPosts.map((post) => (
                <Card
                  key={post.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <CardHeader className="pb-3">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer">
                          {post.title}
                        </h3>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {post.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {post.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Categories */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  カテゴリ
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={`/category/${category.name.toLowerCase()}`}
                      className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-gray-700">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  人気記事
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {popularPosts.map((post, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="block p-3 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-700 line-clamp-2">
                          {post}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Author Profile */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  著者について
                </h3>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src="/placeholder-user.jpg" alt="Author" />
                    <AvatarFallback>TB</AvatarFallback>
                  </Avatar>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Tech Blogger
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    フロントエンド開発者として5年の経験を持つ。最新の技術トレンドを追いかけ、実践的な情報を発信中。
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">TechBlog</h3>
              <p className="text-gray-400 mb-4">
                最新の技術情報とプログラミングのベストプラクティスをお届けするテックブログです。
              </p>
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Github className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">カテゴリ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    JavaScript
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    React
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Next.js
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    TypeScript
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">リンク</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    RSS
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TechBlog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
