import { useMemo, useState } from "react";
import { FunctionSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { expandBinomial, formatBigInt } from "@/lib/binomial";

export const ExpansionSection = () => {
  const [n, setN] = useState(6);
  const safeN = Math.max(0, Math.min(50, n));
  const terms = useMemo(() => expandBinomial(safeN), [safeN]);

  return (
    <div className="space-y-8 pt-8 sm:pt-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium">
          <FunctionSquare className="h-3.5 w-3.5" />
          BINOMIAL EXPANSION
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Expand <span className="font-mono text-gradient">(a + b)<sup>n</sup></span>
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Each term uses C(n, r) as its coefficient. Try n = 1000 in the calculator — only the
          coefficients are huge, the structure stays the same.
        </p>
      </header>

      <Card className="border-border/60 bg-card/80 backdrop-blur shadow-[var(--shadow-card)]">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="max-w-xs space-y-2">
            <Label htmlFor="exp-n" className="font-mono">n</Label>
            <Input
              id="exp-n"
              type="number"
              min={0}
              max={50}
              value={n}
              onChange={(e) => setN(parseInt(e.target.value || "0", 10))}
              className="h-12 text-xl font-mono bg-secondary/60"
            />
            <p className="text-[11px] text-muted-foreground">Capped at 50 for readability.</p>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-5 overflow-x-auto">
            <div className="font-mono text-sm sm:text-base leading-loose">
              <span className="text-muted-foreground">(a + b)<sup>{safeN}</sup> = </span>
              {terms.map((t, i) => (
                <span key={i}>
                  {i > 0 && <span className="text-muted-foreground"> + </span>}
                  {t.coef !== 1n && <span className="text-primary">{formatBigInt(t.coef)}</span>}
                  {t.aExp > 0 && (
                    <span>
                      a{t.aExp > 1 && <sup>{t.aExp}</sup>}
                    </span>
                  )}
                  {t.bExp > 0 && (
                    <span>
                      b{t.bExp > 1 && <sup>{t.bExp}</sup>}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Stat label="Terms" value={`${terms.length}`} />
            <Stat label="Sum of coefs" value={formatBigInt(2n ** BigInt(safeN))} />
            <Stat
              label="Largest coef"
              value={formatBigInt(terms.reduce((m, t) => (t.coef > m ? t.coef : m), 0n))}
            />
            <Stat label="Symmetric" value="✓ C(n,r)=C(n,n−r)" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-secondary/40 p-3">
    <div className="text-[10px] tracking-widest text-muted-foreground uppercase">{label}</div>
    <div className="font-mono text-xs sm:text-sm text-primary truncate mt-1" title={value}>
      {value}
    </div>
  </div>
);
