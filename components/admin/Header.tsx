"use client";

import { Session } from "next-auth";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = ({ session }: { session: Session }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const currentQuery = searchParams.get("query") || "";
      if (query === currentQuery) return;

      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("query", query);
      } else {
        params.delete("query");
      }
      router.push(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, router, searchParams]);

  return (
    <header className="admin-header flex flex-row items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-dark-400 dark:text-light-400">
          {session?.user?.name}
        </h2>
        <p className="text-base text-slate-500">
          Monitor all of your users and books here
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="admin-search">
          <Search className="size-4 text-slate-400" />
          <Input
            placeholder="Search users, books, etc..."
            className="admin-search_input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
