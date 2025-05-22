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

// Fetch posts from the API
async function fetchPosts(): Promise<Article[]> {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return empty array on error, fallback will handle it
  }
}

export default function CardContainerWithPagination() {
  const { setPosts, isLoaded, articles, hasArticles } = useBlogStore();

  // Use React Query to fetch and cache the articles
  const {
    data: fetchedArticles,
    isLoading: isFetchingPosts,
    isError,
    error,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchPosts,
    // Skip fetching if we already have data in the store
    enabled: !hasArticles(),
  });

  // Store articles in Zustand when they're loaded
  useEffect(() => {
    if (fetchedArticles && fetchedArticles.length > 0) {
      setPosts(fetchedArticles);
    }
  }, [fetchedArticles, setPosts]);

  // Show skeletons while loading and we don't have cached data
  if (isFetchingPosts && !hasArticles()) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show error message if fetching failed and we don't have cached data
  if (isError && !hasArticles()) {
    return <ErrorMessage message={error?.message} />;
  }

  // Get articles from store (including possible fallback dummy data)
  const articlesToDisplay = articles.slice(0, 8);

  // Display the articles
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
      {articlesToDisplay.map((post) => (
        <ArticleCard key={post.id} {...post} />
      ))}
    </div>
  );
}
