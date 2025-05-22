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
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg animate-pulse">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-4 w-4 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="h-[200px] bg-gray-300 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="flex gap-3 mb-6">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Safety check for TypeScript - though this should never happen due to fallback mechanism
  if (!article) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 16l2-2m2-2-2 2m-2-2 2 2M4 8l2.1-2.1a4.3 4.3 0 0 1 5.7-1 4 4 0 0 1 1.3 1l2.2 2.1" />
                <path d="M8.8 19.4 7.5 21l-1-1.7-2-.2 1.6-1.3-.5-1.9 1.8.8L9 15l.1 2h2l-1.4 1.4.5.9" />
                <path d="M14.1 15.8 15 14l1.1 1.7 1.9.2-1.6 1.3.5 1.9-1.8-.8-1.6 1.7-.1-2h-2l1.4-1.4-.6-.9" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Article Not Found</h2>
            <p className="mb-4">
              Sorry, the article you're looking for doesn't exist or has been
              removed.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/"
        className="text-blue-600 hover:text-darkBlue-1 dark:hover:text-blue-700 flex items-center gap-2 mb-6 group w-fit"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:-translate-x-1"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Articles
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

          <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-darkBlue-1 dark:text-blue-700"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="font-medium">Author: John Doe</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-darkBlue-1 dark:text-blue-700"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              <span>{publishDate}</span>
            </div>
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
          <div className="flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-darkBlue-1 dark:text-blue-700"
            >
              <path d="M21 2H9a2 2 0 0 0-2 2v2m14 0v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <path d="M9 14h.01"></path>
              <path d="M9 17h.01"></path>
              <path d="M13 14h2"></path>
              <path d="M13 17h2"></path>
            </svg>
            <h2 className="text-2xl font-bold dark:text-white">
              Related Articles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all hover:translate-y-[-5px] group"
                onClick={() => router.push(`/blog/${post.id}`)}
              >
                <div className="relative w-full h-40 mb-3 overflow-hidden rounded-md">
                  <Image
                    src={`https://picsum.photos/seed/${post.id}/400/300`}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-medium text-lg dark:text-white line-clamp-2 group-hover:text-darkBlue-1 dark:group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-end mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 group-hover:text-darkBlue-1 dark:group-hover:text-blue-700 transition-colors">
                    Read more
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
