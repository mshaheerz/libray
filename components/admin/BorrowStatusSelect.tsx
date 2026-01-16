"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBorrowStatus } from "@/lib/actions/book";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface Props {
  recordId: string;
  initialStatus: "BORROWED" | "RETURNED";
  dueDate: string;
}

const BorrowStatusSelect = ({ recordId, initialStatus, dueDate }: Props) => {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isLate =
    status === "BORROWED" && dayjs(dueDate).isBefore(dayjs(), "day");
  const displayStatus = isLate ? "LATE RETURN" : status;

  const handleStatusChange = async (newStatus: "BORROWED" | "RETURNED") => {
    if (newStatus === status) return;

    setLoading(true);
    try {
      const result = await updateBorrowStatus(recordId, newStatus);
      if (result.success) {
        toast.success(result.message || "Status updated successfully");
        setStatus(newStatus);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select
      onValueChange={(value) =>
        handleStatusChange(value as "BORROWED" | "RETURNED")
      }
      defaultValue={status}
      disabled={loading}
    >
      <SelectTrigger
        className={cn(
          "w-36 h-8 rounded-full px-3 py-1 text-xs font-semibold border-none focus:ring-0 uppercase",
          status === "RETURNED"
            ? "bg-green-100 text-green-700"
            : isLate
              ? "bg-red-100 text-red-700"
              : "bg-blue-50 text-blue-700"
        )}
      >
        <SelectValue placeholder="Select Status">{displayStatus}</SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem
          value="BORROWED"
          className="text-blue-700 focus:bg-blue-50 focus:text-blue-700 cursor-pointer uppercase"
        >
          Borrowed
        </SelectItem>
        <SelectItem
          value="RETURNED"
          className="text-green-700 focus:bg-green-50 focus:text-green-700 cursor-pointer uppercase"
        >
          Returned
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default BorrowStatusSelect;
