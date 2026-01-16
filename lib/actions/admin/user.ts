"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const deleteUser = async (id: string) => {
  try {
    await db.delete(users).where(eq(users.id, id));

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while deleting the user",
    };
  }
};

export const updateUserRole = async (id: string, role: "USER" | "ADMIN") => {
  try {
    await db.update(users).set({ role }).where(eq(users.id, id));

    return {
      success: true,
      message: "User role updated successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while updating user role",
    };
  }
};

export const updateUserStatus = async (
  id: string,
  status: "APPROVED" | "REJECTED"
) => {
  try {
    await db.update(users).set({ status }).where(eq(users.id, id));

    return {
      success: true,
      message: `User ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while updating user status",
    };
  }
};
