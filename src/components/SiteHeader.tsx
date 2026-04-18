import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export type Section = "calculator" | "expansion" | "tutor" | "history" | "documentation" | "contributors";

interface SiteHeaderProps {
  active: Section;
  onChange: (s: Section) => void;
}

const NAV: Array<{ id: Section; label: string }> = [
  { id: "calculator", label: "Calculator" },
  { id: "expansion", label: "Expansion" },
  { id: "tutor", label: "Tutor" },
  { id: "history", label: "History" },
  { id: "documentation", label: "Docs" },
  { id: "contributors", label: "Group" },
];

export const SiteHeader = ({ active, onChange }: SiteHeaderProps) => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo Left */}
        <button
          onClick={() => onChange("calculator")}
          className="flex items-center gap-2 group"
        >
          <div className="font-black text-2xl tracking-tighter text-primary">PASCAL</div>
          <div className="hidden sm:block h-6 w-[1px] bg-border/50 mx-2" />
          <div className="hidden sm:block text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-black">Binomial Engine</div>
        </button>

        {/* Nav Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="hidden lg:flex items-center gap-2 mr-6">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={cn(
                  "px-4 py-2 text-[15px] font-bold rounded-xl transition-all",
                  active === item.id
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex lg:hidden items-center mr-2">
             <select 
               value={active} 
               onChange={(e) => onChange(e.target.value as Section)}
               className="bg-secondary/80 border-border text-[12px] font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-primary"
             >
                {NAV.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
             </select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-11 w-11 rounded-xl border-border/60 bg-secondary/30 hover:bg-secondary/80 transition-transform active:scale-95"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
};
