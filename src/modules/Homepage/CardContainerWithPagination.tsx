"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/mainPage/ArticleCard";
import ErrorMessage from "@/components/Announcment/ErrorMessage";
import useBlogStore from "@/src/stores/usePostStore";

interface Article {
  id: number;
  title: string;
  body: string;
}

// Skeleton component for loading state
const ArticleCardSkeleton = () => (
  <div className="border-2 border-dashed border-gray-600 animate-pulse h-full flex flex-col items-start gap-0 rounded-lg">
    <div className="bg-gray-300 dark:bg-gray-700 w-full h-[150px] rounded-t-lg" />
    <div className="w-full p-4 flex flex-col items-start gap-y-4">
      <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 rounded" />
      <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full rounded" />
    </div>
  </div>
);

async function fetchPosts(): Promise<Article[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export default function CardContainerWithPagination() {
  const { setPosts } = useBlogStore();

  const {
    data: articles,
    isLoading: isFetchingPosts,
    isError,
    error,
  } = useQuery<Article[], Error>({
    queryKey: ["articles"],
    queryFn: fetchPosts,
  });

  // ذخیره مقالات در Zustand
  useEffect(() => {
    if (articles) {
      setPosts(articles);
    }
  }, [articles, setPosts]);

  if (isFetchingPosts) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) return <ErrorMessage message={error?.message} />;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
      {articles
        ?.slice(0, 8)
        .map((post) => <ArticleCard key={post.id} {...post} />)}
    </div>
  );
}
