import { db } from "@/database/drizzle";
import { borrowRecords, books, users } from "@/database/schema";
import TableLayout from "@/components/admin/TableLayout";
import TableHeader from "@/components/admin/TableHeader";
import Table, { Column } from "@/components/admin/Table";
import { desc, asc, ilike, or, count, eq } from "drizzle-orm";
import Pagination from "@/components/admin/Pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { ImageKitProvider, Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";
import dayjs from "dayjs";
import { FileDown } from "lucide-react";
import BorrowStatusSelect from "@/components/admin/BorrowStatusSelect";
import ReceiptButton from "@/components/ReceiptButton";

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

  const [records, totalCountRes] = await Promise.all([
    db
      .select({
        id: borrowRecords.id,
        status: borrowRecords.status,
        borrowDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
        dueDate: borrowRecords.dueDate,
        bookTitle: books.title,
        bookThumbnail: books.coverUrl,
        bookAuthor: books.author,
        bookGenre: books.genre,
        userName: users.fullName,
        userEmail: users.email,
        userAvatar: users.fullName,
        userCard: users.universityCard,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(
        query
          ? or(
              ilike(books.title, `%${query}%`),
              ilike(users.fullName, `%${query}%`),
              ilike(users.email, `%${query}%`)
            )
          : undefined
      )
      .orderBy(
        sort === "oldest"
          ? asc(borrowRecords.borrowDate)
          : desc(borrowRecords.borrowDate)
      )
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .where(
        query
          ? or(
              ilike(books.title, `%${query}%`),
              ilike(users.fullName, `%${query}%`),
              ilike(users.email, `%${query}%`)
            )
          : undefined
      ),
  ]);

  const totalCount = totalCountRes[0].count;
  const totalPages = Math.ceil(totalCount / limit);

  type RecordRow = (typeof records)[0];

  const columns: Column<RecordRow>[] = [
    {
      header: "Book",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative size-10 overflow-hidden rounded-lg bg-slate-100">
            <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
              <IKImage
                src={row.bookThumbnail}
                alt={row.bookTitle}
                fill
                className="object-cover"
              />
            </ImageKitProvider>
          </div>
          <p className="font-semibold text-dark-400 dark:text-light-400 line-clamp-1">
            {row.bookTitle}
          </p>
        </div>
      ),
    },
    {
      header: "User Requested",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-amber-100 text-amber-700">
              {getInitials(row.userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-dark-400 dark:text-light-400 line-clamp-1">
              {row.userName}
            </p>
            <p className="text-xs text-slate-500 font-normal">
              {row.userEmail}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row) => (
        <BorrowStatusSelect
          recordId={row.id}
          initialStatus={row.status}
          dueDate={row.dueDate}
        />
      ),
    },
    {
      header: "Borrowed Date",
      accessor: (row) => dayjs(row.borrowDate).format("MMM DD, YYYY"),
    },
    {
      header: "Return Date",
      accessor: (row) =>
        row.returnDate ? dayjs(row.returnDate).format("MMM DD, YYYY") : "-",
    },
    {
      header: "Due Date",
      accessor: (row) => dayjs(row.dueDate).format("MMM DD, YYYY"),
    },
    {
      header: "Receipt",
      accessor: (row) =>
        row.status === "BORROWED" ? (
          <div className="w-fit">
            <ReceiptButton
              book={{
                title: row.bookTitle,
                author: row.bookAuthor,
                genre: row.bookGenre,
              }}
              borrowDate={dayjs(row.borrowDate).toISOString()}
              dueDate={dayjs(row.dueDate).toISOString()}
              receiptId={row.id}
              userName={row.userName}
              buttonText="Generate"
              icon={<FileDown className="mr-1 size-4" />}
              className="book-receipt_admin-btn"
            />
          </div>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <TableLayout>
      <TableHeader title="Borrow Book Requests" showSortable={true} />
      <div className="mt-7 w-full overflow-hidden">
        <Table columns={columns} data={records} />
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </TableLayout>
  );
}

export default Page;
