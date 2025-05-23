"use client";
import React, { useState, useEffect } from "react";
import SearchModule from "./SearchModule";
import CardContainerWithPagination from "./CardContainerWithPagination";
import useBlogStore from "@/src/stores/usePostStore";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
  imageUrl?: string;
}

interface HomePageModuleProps {
  initialArticles: Article[];
}

function HomePageModule({ initialArticles }: HomePageModuleProps) {
  const [hasSearchResults, setHasSearchResults] = useState(true);
  const { setPosts } = useBlogStore();

  // Initialize the store with server-fetched articles
  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) {
      setPosts(initialArticles);
    }
  }, [initialArticles, setPosts]);

  return (
    <div className="container my-[103px] w-full h-auto flex flex-col items-center justify-center gap-y-8">
      <div className="main-content__title flex flex-col items-center justify-center gap-y-2.5">
        <h1 className="text-darkBlue-1 dark:text-blue-700 font-black text-5xl text-center">
          The Quick Blog
        </h1>
        <span className="text-xl text-gray-500 dark:text-gray-400">
          Search and browse articles
        </span>
      </div>

      {/* Search module with callback for search results */}
      <SearchModule onSearchResults={setHasSearchResults} />

      {/* Display no results message if search returns empty */}
      {!hasSearchResults && (
        <div className="w-full py-8 text-center">
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
                We couldn't find any articles matching your search criteria. Try
                adjusting your search terms or browse our categories below.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setHasSearchResults(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-darkBlue-1 dark:bg-blue-700 text-white rounded-lg hover:opacity-90 transition-opacity"
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
                  Back to all articles
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only show pagination if we have search results */}
      {hasSearchResults && (
        <CardContainerWithPagination initialArticles={initialArticles} />
      )}
    </div>
  );
}

export default HomePageModule;
