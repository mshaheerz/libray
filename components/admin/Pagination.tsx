"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4 mt-4 border-t border-slate-100 dark:border-dark-600">
      <p className="text-sm text-slate-500 dark:text-light-500">
        Page{" "}
        <span className="font-medium text-dark-400 dark:text-light-400">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-medium text-dark-400 dark:text-light-400">
          {totalPages}
        </span>
      </p>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-white dark:bg-dark-200 dark:text-light-500 dark:border-dark-600 dark:hover:bg-dark-300"
        >
          <ChevronLeft className="size-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-white dark:bg-dark-200 dark:text-light-500 dark:border-dark-600 dark:hover:bg-dark-300"
        >
          Next
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
