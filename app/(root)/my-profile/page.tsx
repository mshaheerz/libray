import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { Button } from "@/components/ui/button";
import { sampleBooks } from "@/constants";
import React from "react";

function MyProfilePage() {
  return (
    <>
      <form action={async () => {
        "use server";

        await signOut();
      }}>
        <Button type="submit">Logout</Button>
      </form>
      <BookList title="My Books" books={sampleBooks} />
    </>
  );
}

export default MyProfilePage;
