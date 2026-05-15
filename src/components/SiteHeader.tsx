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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo Left */}
        <button
          onClick={() => onChange("calculator")}
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="bg-primary p-1.5 rounded-lg shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 20H22L12 2Z" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
              <circle cx="12" cy="7" r="1" fill="currentColor"/>
              <circle cx="9" cy="12" r="1" fill="currentColor"/>
              <circle cx="15" cy="12" r="1" fill="currentColor"/>
              <circle cx="6" cy="17" r="1" fill="currentColor"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
              <circle cx="18" cy="17" r="1" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-black text-xl leading-none tracking-tighter text-foreground group-hover:text-primary transition-colors">
              PASCAL<span className="text-primary">.ai</span>
            </span>
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              Binomial Engine
            </span>
          </div>
        </button>

        {/* Nav Right */}
        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden lg:flex items-center gap-1 mr-4">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={cn(
                  "px-3 py-1.5 text-[13px] font-bold rounded-lg transition-all",
                  active === item.id
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
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
