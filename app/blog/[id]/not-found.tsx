import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-6 rounded-lg text-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-red-500 dark:text-red-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 16l2-2m2-2-2 2m-2-2 2 2M4 8l2.1-2.1a4.3 4.3 0 0 1 5.7-1 4 4 0 0 1 1.3 1l2.2 2.1" />
              <path d="M8.8 19.4 7.5 21l-1-1.7-2-.2 1.6-1.3-.5-1.9 1.8.8L9 15l.1 2h2l-1.4 1.4.5.9" />
              <path d="M14.1 15.8 15 14l1.1 1.7 1.9.2-1.6 1.3.5 1.9-1.8-.8-1.6 1.7-.1-2h-2l1.4-1.4-.6-.9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-red-300">
            Article Not Found
          </h2>
          <p className="mb-4 dark:text-red-300">
            Sorry, the article you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
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
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
