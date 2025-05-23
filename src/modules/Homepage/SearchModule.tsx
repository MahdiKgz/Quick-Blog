"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import useBlogStore from "@/src/stores/usePostStore";

interface SearchModuleProps {
  onSearchResults?: (hasResults: boolean) => void;
}

function SearchModule({ onSearchResults }: SearchModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { searchArticles, articles, setPosts } = useBlogStore();

  // Store original articles for restoring when search is cleared
  const [originalArticles, setOriginalArticles] = useState<typeof articles>([]);

  // Save original articles when component mounts or articles change
  useEffect(() => {
    if (articles.length > 0 && searchQuery === "") {
      setOriginalArticles(articles);
    }
  }, [articles, searchQuery]);

  // Debounce search query to avoid too many searches while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    // Only search if we have articles to search through
    if (articles.length > 0) {
      if (debouncedQuery) {
        const results = searchArticles(debouncedQuery);

        // Notify parent if needed
        if (onSearchResults) {
          onSearchResults(results.length > 0);
        }
      } else {
        // Restore original articles when search is cleared
        if (originalArticles.length > 0) {
          setPosts(originalArticles);
        }

        // Notify parent if needed
        if (onSearchResults) {
          onSearchResults(true);
        }
      }
    }
  }, [
    debouncedQuery,
    searchArticles,
    setPosts,
    originalArticles,
    onSearchResults,
    articles.length,
  ]);

  // Handle clearing the search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    if (originalArticles.length > 0) {
      setPosts(originalArticles);

      // Notify parent if needed
      if (onSearchResults) {
        onSearchResults(true);
      }
    }
  }, [originalArticles, setPosts, onSearchResults]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Input
        size="lg"
        className="w-full"
        label="Search Articles"
        variant="flat"
        classNames={{
          label: "text-base text-darkBlue-1 dark:text-blue-700",
          input: "pl-12 pr-12",
          innerWrapper: "group",
        }}
        value={searchQuery}
        onValueChange={setSearchQuery}
        startContent={
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-data-[focused=true]:text-darkBlue-1 dark:group-data-[focused=true]:text-blue-700 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-data-[focused=true]:scale-110 transition-transform"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        }
        endContent={
          searchQuery ? (
            <Button
              size="sm"
              variant="ghost"
              className="min-w-0 p-0 h-8 w-8 rounded-full absolute right-2"
              onPress={handleClearSearch}
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
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          ) : null
        }
      />
      {debouncedQuery && (
        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
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
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          Showing results for:{" "}
          <span className="font-medium text-darkBlue-1 dark:text-blue-700">
            {debouncedQuery}
          </span>
        </div>
      )}
    </div>
  );
}

export default SearchModule;
