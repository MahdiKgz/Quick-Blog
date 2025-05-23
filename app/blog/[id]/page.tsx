import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
  imageUrl?: string;
}

// Fetch a single article from our API route
async function getArticle(id: string) {
  try {
    // Get the base URL from environment or use the default host in development
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    const res = await fetch(`${baseUrl}/api/articles/${id}`, {
      cache: "no-store",
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch article");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
}

// Fetch all articles for related articles section
async function getAllArticles() {
  try {
    // Get the base URL from environment or use the default host in development
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    const res = await fetch(`${baseUrl}/api/articles`, {
      cache: "no-store",
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      throw new Error("Failed to fetch articles");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

// Get related articles excluding the current one
function getRelatedArticles(
  articles: Article[],
  currentId: number,
  count: number = 3
) {
  return articles
    .filter((article) => article.id !== currentId)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}

export default async function BlogPost({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  // If article not found, show 404 page
  if (!article) {
    notFound();
  }

  // Get all articles for related posts
  const allArticles = await getAllArticles();

  // Get related articles
  const relatedPosts = getRelatedArticles(allArticles, article.id);

  // Create a formatted publication date
  const publishDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <Link
        href="/"
        className="text-blue-600 hover:text-darkBlue-1 dark:hover:text-blue-700 flex items-center gap-2 mb-6 group w-fit"
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
          className="transition-transform group-hover:-translate-x-1"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Articles
      </Link>

      <article className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg my-6">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <Image
            src={
              article.imageUrl ||
              `https://picsum.photos/seed/${article.id}/1200/600`
            }
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-4 dark:text-white">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
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
                className="text-darkBlue-1 dark:text-blue-700"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="font-medium">Author: John Doe</span>
            </div>
            <div>•</div>
            <div className="flex items-center gap-2">
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
                className="text-darkBlue-1 dark:text-blue-700"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
              <span>{publishDate}</span>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {article.body.repeat(3)}
            </p>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-darkBlue-1 dark:text-blue-700"
            >
              <path d="M21 2H9a2 2 0 0 0-2 2v2m14 0v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <path d="M9 14h.01"></path>
              <path d="M9 17h.01"></path>
              <path d="M13 14h2"></path>
              <path d="M13 17h2"></path>
            </svg>
            <h2 className="text-2xl font-bold dark:text-white">
              Related Articles
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all hover:translate-y-[-5px] group"
              >
                <div className="relative w-full h-40 mb-3 overflow-hidden rounded-md">
                  <Image
                    src={
                      post.imageUrl ||
                      `https://picsum.photos/seed/${post.id}/400/300`
                    }
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h3 className="font-medium text-lg dark:text-white line-clamp-2 group-hover:text-darkBlue-1 dark:group-hover:text-blue-700 transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center justify-end mt-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 group-hover:text-darkBlue-1 dark:group-hover:text-blue-700 transition-colors">
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
                      className="transition-transform group-hover:translate-x-1"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
