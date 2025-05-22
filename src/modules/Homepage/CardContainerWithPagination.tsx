"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/mainPage/ArticleCard";
import ErrorMessage from "@/components/Announcment/ErrorMessage";
import useBlogStore from "@/src/stores/usePostStore";
import Pagination from "@/components/ui/Pagination";

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
  const { setPosts, articles, hasArticles } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 8;

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

  // Memoized page change handler to prevent unnecessary re-renders
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes with smooth animation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Reset to page 1 if articles change (e.g. if articles are filtered)
  useEffect(() => {
    setCurrentPage(1);
  }, [articles.length]);

  // Show skeletons while loading and we don't have cached data
  if (isFetchingPosts && !hasArticles()) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
        {Array.from({ length: articlesPerPage }).map((_, index) => (
          <ArticleCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show error message if fetching failed and we don't have cached data
  if (isError && !hasArticles()) {
    return <ErrorMessage message={error?.message} />;
  }

  // Calculate pagination
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = articles.slice(startIndex, endIndex);

  // Show message if no articles are found
  if (articles.length === 0) {
    return (
      <div className="w-full py-10 text-center">
        <h3 className="text-xl text-gray-500 dark:text-gray-400">
          No articles found.
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-10">
      {/* Display the total count */}
      <div className="w-full text-right text-sm text-gray-500 dark:text-gray-400">
        Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of{" "}
        {articles.length} articles
      </div>

      {/* Articles grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
        {currentArticles.map((post) => (
          <ArticleCard key={post.id} {...post} />
        ))}
      </div>

      {/* Pagination component */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          maxPagesShown={5}
        />
      )}
    </div>
  );
}
