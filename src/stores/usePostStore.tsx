import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

interface BlogStore {
  articles: Article[];
  isLoaded: boolean;
  setPosts: (articles: Article[]) => void;
  getArticleById: (articleId: string) => Article | null;
  getRelatedArticles: (articleId: string, count?: number) => Article[];
  searchArticles: (query: string) => Article[];
  hasArticles: () => boolean;
  resetStore: () => void;
}

// Create a fallback array of dummy articles in case API fails
const dummyArticles: Article[] = [
  {
    id: 1,
    title: "The Future of Web Development",
    body: "Web development continues to evolve with new frameworks and technologies. This article explores the trends that will shape the future of the web.",
  },
  {
    id: 2,
    title: "Getting Started with React",
    body: "React has become one of the most popular frontend libraries. This beginner guide will help you understand the core concepts and start building applications.",
  },
  {
    id: 3,
    title: "Understanding TypeScript",
    body: "TypeScript adds static typing to JavaScript, making your code more robust and maintainable. Learn how to leverage TypeScript in your projects.",
  },
  {
    id: 4,
    title: "The Power of NextJS",
    body: "NextJS is a powerful React framework that enables server-side rendering and static site generation. Discover how it can improve your application performance.",
  },
  {
    id: 5,
    title: "CSS Grid Layout Explained",
    body: "CSS Grid provides a powerful layout system for web design. This article breaks down the key concepts and shows practical examples.",
  },
  {
    id: 6,
    title: "Introduction to TailwindCSS",
    body: "TailwindCSS is a utility-first CSS framework that's changing how developers style their applications. Learn the fundamentals and best practices.",
  },
  {
    id: 7,
    title: "The State of JavaScript in 2023",
    body: "JavaScript continues to dominate web development. This overview covers the current landscape and important developments in the JavaScript ecosystem.",
  },
  {
    id: 8,
    title: "Building RESTful APIs with Express",
    body: "Express is a minimal Node.js framework for building APIs. This guide shows you how to create robust and scalable RESTful services.",
  },
  {
    id: 9,
    title: "Mastering Git Workflows",
    body: "Effective Git workflows are essential for team collaboration. Learn about branching strategies, pull requests, and more.",
  },
  {
    id: 10,
    title: "Introduction to Docker for Developers",
    body: "Docker simplifies application deployment through containerization. This beginner's guide will help you understand containers and how to use them.",
  },
  {
    id: 11,
    title: "Frontend Performance Optimization",
    body: "Performance is crucial for user experience. Discover techniques to optimize your frontend code and deliver faster websites.",
  },
  {
    id: 12,
    title: "GraphQL vs REST: What to Choose",
    body: "API design choices impact your application architecture. This comparison helps you decide between GraphQL and REST for your next project.",
  },
  {
    id: 13,
    title: "Unit Testing Best Practices",
    body: "Effective testing ensures code quality. Learn the principles of good unit tests and how to integrate them into your development workflow.",
  },
  {
    id: 14,
    title: "Introduction to State Management",
    body: "State management is a core concern in complex applications. This overview covers different approaches and popular libraries.",
  },
  {
    id: 15,
    title: "Responsive Design Principles",
    body: "Creating websites that work across devices is essential. Discover the key principles of responsive design and how to implement them.",
  },
  {
    id: 16,
    title: "Getting Started with Vue.js",
    body: "Vue.js offers a progressive approach to building user interfaces. This introduction covers the basics and helps you start your first Vue project.",
  },
  {
    id: 17,
    title: "Accessibility in Web Applications",
    body: "Building accessible websites is both ethical and practical. Learn how to make your applications usable for everyone.",
  },
  {
    id: 18,
    title: "Introduction to Progressive Web Apps",
    body: "Progressive Web Apps combine the best of web and mobile apps. This guide explains core concepts and implementation techniques.",
  },
  {
    id: 19,
    title: "Modern Authentication Strategies",
    body: "User authentication has evolved beyond simple passwords. Explore modern approaches to secure user authentication in web applications.",
  },
  {
    id: 20,
    title: "The Role of DevOps in Web Development",
    body: "DevOps practices streamline development and deployment. Understand how DevOps principles can improve your development workflow.",
  },
];

const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      articles: [],
      isLoaded: false,

      // Set posts and mark store as loaded
      setPosts: (articles) =>
        set({
          articles: articles.length > 0 ? articles : dummyArticles,
          isLoaded: true,
        }),

      // Check if we have any articles
      hasArticles: () => {
        return get().articles.length > 0;
      },

      // Get a specific article by ID
      getArticleById: (id) => {
        const articles = get().articles;
        const numId = Number(id);

        // If no articles in store yet, use dummy data
        if (articles.length === 0) {
          return (
            dummyArticles.find((article) => article.id === numId) ||
            dummyArticles[0]
          );
        }

        return articles.find((article) => article.id === numId) || articles[0];
      },

      // Get related articles - currently returns random articles excluding the current one
      getRelatedArticles: (id, count = 3) => {
        const articles = get().articles;
        const currentId = Number(id);

        // If no articles in store yet, use dummy data
        if (articles.length === 0) {
          return dummyArticles.filter((article) => article.id !== currentId);
        }

        return articles
          .filter((article) => article.id !== currentId)
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      },

      // Search articles by title or body content
      searchArticles: (query) => {
        const articles =
          get().articles.length > 0 ? get().articles : dummyArticles;
        if (!query) return [];

        const lowerQuery = query.toLowerCase();
        return articles.filter(
          (article) =>
            article.title.toLowerCase().includes(lowerQuery) ||
            article.body.toLowerCase().includes(lowerQuery)
        );
      },

      // Reset store to empty state (clear localStorage cache)
      resetStore: () => {
        set({ articles: [], isLoaded: false });
        // Also clear localStorage manually to ensure cache is completely cleared
        if (typeof window !== "undefined") {
          localStorage.removeItem("blog-storage");
        }
      },
    }),
    {
      name: "blog-storage",
      storage: createJSONStorage(() => localStorage),
      // Only skip hydration if not in browser environment
      skipHydration: typeof window === "undefined",
      partialize: (state) => ({ articles: state.articles }),
      version: 1, // Add version to be able to reset on version change
    }
  )
);

export default useBlogStore;
