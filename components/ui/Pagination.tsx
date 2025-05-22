import React from "react";
import { Button } from "@heroui/button";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxPagesShown?: number;
}

export default function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  maxPagesShown = 5,
}: PaginationProps) {
  // If there's only one page, don't render the component
  if (totalPages <= 1) return null;

  // Generate array of page numbers to show
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    // Calculate how many pages to show before and after current page
    const halfMaxPages = Math.floor(maxPagesShown / 2);
    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, startPage + maxPagesShown - 1);

    // Adjust if we're at the end
    if (endPage - startPage + 1 < maxPagesShown) {
      startPage = Math.max(1, endPage - maxPagesShown + 1);
    }

    // Add first page
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push("...");
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Previous button */}
      <Button
        variant={currentPage === 1 ? "ghost" : "flat"}
        size="sm"
        className="min-w-[40px] size-10 rounded-full flex items-center justify-center"
        isDisabled={currentPage === 1}
        onPress={() => onPageChange(currentPage - 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:-translate-x-0.5"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </Button>

      {/* Page numbers */}
      {pageNumbers.map((pageNumber, idx) => (
        <React.Fragment key={idx}>
          {typeof pageNumber === "number" ? (
            <Button
              variant={currentPage === pageNumber ? "solid" : "ghost"}
              size="sm"
              className={`min-w-[40px] rounded-full size-10 ${
                currentPage === pageNumber
                  ? "bg-darkBlue-1 dark:bg-blue-700 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onPress={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </Button>
          ) : (
            <span className="px-2 text-gray-400">•••</span>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <Button
        variant={currentPage === totalPages ? "ghost" : "flat"}
        size="sm"
        className="min-w-[40px] size-10 rounded-full flex items-center justify-center"
        isDisabled={currentPage === totalPages}
        onPress={() => onPageChange(currentPage + 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:translate-x-0.5"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Button>
    </div>
  );
}
