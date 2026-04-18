import { useMemo } from "react";
import { buildPascalRows, shortBigInt } from "@/lib/binomial";
import { cn } from "@/lib/utils";

interface PascalTriangleProps {
  rows: number;
  highlightN?: number;
  highlightR?: number;
  mode?: "interactive" | "heatmap";
}

export const PascalTriangle = ({
  rows,
  highlightN,
  highlightR,
  mode = "interactive",
}: PascalTriangleProps) => {
  const max = Math.max(1, Math.min(rows, 20));
  const triangle = useMemo(() => buildPascalRows(max), [max]);

  // For heatmap: compute log10 of max value in last row for normalization.
  const maxLog = useMemo(() => {
    const last = triangle[triangle.length - 1];
    const m = last.reduce((acc, v) => (v > acc ? v : acc), 0n);
    return Math.max(1, m.toString().length);
  }, [triangle]);

  return (
    <div className="overflow-x-auto py-4">
      <div className="flex flex-col items-center gap-1.5 min-w-fit mx-auto">
        {triangle.map((row, n) => (
          <div key={n} className="flex gap-1.5">
            {row.map((value, r) => {
              const isHighlight = n === highlightN && r === highlightR;
              const intensity =
                mode === "heatmap" ? Math.min(1, value.toString().length / maxLog) : 0;
              const heatStyle =
                mode === "heatmap"
                  ? {
                      background: `linear-gradient(135deg, hsl(199 95% ${
                        70 - intensity * 35
                      }% / ${0.15 + intensity * 0.7}), hsl(80 90% ${
                        65 - intensity * 25
                      }% / ${0.15 + intensity * 0.6}))`,
                      borderColor: `hsl(199 80% ${60 - intensity * 20}% / ${
                        0.3 + intensity * 0.4
                      })`,
                    }
                  : undefined;
              return (
                <div
                  key={r}
                  style={heatStyle}
                  className={cn(
                    "min-w-[2.5rem] px-2 py-1.5 rounded-lg text-center text-[11px] sm:text-xs font-mono font-semibold",
                    "border border-border bg-secondary/50 transition-[var(--transition-smooth)]",
                    mode === "interactive" &&
                      "hover:bg-primary/10 hover:border-primary/40 hover:scale-105",
                    isHighlight &&
                      "bg-[var(--gradient-primary)] text-primary-foreground border-primary scale-110 shadow-[var(--shadow-glow)] z-10",
                  )}
                  title={`C(${n}, ${r}) = ${value.toString()}`}
                >
                  {shortBigInt(value, 4, 4)}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
