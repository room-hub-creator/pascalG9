import { useMemo } from "react";
import { buildPascalRows } from "@/lib/binomial";
import { cn } from "@/lib/utils";

interface PascalTriangleProps {
  rows: number;
  highlightN?: number;
  highlightR?: number;
}

export const PascalTriangle = ({ rows, highlightN, highlightR }: PascalTriangleProps) => {
  const triangle = useMemo(() => buildPascalRows(Math.min(rows, 20)), [rows]);

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex flex-col items-center gap-1.5 min-w-fit">
        {triangle.map((row, n) => (
          <div key={n} className="flex gap-1.5">
            {row.map((value, r) => {
              const isHighlight = n === highlightN && r === highlightR;
              return (
                <div
                  key={r}
                  className={cn(
                    "min-w-[2.5rem] px-2 py-1 rounded-md text-center text-xs sm:text-sm font-mono font-medium",
                    "bg-card border border-border shadow-[var(--shadow-cell)] transition-[var(--transition-smooth)]",
                    isHighlight &&
                      "bg-primary text-primary-foreground border-primary scale-110 shadow-[var(--shadow-elegant)]",
                  )}
                >
                  {value.toString()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
