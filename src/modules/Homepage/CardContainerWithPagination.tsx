"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import ArticleCard from "@/components/mainPage/ArticleCard";

function CardContainerWithPagination() {
  async function fetchPosts(): Promise<Article[]> {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    return res.json();
  }

  const { data: posts, isLoading: isFetchingPosts } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  console.log(posts?.slice(0, 5));

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center items-start gap-10">
      {posts
        ?.slice(0, 8)
        ?.map((post: Article) => <ArticleCard key={post.title} {...post} />)}
    </div>
  );
}

export default CardContainerWithPagination;
