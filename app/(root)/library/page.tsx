import React from "react";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, ilike, or, count } from "drizzle-orm";
import BookList from "@/components/BookList";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = (params.query as string) || "";
  const page = Number(params.page) || 1;
  const limit = 12; // Showing more books per page in library
  const offset = (page - 1) * limit;

  const [allBooks, totalCountRes] = await Promise.all([
    db
      .select()
      .from(books)
      .where(
        query
          ? or(
              ilike(books.title, `%${query}%`),
              ilike(books.author, `%${query}%`),
              ilike(books.genre, `%${query}%`)
            )
          : undefined
      )
      .orderBy(desc(books.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(books)
      .where(
        query
          ? or(
              ilike(books.title, `%${query}%`),
              ilike(books.author, `%${query}%`),
              ilike(books.genre, `%${query}%`)
            )
          : undefined
      ),
  ]);

  const totalCount = totalCountRes[0].count;
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="library">
        <p className="library-subtitle">Discover your next great read:</p>
        <h1 className="library-title text-white">
          Explore and Search for{" "}
          <span className="text-primary italic">Any Book</span> In Our Library
        </h1>
        <div className="mx-auto w-full max-w-2xl">
          <Search placeholder="Search by title, author, or genre..." />
        </div>
      </div>

      <BookList
        title={query ? `Search Results for "${query}"` : "All Books"}
        books={allBooks as Book[]}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export default LibraryPage;
