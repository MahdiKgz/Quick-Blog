"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useBlogStore from "@/src/stores/usePostStore";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

// Fetch posts from the API directly if needed
async function fetchPosts(): Promise<Article[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getArticleById, getRelatedArticles, setPosts, hasArticles } =
    useBlogStore();
  const [relatedPosts, setRelatedPosts] = useState<
    Array<{ id: number; title: string }>
  >([]);

  // Use React Query to ensure we have data even if store is empty
  const { isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchPosts,
    enabled: !hasArticles(), // Only fetch if store is empty
  });

  // Handle data fetching success for store updates
  useEffect(() => {
    // If we don't have articles in the store, fetch them
    if (!hasArticles()) {
      fetchPosts()
        .then((data) => {
          setPosts(data);
        })
        .catch((err) => {
          console.error("Error fetching posts:", err);
        });
    }
  }, [hasArticles, setPosts]);

  // Get the article from store - never null due to fallback mechanism
  const article = getArticleById(id);

  // Calculate related posts using the store method
  useEffect(() => {
    if (article) {
      const related = getRelatedArticles(id, 3);
      setRelatedPosts(related.map((a) => ({ id: a.id, title: a.title })));
    }
  }, [id, getRelatedArticles, article]);

  // Create a formatted publication date
  const publishDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse">
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Safety check for TypeScript - though this should never happen due to fallback mechanism
  if (!article) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
          <p className="mb-4">
            Sorry, the article you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Articles
      </Link>

      <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg my-6">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src={`https://picsum.photos/seed/${article.id}/1200/600`}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center">
              <span className="font-medium">Author: John Doe</span>
            </div>
            <div>|</div>
            <div>{publishDate}</div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {article.body.repeat(3)}
            </p>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/blog/${post.id}`)}
              >
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={`https://picsum.photos/seed/${post.id}/400/300`}
                    alt={post.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <h3 className="font-medium text-lg dark:text-white line-clamp-2">
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
