import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
  imageUrl?: string;
}

interface BlogStore {
  articles: Article[];
  isLoaded: boolean;
  filteredArticles: Article[];
  setPosts: (articles: Article[]) => void;
  getArticleById: (articleId: string) => Article | null;
  getRelatedArticles: (articleId: string, count?: number) => Article[];
  searchArticles: (query: string) => Article[];
  hasArticles: () => boolean;
  resetStore: () => void;
}

const useBlogStore = create<BlogStore>()(
  persist(
    (set, get) => ({
      articles: [],
      filteredArticles: [],
      isLoaded: false,

      // Set posts and mark store as loaded
      setPosts: (articles) =>
        set({
          articles: articles.length > 0 ? articles : [],
          filteredArticles: articles.length > 0 ? articles : [],
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

        if (articles.length === 0) {
          return null;
        }

        return articles.find((article) => article.id === numId) || null;
      },

      // Get related articles - currently returns random articles excluding the current one
      getRelatedArticles: (id, count = 3) => {
        const articles = get().articles;
        const currentId = Number(id);

        if (articles.length === 0) {
          return [];
        }

        return articles
          .filter((article) => article.id !== currentId)
          .sort(() => 0.5 - Math.random())
          .slice(0, count);
      },

      // Search articles by title or body content - optimized version with error handling
      searchArticles: (query) => {
        try {
          const { articles } = get();

          if (!query || query.trim() === "") {
            // If query is empty, return all articles without filtering
            set({ filteredArticles: articles });
            return articles;
          }

          const lowerQuery = query.toLowerCase();
          const filtered = articles.filter(
            (article) =>
              article.title.toLowerCase().includes(lowerQuery) ||
              article.body.toLowerCase().includes(lowerQuery)
          );

          // Update filtered articles in the store
          set({ filteredArticles: filtered });
          return filtered;
        } catch (error) {
          console.error("Error in searchArticles:", error);
          // In case of error, return the full articles array to avoid breaking the UI
          const { articles } = get();
          set({ filteredArticles: articles });
          return articles;
        }
      },

      // Reset store to empty state (clear localStorage cache)
      resetStore: () => {
        set({ articles: [], filteredArticles: [], isLoaded: false });
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
      partialize: (state) => ({
        articles: state.articles,
        filteredArticles: state.filteredArticles,
      }),
      version: 1, // Add version to be able to reset on version change
    }
  )
);

export default useBlogStore;
