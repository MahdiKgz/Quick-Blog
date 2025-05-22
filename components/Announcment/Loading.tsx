
import React from "react";

export default function ArticleCardSkeleton() {
  return (
    <div
      className="border-2 border-dashed border-gray-600 h-full flex flex-col items-start gap-0 rounded-lg animate-pulse"
    >
      <div className="w-full h-[150px] bg-gray-300 dark:bg-gray-700 rounded-t-lg" />

      <div className="w-full p-4 flex flex-col items-start gap-y-4">
        <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
