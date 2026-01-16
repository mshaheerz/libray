"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";

// Isolation: Dynamically import the entire PDF component with SSR disabled
const PDFComponent = dynamic(() => import("./ReceiptPDF"), {
  ssr: false,
});

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

const ReceiptButton = (props: Props) => {
  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const fallback = (
    <Button className={props.className} disabled>
      {props.icon}
      {props.buttonText || "Download Receipt"}
    </Button>
  );

  if (!isMounted) {
    return fallback;
  }

  return (
    <React.Suspense fallback={fallback}>
      <PDFComponent {...props} />
    </React.Suspense>
  );
};

export default ReceiptButton;
