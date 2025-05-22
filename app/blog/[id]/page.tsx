"use client";

import React from "react";
import { useParams } from "next/navigation";
import useBlogStore from "@/src/stores/usePostStore";
import Image from "next/image";
import Link from "next/link";

export default function BlogPost() {
  const params = useParams();
  const id = params.id as string;
  const { getArticleById } = useBlogStore();

  const article = getArticleById(id);

  if (!article) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          Article not found
        </div>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        &larr; Back to Articles
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg my-6">
        <Image
          src={`https://picsum.photos/seed/${article.id}/1200/600`}
          alt={article.title}
          width={1200}
          height={600}
          className="w-full h-auto"
        />

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            {article.title}
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {article.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
