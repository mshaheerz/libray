import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import '@/styles/admin.css'


async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) redirect("/");
  return (
    <main className="flex min-h-screen w-full flex-row">
      <div>Sidebar</div>
      <div className="admin-container">
        <p>
          <p>Header</p>
          {children}
        </p>
      </div>
    </main>
  );
}

export default Layout;
