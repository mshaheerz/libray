import BookList from "@/components/BookList";
import { auth } from "@/auth";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq, ne, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const session = await auth();

  // fetch data based on id
  const [bookDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  if (!bookDetails) redirect("/404");

  const similarBooks = await db
    .select()
    .from(books)
    .where(and(eq(books.genre, bookDetails.genre), ne(books.id, id)))
    .limit(10);

  return (
    <>
      <BookOverview {...bookDetails} userId={session?.user?.id as string} />
      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <BookVideo videoUrl={bookDetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookDetails.summary.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </section>
        </div>

        {/* similar books */}
        <BookList
          title="Similar Books"
          books={similarBooks as Book[]}
          containerClassName="mt-10 lg:mt-0"
        />
      </div>
    </>
  );
}

export default Page;
