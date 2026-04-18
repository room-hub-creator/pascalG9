import { Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

export type Section = "calculator" | "expansion" | "tutor" | "history" | "blueprint";

interface SiteHeaderProps {
  active: Section;
  onChange: (s: Section) => void;
}

const NAV: Array<{ id: Section; label: string }> = [
  { id: "calculator", label: "Calculator" },
  { id: "expansion", label: "Expansion" },
  { id: "tutor", label: "Tutor" },
  { id: "history", label: "History" },
  { id: "blueprint", label: "Blueprint" },
];

export const SiteHeader = ({ active, onChange }: SiteHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => onChange("calculator")}
          className="flex items-center gap-3 group"
          aria-label="Pascal Coefficients home"
        >
          <div className="h-10 w-10 rounded-xl bg-[var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)] transition-[var(--transition-smooth)] group-hover:scale-105">
            <Sigma className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="text-left leading-tight">
            <div className="font-bold text-base">Pascal</div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Coefficients
            </div>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-[var(--transition-smooth)]",
                active === item.id
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile select */}
        <select
          aria-label="Section"
          className="md:hidden bg-secondary border border-border rounded-lg px-3 py-2 text-sm"
          value={active}
          onChange={(e) => onChange(e.target.value as Section)}
        >
          {NAV.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};
