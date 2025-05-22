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
  <div className="border border-gray-200 dark:border-gray-700 animate-pulse h-full flex flex-col items-start gap-0 rounded-lg shadow-sm overflow-hidden bg-white dark:bg-gray-800">
    <div className="bg-gray-200 dark:bg-gray-700 w-full h-[150px] rounded-t-lg" />
    <div className="w-full p-4 flex flex-col items-start gap-y-4">
      <div className="bg-gray-200 dark:bg-gray-700 h-6 w-3/4 rounded" />
      <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded" />
      <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded" />
      <div className="bg-gray-200 dark:bg-gray-700 h-10 w-1/3 rounded mt-2" />
    </div>
  </div>
);

// Fetch posts from the API
async function fetchPosts(): Promise<Article[]> {
  try {
    // Add a timeout to prevent long-hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      signal: controller.signal,
      cache: "no-store", // Ensure we get fresh data
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return []; // Return empty array on error, fallback will handle it
  }
}

export default function CardContainerWithPagination() {
  const { setPosts, articles, hasArticles, resetStore } = useBlogStore();
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 8;

  // Clear stored data on first render to ensure fresh data
  useEffect(() => {
    resetStore();
  }, [resetStore]);

  // Use React Query to fetch and cache the articles
  const {
    data: fetchedArticles,
    isLoading: isFetchingPosts,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchPosts,
    // Configuration for better error handling
    retry: 2,
    retryDelay: (attempt) => Math.min(attempt > 1 ? 2000 : 1000, 30 * 1000),
    staleTime: 0, // Always consider data stale
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes (previously cacheTime)
    refetchOnWindowFocus: true, // Refetch when window gets focus
    refetchOnMount: true, // Refetch on component mount
  });

  // Store articles in Zustand when they're loaded
  useEffect(() => {
    if (
      fetchedArticles &&
      Array.isArray(fetchedArticles) &&
      fetchedArticles.length > 0
    ) {
      setPosts(fetchedArticles);
    } else if (
      isError ||
      (fetchedArticles &&
        Array.isArray(fetchedArticles) &&
        fetchedArticles.length === 0)
    ) {
      // If API returns empty or error, ensure we use dummy data
      if (!hasArticles()) {
        setPosts([]);
      }
    }
  }, [fetchedArticles, setPosts, isError, hasArticles]);

  // Handle errors in console
  useEffect(() => {
    if (isError && error) {
      console.error("Failed to fetch articles:", error);
    }
  }, [isError, error]);

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

  // Function to force refresh data
  const forceRefresh = useCallback(() => {
    resetStore();
    refetch();
  }, [resetStore, refetch]);

  // Show skeletons while loading and we don't have cached data
  if (isFetchingPosts && !hasArticles()) {
    return (
      <div className="w-full flex flex-col">
        <div className="w-full text-center mb-4">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-darkBlue-1 dark:text-blue-400 rounded-full animate-pulse">
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
              className="mr-2"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
            <span>Loading articles...</span>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-6">
          {Array.from({ length: articlesPerPage }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show error message if fetching failed and we don't have cached data
  if (isError && !hasArticles()) {
    return (
      <div className="w-full flex flex-col items-center">
        <ErrorMessage
          message={
            error instanceof Error ? error.message : "Failed to load articles"
          }
        />
        <button
          onClick={forceRefresh}
          className="mt-4 px-5 py-2.5 bg-darkBlue-1 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
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
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          Try Again
        </button>
      </div>
    );
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
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex flex-col items-center">
            <div className="mb-4 text-amber-500 dark:text-amber-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              We couldn't find any articles at the moment. Please try again
              later.
            </p>
            <button
              onClick={forceRefresh}
              className="mt-6 px-5 py-2.5 bg-darkBlue-1 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
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
                <path d="M21 2v6h-6"></path>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                <path d="M3 22v-6h6"></path>
                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Display the total count with refresh button */}
      <div className="w-full flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full flex items-center">
          <span className="font-medium text-darkBlue-1 dark:text-blue-700">
            {articles.length}
          </span>{" "}
          articles available
          <button
            onClick={forceRefresh}
            className="ml-2 text-darkBlue-1 dark:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1"
            aria-label="Refresh articles"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 22v-6h6"></path>
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
            </svg>
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, articles.length)} of{" "}
          {articles.length} articles
        </div>
      </div>

      {/* Articles grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-6">
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
