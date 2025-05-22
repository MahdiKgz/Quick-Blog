"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import useBlogStore from "@/src/stores/usePostStore";

interface SearchModuleProps {
  onSearchResults?: (hasResults: boolean) => void;
}

function SearchModule({ onSearchResults }: SearchModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { searchArticles, setPosts, articles, hasArticles } = useBlogStore();

  // Original articles to restore when search is cleared
  const [originalArticles, setOriginalArticles] = useState<typeof articles>([]);

  // Save original articles when component mounts
  useEffect(() => {
    if (hasArticles() && originalArticles.length === 0) {
      setOriginalArticles(articles);
    }
  }, [articles, hasArticles, originalArticles.length]);

  // Debounce search query to avoid too many searches while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery) {
      const results = searchArticles(debouncedQuery);
      setPosts(results);

      // Notify parent if needed
      if (onSearchResults) {
        onSearchResults(results.length > 0);
      }
    } else if (originalArticles.length > 0) {
      // Restore original articles when search is cleared
      setPosts(originalArticles);

      // Notify parent if needed
      if (onSearchResults) {
        onSearchResults(true);
      }
    }
  }, [
    debouncedQuery,
    searchArticles,
    setPosts,
    originalArticles,
    onSearchResults,
  ]);

  // Handle clearing the search
  const handleClearSearch = () => {
    setSearchQuery("");
    if (originalArticles.length > 0) {
      setPosts(originalArticles);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Input
        size="lg"
        className="w-full"
        label="Search Articles"
        variant="flat"
        placeholder="Type to search for articles..."
        classNames={{
          label: "text-base text-darkBlue-1 dark:text-blue-700",
          input: "pr-10",
        }}
        value={searchQuery}
        onValueChange={setSearchQuery}
        endContent={
          searchQuery ? (
            <Button
              size="sm"
              variant="ghost"
              className="min-w-0 p-0 h-5 w-5 absolute right-3"
              onPress={handleClearSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          ) : null
        }
      />
      {debouncedQuery && (
        <div className="mt-2 text-sm text-gray-500">
          Showing results for:{" "}
          <span className="font-medium">{debouncedQuery}</span>
        </div>
      )}
    </div>
  );
}

export default SearchModule;
