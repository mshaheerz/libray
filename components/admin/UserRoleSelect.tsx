"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserRole } from "@/lib/actions/admin/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  initialRole: "USER" | "ADMIN";
}

const UserRoleSelect = ({ userId, initialRole }: Props) => {
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (newRole: "USER" | "ADMIN") => {
    if (newRole === role) return;

    setLoading(true);
    try {
      const result = await updateUserRole(userId, newRole);
      if (result.success) {
        toast.success(result.message);
        setRole(newRole);
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
      onValueChange={(value) => handleRoleChange(value as "USER" | "ADMIN")}
      defaultValue={role}
      disabled={loading}
    >
      <SelectTrigger
        className={cn(
          "w-28 h-8 rounded-full px-3 py-1 text-xs font-semibold border-none focus:ring-0",
          role === "ADMIN"
            ? "bg-green-100 text-green-700"
            : "bg-pink-100 text-pink-700"
        )}
      >
        <SelectValue placeholder="Select Role" />
      </SelectTrigger>
      <SelectContent className="bg-white">
        <SelectItem
          value="USER"
          className="text-pink-700 focus:bg-pink-50 focus:text-pink-700 cursor-pointer"
        >
          USER
        </SelectItem>
        <SelectItem
          value="ADMIN"
          className="text-green-700 focus:bg-green-50 focus:text-green-700 cursor-pointer"
        >
          ADMIN
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default UserRoleSelect;
