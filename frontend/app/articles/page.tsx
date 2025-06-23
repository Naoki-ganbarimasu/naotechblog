"use client";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { User, CalendarDays, Clock, Search } from "lucide-react";
import { useState } from "react";

// ブログ記事の型定義
interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  tags: string[];
  thumbnail: string;
  readTime: string;
  slug: string;
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
    thumbnail: "/placeholder.svg?height=200&width=400",
    readTime: "5分",
    slug: "react-19-new-features"
  },
  {
    id: "2",
    title: "Next.js App RouterとPages Routerの違いと移行のポイント",
    description:
      "Next.js 13以降のApp Routerについて、従来のPages Routerとの違いや移行時の注意点を実例とともに説明します。",
    author: "佐藤花子",
    publishedAt: "2024-12-10",
    tags: ["Next.js", "React", "Web開発"],
    thumbnail: "/placeholder.svg?height=200&width=400",
    readTime: "8分",
    slug: "nextjs-app-router-migration"
  },
  {
    id: "3",
    title: "TypeScriptの型安全性を活用したAPIクライアント設計",
    description:
      "TypeScriptの強力な型システムを活用して、保守性の高いAPIクライアントを設計する方法を解説します。",
    author: "山田次郎",
    publishedAt: "2024-12-08",
    tags: ["TypeScript", "API", "設計"],
    thumbnail: "/placeholder.svg?height=200&width=400",
    readTime: "6分",
    slug: "typescript-api-client-design"
  },
  {
    id: "4",
    title: "Tailwind CSSでダークモード対応のコンポーネント作成",
    description:
      "Tailwind CSSを使用してダークモードに対応したコンポーネントを作成する方法と、実装時のベストプラクティスを紹介。",
    author: "鈴木一郎",
    publishedAt: "2024-12-05",
    tags: ["Tailwind CSS", "CSS", "UI/UX"],
    thumbnail: "/placeholder.svg?height=200&width=400",
    readTime: "4分",
    slug: "tailwind-dark-mode-components"
  },
  {
    id: "5",
    title: "GraphQLとREST APIの使い分けと実装のコツ",
    description:
      "GraphQLとREST APIそれぞれの特徴を理解し、プロジェクトに適した選択をするための判断基準と実装のポイントを解説。",
    author: "高橋美咲",
    publishedAt: "2024-12-03",
    tags: ["GraphQL", "REST API", "バックエンド"],
    thumbnail: "/placeholder.svg?height=200&width=400",
    readTime: "7分",
    slug: "graphql-vs-rest-api"
  },
  {
    id: "6",
    title: "Docker Composeを使った開発環境構築の完全ガイド",
    description:
      "Docker Composeを活用して効率的な開発環境を構築する方法を、実際の設定ファイルとともに詳しく解説します。",
    author: "伊藤健太",
    publishedAt: "2024-12-01",
    tags: ["Docker", "DevOps", "環境構築"],
    thumbnail: "/placeholder.svg?height=200&width=400",
    readTime: "10分",
    slug: "docker-compose-development-guide"
  }
];

// 全てのタグを取得
const getAllTags = (posts: BlogPost[]) => {
  const tags = posts.flatMap((post) => post.tags);
  return Array.from(new Set(tags));
};

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all"); // Updated default value
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // フィルタリング
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "all" || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // ページネーション
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const allTags = getAllTags(blogPosts);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー部分 */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tech Blog</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          最新の技術情報や開発のヒントをお届けします
        </p>
      </div>

      {/* フィルター・検索バー */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="記事を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="タグで絞り込み" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのタグ</SelectItem>{" "}
            {/* Updated value prop */}
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 記事一覧 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          最新記事 ({filteredPosts.length}件)
        </h2>

        {paginatedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              該当する記事が見つかりませんでした。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedPosts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col overflow-hidden"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={post.thumbnail || "/placeholder.svg"}
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
                <CardFooter className="pt-0">
                  <div className="flex flex-col gap-2 text-xs text-gray-500 w-full">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        <span>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-white text-gray-700"
          >
            前へ
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "" : "bg-white text-gray-700"}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-white text-gray-700"
          >
            次へ
          </Button>
        </div>
      )}
    </div>
  );
}
