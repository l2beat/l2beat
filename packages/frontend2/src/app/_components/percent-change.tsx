import React from "react";

import { TrendArrowDownIcon, TrendArrowUpIcon } from "~/icons/trend-arrow";
import { cn } from "~/utils/cn";

interface Props {
  value: string;
  className?: string;
}

export function PercentChange({ value, className }: Props) {
  const isMore = value.startsWith("+");
  const isLess = value.startsWith("-");

  return (
    <span
      className={cn(
        isMore && "text-green-300 dark:text-green-450",
        isLess && "text-red-300",
        "relative",
        className
      )}
    >
      {isMore && (
        <TrendArrowUpIcon className="-translate-y-1/2 absolute top-1/2" />
      )}
      {isLess && (
        <TrendArrowDownIcon className="-translate-y-1/2 absolute top-1/2" />
      )}
      <span className="relative pl-3.5">{value.substring(1)}</span>
    </span>
  );
}
