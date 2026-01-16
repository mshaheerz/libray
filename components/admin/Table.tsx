import React from "react";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

const Table = <T extends object>({ columns, data, className }: Props<T>) => {
  return (
    <div
      className={`w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-dark-600 ${className}`}
    >
      <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
        <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-600 border-b border-slate-200 dark:bg-dark-200 dark:text-light-500 dark:border-dark-600">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                className={`px-6 py-4 font-semibold ${col.className}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white dark:divide-dark-600 dark:bg-dark-100">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors hover:bg-slate-50/50 dark:hover:bg-dark-300"
              >
                {columns.map((col, colIndex) => {
                  const value =
                    typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode);

                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 font-medium text-dark-400 dark:text-light-400 ${col.className}`}
                    >
                      {value ?? (
                        <span className="text-slate-300 dark:text-slate-600">
                          -
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-20 text-center text-slate-400 dark:text-slate-600"
              >
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
