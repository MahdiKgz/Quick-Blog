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
}

// Create a fallback array of dummy articles in case API fails
const dummyArticles: Article[] = [
  {
    id: 1,
    title: "First Article",
    body: "This is a fallback article in case the API doesn't work properly.",
  },
  {
    id: 2,
    title: "Second Article",
    body: "Another fallback article with some sample content.",
  },
  {
    id: 3,
    title: "Third Article",
    body: "Yet another fallback article with example text.",
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
    }),
    {
      name: "blog-storage",
      storage: createJSONStorage(() => localStorage),
      // Only skip hydration if not in browser environment
      skipHydration: typeof window === "undefined",
      partialize: (state) => ({ articles: state.articles }),
    }
  )
);

export default useBlogStore;
