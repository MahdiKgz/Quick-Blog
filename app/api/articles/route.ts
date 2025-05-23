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
    // Fetch posts from JSONPlaceholder API
    const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`);
    }

    const posts = await res.json();

    // Assign a random image to each post based on its ID
    const articlesWithImages: Article[] = posts.map((post: any) => ({
      ...post,
      imageUrl: `https://picsum.photos/seed/${post.id}/500/300`,
    }));

    return NextResponse.json(articlesWithImages);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
