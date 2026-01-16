import { auth } from "@/auth";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq } from "drizzle-orm";

async function MyProfilePage() {
  const session = await auth();
  const borrowedBooks = await db
    .select()
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session?.user?.id as string));

  const boo = borrowedBooks?.map((book) => book.books);
  return (
    <>
      <BookList from="borrowed" title="My Books " books={boo as Book[]} />
    </>
  );
}

export default MyProfilePage;
