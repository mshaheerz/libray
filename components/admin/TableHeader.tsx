"use client";

import React from "react";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  title: string;
  description?: string;
  showSortable?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

const TableHeader = ({
  title,
  description,
  showSortable = false,
  buttonText,
  buttonLink,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", newSort);
    router.push(`?${params.toString()}`);
  };

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Name (A-Z)", value: "name_asc" },
    { label: "Name (Z-A)", value: "name_desc" },
  ];

  const activeSortLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label || "Newest";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold text-dark-400 dark:text-light-400">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {showSortable && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 outline-none dark:border-dark-600 dark:bg-dark-200 dark:text-light-500 dark:hover:bg-dark-300">
                <ListFilter className="size-4 shrink-0" />
                <span>Sort by: {activeSortLabel}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-white dark:bg-dark-100 dark:border-dark-600 dark:text-light-400"
              align="end"
            >
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className="cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-300"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {buttonText && buttonLink && (
          <Button
            className="bg-primary-admin text-white hover:bg-primary-admin/90"
            asChild
          >
            <Link href={buttonLink}>+ {buttonText}</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableHeader;
