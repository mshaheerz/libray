import React from "react";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { count, desc, eq } from "drizzle-orm";
import StatCard from "@/components/admin/StatCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Calendar, User } from "lucide-react";
import { ImageKitProvider, Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const Page = async () => {
  const session = await auth();

  const [
    totalBooksRes,
    totalUsersRes,
    borrowedBooksRes,
    recentBooks,
    borrowRequests,
    accountRequests,
  ] = await Promise.all([
    db.select({ count: count() }).from(books),
    db.select({ count: count() }).from(users),
    db
      .select({ count: count() })
      .from(borrowRecords)
      .where(eq(borrowRecords.status, "BORROWED")),
    db.select().from(books).orderBy(desc(books.createdAt)).limit(6),
    db
      .select({
        id: borrowRecords.id,
        status: borrowRecords.status,
        borrowDate: borrowRecords.borrowDate,
        bookTitle: books.title,
        bookThumbnail: books.coverUrl,
        bookGenre: books.genre,
        userName: users.fullName,
        userAvatar: users.fullName,
      })
      .from(borrowRecords)
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(6),
    db
      .select()
      .from(users)
      .where(eq(users.status, "PENDING"))
      .orderBy(desc(users.createdAt))
      .limit(6),
  ]);

  const stats = [
    {
      title: "Borrowed Books",
      count: borrowedBooksRes[0].count,
      trend: 2,
      isIncrease: false,
    },
    {
      title: "Total Users",
      count: totalUsersRes[0].count,
      trend: 4,
      isIncrease: true,
    },
    {
      title: "Total Books",
      count: totalBooksRes[0].count,
      trend: 2,
      isIncrease: true,
    },
  ];

  return (
    <section className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-dark-400 dark:text-light-400">
          Welcome, {session?.user?.name || "Admin"}
        </h1>
        <p className="text-base text-light-500 font-medium">
          Monitor all of your projects and tasks here
        </p>
      </div>

      {/* Stats Section */}
      <div className="flex flex-wrap gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column (Borrow & Account Requests) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          {/* Borrow Requests */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-400 dark:text-light-400">
                Borrow Requests
              </h2>
              <Button asChild variant="ghost" className="view-btn">
                <Link href="/admin/book-requests">View all</Link>
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {borrowRequests.map((request) => (
                <div
                  key={request.id}
                  className="book-stripe group dark:bg-dark-300!"
                >
                  <div className="relative size-20 overflow-hidden rounded-lg bg-white shadow-sm dark:bg-dark-200">
                    <ImageKitProvider
                      urlEndpoint={config.env.imagekit.urlEndpoint}
                    >
                      <IKImage
                        src={request.bookThumbnail}
                        alt={request.bookTitle}
                        fill
                        className="object-cover"
                      />
                    </ImageKitProvider>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="title dark:text-light-400!">
                        {request.bookTitle}
                      </h3>
                      <div className="author">
                        <p>By {request.userName}</p>
                        <div />
                        <p>{request.bookGenre}</p>
                      </div>
                    </div>

                    <div className="user">
                      <div className="avatar">
                        <User className="size-3 text-light-500" />
                        <p>{request.userName}</p>
                      </div>
                      <div className="borrow-date">
                        <Calendar className="size-3 text-light-500" />
                        <p>{dayjs(request.borrowDate).format("DD/MM/YY")}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="view-btn self-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Link href="/admin/book-requests">
                      <Eye className="size-5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Account Requests */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-dark-400 dark:text-light-400">
                Account Requests
              </h2>
              <Button asChild variant="ghost" className="view-btn">
                <Link href="/admin/account-requests">View all</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {accountRequests.map((request) => (
                <div
                  key={request.id}
                  className="user-card border border-light-700 bg-white dark:bg-dark-300 dark:border-dark-600"
                >
                  <Avatar className="size-12 shadow-sm">
                    <AvatarFallback className="bg-amber-100 text-amber-700 text-lg">
                      {getInitials(request.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="name">{request.fullName}</p>
                  <p className="email">{request.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Recently Added Books) */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark-400 dark:text-light-400">
              Recently Added Books
            </h2>
            <Button asChild variant="ghost" className="view-btn">
              <Link href="/admin/books">View all</Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/admin/books/new"
              className="add-new-book_btn border-2 border-dashed border-light-400 hover:bg-light-300 transform transition-transform hover:scale-[1.02] dark:border-dark-600 dark:hover:bg-dark-300"
            >
              <div>
                <Plus className="size-6 text-dark-400 dark:text-light-400" />
              </div>
              <p className="dark:text-light-400">Add New Book</p>
            </Link>

            {recentBooks.map((book) => (
              <div
                key={book.id}
                className="book-stripe bg-white border border-light-700 dark:bg-dark-300 dark:border-dark-600"
              >
                <div className="relative size-16 overflow-hidden rounded-lg bg-light-300">
                  <ImageKitProvider
                    urlEndpoint={config.env.imagekit.urlEndpoint}
                  >
                    <IKImage
                      src={book.coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </ImageKitProvider>
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h3 className="title font-bold text-sm">{book.title}</h3>
                  <div className="author">
                    <p className="text-xs">By {book.author}</p>
                    <div />
                    <p className="text-xs">{book.genre}</p>
                  </div>
                  <div className="borrow-date">
                    <Calendar className="size-3 text-light-500" />
                    <p className="text-[10px]">
                      {dayjs(book.createdAt).format("DD/MM/YY")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
