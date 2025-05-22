import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Article {
  id: number;
  title: string;
  body: string;
}

function ArticleCard({ id, title, body }: Article) {
  return (
    <Link
      href={`/blog/${id}`}
      className="border-2 border-dashed border-gray-600 h-full flex flex-col items-start gap-0 rounded-lg"
    >
      <Image
        src={`https://picsum.photos/seed/${id}/500/300`}
        alt={title}
        width={400}
        height={150}
        className="rounded-t-lg"
      />
      <div className="w-full p-4 flex flex-col items-start gap-y-4">
        <h1 className="text-2xl font-light text-wrap line-clamp-2 dark:text-gray-400">
          {title}
        </h1>
        <span className="text-sm text-zinc-900 dark:text-gray-600 text-wrap line-clamp-2">
          {body}
        </span>
      </div>
    </Link>
  );
}

export default ArticleCard;
