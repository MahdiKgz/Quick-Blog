import HomePageModule from "@/src/modules/Homepage/HomePageModule";

// Fetch articles from our API route
async function getArticles() {
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
}

export default async function Home() {
  const articles = await getArticles();

  return <HomePageModule initialArticles={articles} />;
}
