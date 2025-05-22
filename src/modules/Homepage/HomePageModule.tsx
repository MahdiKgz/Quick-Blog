"use client";
import React, { useState } from "react";
import SearchModule from "./SearchModule";
import CardContainerWithPagination from "./CardContainerWithPagination";

function HomePageModule() {
  const [hasSearchResults, setHasSearchResults] = useState(true);

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
        <div className="w-full py-6 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search terms to find what you're looking for.
            </p>
          </div>
        </div>
      )}

      {/* Only show pagination if we have search results */}
      {hasSearchResults && <CardContainerWithPagination />}
    </div>
  );
}

export default HomePageModule;
