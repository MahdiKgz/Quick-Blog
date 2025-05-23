import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Article {
  id: number;
  title: string;
  body: string;
  imageUrl?: string;
}

function ArticleCard({ id, title, body, imageUrl }: Article) {
  // Use provided imageUrl or generate one based on ID as fallback
  const imageSource = imageUrl || `https://picsum.photos/seed/${id}/500/300`;

  return (
    <Link
      href={`/blog/${id}`}
      className="border border-gray-200 dark:border-gray-700 h-full flex flex-col items-start gap-0 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800"
    >
      <div className="relative w-full h-[180px] overflow-hidden">
        <Image
          src={imageSource}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="w-full p-5 flex flex-col items-start gap-y-3">
        <h1 className="text-xl font-semibold text-wrap line-clamp-2 text-gray-800 dark:text-gray-200">
          {title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-wrap line-clamp-3">
          {body}
        </p>
        <div className="mt-2 text-darkBlue-1 dark:text-blue-500 text-sm font-medium flex items-center">
          Read more
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
            className="ml-1 transition-transform group-hover:translate-x-1"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
