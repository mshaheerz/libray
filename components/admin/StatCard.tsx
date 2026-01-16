import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  count: number;
  trend: number;
  isIncrease: boolean;
}

const StatCard = ({ title, count, trend, isIncrease }: Props) => {
  return (
    <div className="stat">
      <div className="stat-info">
        <p className="stat-label">{title}</p>
        <div className="flex items-center gap-1">
          <p
            className={cn(
              "text-xs font-bold",
              isIncrease ? "text-green-500" : "text-orange-500"
            )}
          >
            {isIncrease ? "▲" : "▼"} {trend}
          </p>
        </div>
      </div>
      <p className="stat-count">{count.toLocaleString()}</p>
    </div>
  );
};

export default StatCard;
