"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords } from "@/database/schema";
import { eq, sql } from "drizzle-orm";
import dayjs from "dayjs";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({ availableCopies: books.availableCopies })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0) {
      return {
        success: false,
        error: "Book is not available for borrowing",
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};

export const updateBorrowStatus = async (
  recordId: string,
  status: "BORROWED" | "RETURNED"
) => {
  try {
    const record = await db
      .select()
      .from(borrowRecords)
      .where(eq(borrowRecords.id, recordId))
      .limit(1);

    if (!record.length) return { success: false, error: "Record not found" };
    if (record[0].status === status) return { success: true };

    await db
      .update(borrowRecords)
      .set({
        status,
        returnDate: status === "RETURNED" ? dayjs().format("YYYY-MM-DD") : null,
      })
      .where(eq(borrowRecords.id, recordId));

    if (status === "RETURNED") {
      await db
        .update(books)
        .set({ availableCopies: sql`${books.availableCopies} + 1` })
        .where(eq(books.id, record[0].bookId));
    } else {
      await db
        .update(books)
        .set({ availableCopies: sql`${books.availableCopies} - 1` })
        .where(eq(books.id, record[0].bookId));
    }

    return { success: true, message: "Status updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to update status" };
  }
};
