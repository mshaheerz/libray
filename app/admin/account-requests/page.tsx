import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import TableLayout from "@/components/admin/TableLayout";
import TableHeader from "@/components/admin/TableHeader";
import Table, { Column } from "@/components/admin/Table";
import { desc, asc, ilike, or, count, eq, and } from "drizzle-orm";
import Pagination from "@/components/admin/Pagination";
import dayjs from "dayjs";
import ViewIdCard from "@/components/admin/ViewIdCard";
import AccountRequestActions from "@/components/admin/AccountRequestActions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

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

  // We only want users who are PENDING for this page
  const [pendingUsers, totalCountRes] = await Promise.all([
    db
      .select()
      .from(users)
      .where(
        and(
          eq(users.status, "PENDING"),
          query
            ? or(
                ilike(users.fullName, `%${query}%`),
                ilike(users.email, `%${query}%`)
              )
            : undefined
        )
      )
      .orderBy(
        sort === "oldest"
          ? asc(users.createdAt)
          : sort === "name_asc"
            ? asc(users.fullName)
            : sort === "name_desc"
              ? desc(users.fullName)
              : desc(users.createdAt)
      )
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(users)
      .where(
        and(
          eq(users.status, "PENDING"),
          query
            ? or(
                ilike(users.fullName, `%${query}%`),
                ilike(users.email, `%${query}%`)
              )
            : undefined
        )
      ),
  ]);

  const totalCount = totalCountRes[0].count;
  const totalPages = Math.ceil(totalCount / limit);

  type UserRow = (typeof pendingUsers)[0];

  const columns: Column<UserRow>[] = [
    {
      header: "Name",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-amber-100 text-amber-700">
              {getInitials(row.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-dark-400 dark:text-light-400">
              {row.fullName}
            </p>
            <p className="text-xs text-slate-500 font-normal">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Date Joined",
      accessor: (row) => dayjs(row.createdAt).format("MMM DD, YYYY"),
    },
    {
      header: "University ID No",
      accessor: "universityId",
    },
    {
      header: "University ID Card",
      accessor: (row) => (
        <ViewIdCard userName={row.fullName} idCardUrl={row.universityCard} />
      ),
    },
    {
      header: "Action",
      accessor: (row) => <AccountRequestActions userId={row.id} />,
    },
  ];

  return (
    <TableLayout>
      <TableHeader title="Account Registration Requests" showSortable={true} />
      <div className="mt-7 w-full overflow-hidden">
        <Table columns={columns} data={pendingUsers} />
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </TableLayout>
  );
}

export default Page;
