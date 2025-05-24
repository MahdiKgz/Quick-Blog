import { NextResponse } from "next/server";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
  imageUrl: string;
}

export async function GET() {
  try {
    // Create abort controller with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      // Fetch posts from JSONPlaceholder API
      const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
        signal: controller.signal,
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      // Clear the timeout since the request completed
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(
          `Failed to fetch posts: ${res.status} ${res.statusText}`
        );
      }

      const posts = await res.json();

      // Assign a random image to each post based on its ID
      const articlesWithImages: Article[] = posts.map((post: any) => ({
        ...post,
        imageUrl: `https://picsum.photos/seed/${post.id}/500/300`,
      }));

      return NextResponse.json(articlesWithImages);
    } catch (fetchError) {
      // Handle abort errors specifically
      if (
        fetchError instanceof DOMException &&
        fetchError.name === "AbortError"
      ) {
        console.error("Request timed out while fetching articles");
        return NextResponse.json(
          { error: "Request timed out while fetching articles" },
          { status: 408 }
        );
      }
      throw fetchError; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
