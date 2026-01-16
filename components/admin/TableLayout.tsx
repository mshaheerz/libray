import React from "react";

interface Props {
  children: React.ReactNode;
}

const TableLayout = ({ children }: Props) => {
  return (
    <section className="w-full rounded-2xl bg-white p-7 shadow-sm dark:bg-dark-100 dark:border dark:border-dark-600">
      {children}
    </section>
  );
};

export default TableLayout;
