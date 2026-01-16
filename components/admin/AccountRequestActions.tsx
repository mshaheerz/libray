"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserStatus } from "@/lib/actions/admin/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  userId: string;
}

const AccountRequestActions = ({ userId }: Props) => {
  const [loading, setLoading] = useState<"APPROVING" | "REJECTING" | null>(
    null
  );
  const router = useRouter();

  const handleStatusUpdate = async (status: "APPROVED" | "REJECTED") => {
    setLoading(status === "APPROVED" ? "APPROVING" : "REJECTING");
    try {
      const result = await updateUserStatus(userId, status);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
        onClick={() => handleStatusUpdate("APPROVED")}
        disabled={!!loading}
      >
        <Check className="size-4 mr-1" />
        {loading === "APPROVING" ? "Approving..." : "Approve"}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => handleStatusUpdate("REJECTED")}
        disabled={!!loading}
      >
        <X className="size-4 mr-1" />
        {loading === "REJECTING" ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
};

export default AccountRequestActions;
