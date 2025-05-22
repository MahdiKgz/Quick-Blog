import { create } from "zustand";

interface Article {
  id: number;
  title: string;
  body: string;
}

interface BlogStore {
  articles: Article[];
  setPosts(articles: Article[]): void;
  getArticleById(articleId: string): Article | null;
}

const useBlogStore = create<BlogStore>((set, get) => ({
  articles: [],
  setPosts: (articles) => set({ articles }),
  getArticleById: (id) => {
    const articles = get().articles;
    return articles.find((article) => article.id === Number(id)) || null;
  },
}));

export default useBlogStore;
