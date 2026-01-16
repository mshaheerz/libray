import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { eq, desc } from "drizzle-orm";
import React from "react";
import { Calendar, Mail, BookOpen, GraduationCap } from "lucide-react";
import dayjs from "dayjs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getInitials } from "@/lib/utils";
import BookCover from "@/components/BookCover";
import { Button } from "@/components/ui/button";
import { ImageKitProvider, Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";
import ReceiptButton from "@/components/ReceiptButton";

async function MyProfilePage() {
  const session = await auth();

  const [userData] = await db
    .select()
    .from(users)
    .where(eq(users.id, session?.user?.id as string))
    .limit(1);

  const borrowedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      genre: books.genre,
      coverColor: books.coverColor,
      coverUrl: books.coverUrl,
      author: books.author,
      borrowDate: borrowRecords.borrowDate,
      dueDate: borrowRecords.dueDate,
      status: borrowRecords.status,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(eq(borrowRecords.userId, session?.user?.id as string))
    .orderBy(desc(borrowRecords.borrowDate));

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Profile Header Card */}
      <div className="gradient-vertical relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl border border-light-100/10">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <Avatar className="size-32 md:size-40 border-4 border-primary shadow-xl">
            <AvatarFallback className="bg-amber-100 text-amber-700 text-3xl font-bold">
              {getInitials(userData?.fullName || "User")}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-4 flex-1">
            <div className="inline-flex w-fit mx-auto md:mx-0 items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                {userData?.status}
              </p>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {userData?.fullName}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex items-center gap-3 text-light-100">
                <div className="p-2 rounded-lg bg-dark-300">
                  <Mail className="size-5 text-primary" />
                </div>
                <p className="text-sm md:text-base font-medium">
                  {userData?.email}
                </p>
              </div>
              <div className="flex items-center gap-3 text-light-100">
                <div className="p-2 rounded-lg bg-dark-300">
                  <GraduationCap className="size-5 text-primary" />
                </div>
                <p className="text-sm md:text-base font-medium">
                  ID: {userData?.universityId}
                </p>
              </div>
              <div className="flex items-center gap-3 text-light-100">
                <div className="p-2 rounded-lg bg-dark-300">
                  <Calendar className="size-5 text-primary" />
                </div>
                <p className="text-sm md:text-base font-medium italic">
                  Joined {dayjs(userData?.createdAt).format("MMMM YYYY")}
                </p>
              </div>
              <div className="flex items-center gap-3 text-light-100">
                <div className="p-2 rounded-lg bg-dark-300">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <p className="text-sm md:text-base font-medium">
                  {borrowedBooks.length} Books Borrowed
                </p>
              </div>
            </div>
          </div>

          {/* University ID Card Mini-Preview */}
          <div className="hidden lg:block w-72 h-44 gradient-gray rounded-2xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer relative">
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
              <p className="text-white font-semibold flex items-center gap-2 underline">
                Click to enlarge
              </p>
            </div>
            <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
              <IKImage
                src={userData?.universityCard || ""}
                alt="University ID"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </ImageKitProvider>
          </div>
        </div>

        {/* Background Decorative element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 size-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Borrowed Books Custom List */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-light-100/10 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="size-8 text-primary" />
            Your Borrowed Books
          </h2>
          <p className="text-light-100 font-medium bg-dark-300 px-4 py-1 rounded-full border border-white/5">
            {borrowedBooks.length} Total
          </p>
        </div>

        {borrowedBooks.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {borrowedBooks.map((book) => (
              <div
                key={book.id}
                className="gradient-vertical flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-light-100/5 hover:border-primary/30 transition-all group"
              >
                <div className="relative mx-auto sm:mx-0 shadow-2xl">
                  <BookCover
                    variant="regular"
                    coverColor={book.coverColor}
                    coverImage={book.coverUrl}
                  />
                </div>

                <div className="flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-2xl font-bold text-white line-clamp-2">
                        {book.title}
                      </h3>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shrink-0",
                          book.status === "BORROWED"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-green-500/10 text-green-400 border border-green-500/20"
                        )}
                      >
                        {book.status}
                      </span>
                    </div>
                    <p className="text-light-100/60 font-medium italic">
                      {book.genre}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-light-100 bg-dark-300/50 p-3 rounded-xl border border-white/5">
                      <Calendar className="size-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-light-500">
                          Borrowed On
                        </span>
                        <span className="font-semibold">
                          {dayjs(book.borrowDate).format("MMM DD, YYYY")}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-white/10 mx-2" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-light-500">
                          Due Date
                        </span>
                        <span className="font-semibold text-red-400">
                          {dayjs(book.dueDate).format("MMM DD, YYYY")}
                        </span>
                      </div>
                    </div>

                    <ReceiptButton
                      book={{
                        title: book.title,
                        author: book.author,
                        genre: book.genre,
                      }}
                      borrowDate={dayjs(book.borrowDate).toISOString()}
                      dueDate={dayjs(book.dueDate).toISOString()}
                      receiptId={book.id}
                      userName={userData?.fullName || "User"}
                      className="w-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-dark-100 font-bold transition-all py-6 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-dark-300/30 rounded-3xl border border-dashed border-white/10">
            <div className="size-20 rounded-full bg-dark-300 flex items-center justify-center mb-4">
              <BookOpen className="size-10 text-light-500" />
            </div>
            <p className="text-light-100 text-lg">
              You haven&apos;t borrowed any books yet.
            </p>
            <Button variant="link" className="text-primary mt-2">
              Explore the Library
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProfilePage;
