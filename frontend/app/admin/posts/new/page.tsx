"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/MarkdownEditor";
import { adminAPI } from "@/lib/admin-api";

export default function NewPostPage() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    adminAPI
      .getBlogs()
      .then((data) => setBlogs(data.blogs))
      .catch(() => router.push("/admin/login"));
  }, [router]);

  const handleSave = async (postData: any) => {
    setIsLoading(true);
    try {
      await adminAPI.createPost({
        blog_id: postData.blogId,
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        tags: postData.tags.join(", "),
        published: postData.published
      });

      alert("投稿が保存されました！");
      router.push("/admin");
    } catch (error) {
      alert("保存に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MarkdownEditor onSave={handleSave} isLoading={isLoading} blogs={blogs} />
  );
}
