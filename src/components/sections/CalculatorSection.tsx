import { useEffect, useMemo, useState } from "react";
import { Sparkles, LayoutGrid, Flame, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PascalTriangle } from "@/components/PascalTriangle";
import { binomial, formatBigInt } from "@/lib/binomial";
import { addHistory } from "@/lib/history";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PRESETS = [
  { label: "C(50, 25)", n: 50, r: 25 },
  { label: "C(100, 50)", n: 100, r: 50 },
  { label: "C(1000, 500)", n: 1000, r: 500 },
  { label: "C(1000, 7)", n: 1000, r: 7 },
];

export const CalculatorSection = () => {
  const [n, setN] = useState(10);
  const [r, setR] = useState(4);
  const [rows, setRows] = useState(15);
  const [mode, setMode] = useState<"interactive" | "heatmap">("interactive");

  const result = useMemo(() => {
    if (!Number.isFinite(n) || !Number.isFinite(r) || n < 0 || r < 0 || r > n) return null;
    const start = performance.now();
    const value = binomial(n, r);
    return { value, elapsed: performance.now() - start };
  }, [n, r]);

  // Save to history (debounced via effect dep)
  useEffect(() => {
    if (result) addHistory({ n, r, value: result.value.toString(), at: Date.now() });
  }, [n, r, result]);

  const handlePreset = (pn: number, pr: number) => {
    setN(pn);
    setR(pr);
    if (pn <= 20) setRows(pn);
    toast.success(`Loaded C(${pn}, ${pr})`);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.value.toString());
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="pt-8 sm:pt-12 space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" />
          BIGINT PRECISION ENGINE
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Pascal's triangle, <span className="text-gradient">computed exactly.</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          Enter <code className="text-primary font-mono">n</code> and{" "}
          <code className="text-primary font-mono">r</code> — the triangle below highlights that
          cell and recomputes its exact value with BigInt precision.
        </p>
      </section>

      {/* Calculator + Triangle grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <Card className="border-border/60 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur">
          <CardContent className="p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs tracking-[0.2em] text-accent font-semibold uppercase">
                <LayoutGrid className="h-3.5 w-3.5" />
                Binomial Coefficient
              </div>
              <h2 className="text-3xl font-bold">
                Compute <span className="font-mono text-gradient">C(n, r)</span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Inputs drive the triangle below — exact precision up to row 1,000.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="n" className="font-mono text-base">n</Label>
                  <span className="text-[10px] tracking-widest text-muted-foreground">MAX 1000</span>
                </div>
                <Input
                  id="n"
                  type="number"
                  min={0}
                  max={1000}
                  value={n}
                  onChange={(e) => setN(Math.max(0, Math.min(1000, parseInt(e.target.value || "0", 10))))}
                  className="h-14 text-2xl font-mono bg-secondary/60 border-border/60 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <Label htmlFor="r" className="font-mono text-base">r</Label>
                  <span className="text-[10px] tracking-widest text-muted-foreground">MAX {n}</span>
                </div>
                <Input
                  id="r"
                  type="number"
                  min={0}
                  max={n}
                  value={r}
                  onChange={(e) => setR(Math.max(0, Math.min(n, parseInt(e.target.value || "0", 10))))}
                  className="h-14 text-2xl font-mono bg-secondary/60 border-border/60 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs tracking-widest text-muted-foreground uppercase">Presets</div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePreset(p.n, p.r)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border border-border bg-secondary/40 hover:border-primary/50 hover:text-primary transition-[var(--transition-smooth)]"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-secondary/30 p-5 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs tracking-widest text-primary uppercase">Result</div>
                {result && (
                  <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </Button>
                )}
              </div>
              {result ? (
                <>
                  <div className="font-math text-base sm:text-lg break-all leading-relaxed text-foreground tracking-tight">
                    {formatBigInt(result.value)}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground font-math">
                    <span><span className="text-accent font-semibold">{result.value.toString().length}</span> digits</span>
                    <span><span className="text-accent font-semibold">{result.elapsed.toFixed(2)}</span> ms</span>
                    <span>symmetry C(n,r)=C(n,n−r)</span>
                  </div>
                </>

              ) : (
                <div className="text-sm text-destructive">Invalid input — ensure 0 ≤ r ≤ n.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right: triangle */}
        <Card className="border-border/60 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="inline-flex rounded-lg border border-border bg-secondary/40 p-1">
                <button
                  onClick={() => setMode("interactive")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-[var(--transition-smooth)]",
                    mode === "interactive"
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" /> Interactive
                </button>
                <button
                  onClick={() => setMode("heatmap")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-[var(--transition-smooth)]",
                    mode === "heatmap"
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Flame className="h-3.5 w-3.5" /> Heatmap
                </button>
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-[180px] max-w-xs ml-auto">
                <span className="text-[10px] tracking-widest text-muted-foreground uppercase whitespace-nowrap">
                  Rows shown
                </span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={Math.min(rows, 20)}
                  onChange={(e) => setRows(parseInt(e.target.value, 10))}
                  className="flex-1 accent-[hsl(var(--primary))]"
                />
                <span className="font-mono text-sm text-primary w-7 text-right">
                  {Math.min(rows, 20)}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Showing rows 0–{Math.min(rows, 20) - 1}.{" "}
              {n <= 20 && r <= n ? (
                <>Cell <span className="font-mono text-primary">C({n}, {r})</span> is highlighted from the inputs above.</>
              ) : (
                <>Triangle preview capped at row 20 — exact values still compute up to row 1,000.</>
              )}
            </p>
            <PascalTriangle rows={rows} highlightN={n} highlightR={r} mode={mode} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
