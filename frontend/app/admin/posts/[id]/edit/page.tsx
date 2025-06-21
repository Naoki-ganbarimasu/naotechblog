"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/MarkdownEditor";
import { adminAPI } from "@/lib/admin-api";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();

  useEffect(() => {
    Promise.all([adminAPI.getPost(parseInt(params.id)), adminAPI.getBlogs()])
      .then(([postData, blogsData]) => {
        setPost(postData.post);
        setBlogs(blogsData.blogs);
        setIsLoadingData(false);
      })
      .catch(() => router.push("/admin/login"));
  }, [params.id, router]);

  const handleSave = async (postData: any) => {
    setIsLoading(true);
    try {
      await adminAPI.updatePost(parseInt(params.id), {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        tags: postData.tags.join(", "),
        published: postData.published
      });

      alert("投稿が更新されました！");
      router.push("/admin");
    } catch (error) {
      alert("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>記事を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  return (
    <MarkdownEditor
      initialTitle={post?.title}
      initialContent={post?.content}
      onSave={handleSave}
      isLoading={isLoading}
      blogs={blogs}
    />
  );
}
