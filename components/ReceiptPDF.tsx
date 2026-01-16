"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Receipt from "./Receipt";
import { Button } from "./ui/button";

interface Props {
  book: {
    title: string;
    author: string;
    genre: string;
  };
  borrowDate: string;
  dueDate: string;
  receiptId: string;
  userName: string;
  className?: string;
  buttonText?: string;
  icon?: React.ReactNode;
}

const ReceiptPDF = ({
  book,
  borrowDate,
  dueDate,
  receiptId,
  userName,
  className,
  buttonText = "Download Receipt",
  icon,
}: Props) => {
  return (
    <PDFDownloadLink
      document={
        <Receipt
          book={book}
          borrowDate={borrowDate}
          dueDate={dueDate}
          receiptId={receiptId}
          userName={userName}
        />
      }
      fileName={`Receipt_${book.title.replace(/\s+/g, "_")}.pdf`}
      className="w-full"
    >
      {/* @ts-expect-error - PDFDownloadLink types are complex */}
      {({ loading }: { loading: boolean }) => (
        <Button className={className}>
          {icon}
          {loading ? "Generating..." : buttonText}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default ReceiptPDF;
