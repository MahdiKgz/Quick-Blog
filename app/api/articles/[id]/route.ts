import { NextResponse } from "next/server";

interface Article {
  id: number;
  title: string;
  body: string;
  userId?: number;
  imageUrl: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Fetch post from JSONPlaceholder API
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }
      throw new Error(`Failed to fetch post: ${res.status} ${res.statusText}`);
    }

    const post = await res.json();

    // Add image URL to the post
    const articleWithImage: Article = {
      ...post,
      imageUrl: `https://picsum.photos/seed/${post.id}/1200/600`,
    };

    return NextResponse.json(articleWithImage);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
