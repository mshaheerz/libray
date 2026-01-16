import { db } from "@/database/drizzle";
import { books as booksDb } from "@/database/schema";
import TableLayout from "@/components/admin/TableLayout";
import TableHeader from "@/components/admin/TableHeader";
import Table, { Column } from "@/components/admin/Table";
import { desc, asc, ilike, or, count } from "drizzle-orm";
import Pagination from "@/components/admin/Pagination";
import BookActions from "@/components/admin/BookActions";

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const query = (params.query as string) || "";
  const sort = (params.sort as string) || "newest";
  const page = Number(params.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Get data and total count for pagination
  const [books, totalCountRes] = await Promise.all([
    db
      .select({
        id: booksDb.id,
        title: booksDb.title,
        author: booksDb.author,
        genre: booksDb.genre,
        rating: booksDb.rating,
        totalCopies: booksDb.totalCopies,
        availableCopies: booksDb.availableCopies,
        description: booksDb.description,
        coverColor: booksDb.coverColor,
        coverUrl: booksDb.coverUrl,
        videoUrl: booksDb.videoUrl,
        summary: booksDb.summary,
        createdAt: booksDb.createdAt,
      })
      .from(booksDb)
      .where(
        query
          ? or(
              ilike(booksDb.title, `%${query}%`),
              ilike(booksDb.author, `%${query}%`)
            )
          : undefined
      )
      .orderBy(
        sort === "oldest"
          ? asc(booksDb.createdAt)
          : sort === "name_asc"
            ? asc(booksDb.title)
            : sort === "name_desc"
              ? desc(booksDb.title)
              : desc(booksDb.createdAt)
      )
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(booksDb)
      .where(
        query
          ? or(
              ilike(booksDb.title, `%${query}%`),
              ilike(booksDb.author, `%${query}%`)
            )
          : undefined
      ),
  ]);

  const totalCount = totalCountRes[0].count;
  const totalPages = Math.ceil(totalCount / limit);

  type BookRow = (typeof books)[0];

  const columns: Column<BookRow>[] = [
    {
      header: "Book Title",
      accessor: "title",
      className: "font-semibold text-dark-400 dark:text-light-400",
    },
    {
      header: "Author",
      accessor: "author",
    },
    {
      header: "Genre",
      accessor: "genre",
    },
    {
      header: "Date Created",
      accessor: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },
    {
      header: "Actions",
      accessor: (row) => <BookActions book={row as unknown as Book} />,
    },
  ];

  return (
    <TableLayout>
      <TableHeader
        title="All Books"
        buttonText="Create a New Book"
        buttonLink="/admin/books/new"
        showSortable={true}
      />
      <div className="mt-7 w-full overflow-hidden">
        <Table columns={columns} data={books} />
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </TableLayout>
  );
}

export default Page;
