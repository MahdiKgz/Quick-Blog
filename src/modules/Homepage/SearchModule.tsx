"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@heroui/input";
import useBlogStore from "@/src/stores/usePostStore";

interface SearchModuleProps {
  onSearchResults?: (hasResults: boolean) => void;
}

function SearchModule({ onSearchResults }: SearchModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const { searchArticles, filteredArticles } = useBlogStore();

  // Store the timeout ID for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search with debounce and error handling
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      setSearchError(null); // Clear any previous errors

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout for debouncing
      timeoutRef.current = setTimeout(() => {
        try {
          // Search and update results through the store
          const results = searchArticles(query);
          // Only update the UI if we need to show search results
          onSearchResults?.(results.length > 0);
        } catch (error) {
          console.error("Search error:", error);
          setSearchError(
            "An error occurred while searching. Please try again."
          );
          onSearchResults?.(false);
        }
      }, 300);
    },
    [searchArticles, onSearchResults]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle clearing the search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchError(null);
    try {
      searchArticles("");
      onSearchResults?.(true);
    } catch (error) {
      console.error("Error clearing search:", error);
    }
  }, [searchArticles, onSearchResults]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Input
        size="lg"
        className="w-full"
        variant="flat"
        label="Search Articles"
        labelPlacement="outside"
        classNames={{
          label: "text-base text-darkBlue-1 dark:text-blue-700",
        }}
        value={searchQuery}
        onValueChange={handleSearch}
        endContent={
          searchQuery ? (
            <button
              onClick={handleClearSearch}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ) : null
        }
      />
      {searchError && (
        <div className="mt-2 text-sm text-red-500 flex items-center gap-2">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {searchError}
        </div>
      )}
      {searchQuery && !searchError && (
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
            {searchQuery}
          </span>
          {filteredArticles.length > 0 && (
            <span className="ml-1 text-gray-500">
              ({filteredArticles.length} results)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchModule;
