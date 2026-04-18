import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PascalTriangle } from "@/components/PascalTriangle";
import { binomial, formatBigInt } from "@/lib/binomial";
import { toast } from "sonner";

const PRESETS: Array<{ label: string; n: number; r: number }> = [
  { label: "C(50, 25)", n: 50, r: 25 },
  { label: "C(100, 50)", n: 100, r: 50 },
  { label: "C(1000, 500)", n: 1000, r: 500 },
  { label: "C(1000, 3)", n: 1000, r: 3 },
];

const Index = () => {
  const [n, setN] = useState(10);
  const [r, setR] = useState(4);
  const [triangleRows, setTriangleRows] = useState(10);

  const result = useMemo(() => {
    if (!Number.isFinite(n) || !Number.isFinite(r)) return null;
    if (n < 0 || r < 0) return null;
    if (r > n) return null;
    try {
      const start = performance.now();
      const value = binomial(n, r);
      const elapsed = performance.now() - start;
      return { value, elapsed };
    } catch {
      return null;
    }
  }, [n, r]);

  const handlePreset = (pn: number, pr: number) => {
    setN(pn);
    setR(pr);
    if (pn <= 20) setTriangleRows(pn);
    toast.success(`Loaded C(${pn}, ${pr})`);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.value.toString());
    toast.success("Copied to clipboard");
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            MA80443 · Project 1
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight bg-[var(--gradient-primary)] bg-clip-text text-transparent">
            Pascal's Triangle & Binomial Coefficients
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Compute C(n, r) efficiently for very large n — using BigInt, the multiplicative formula,
            and the symmetry C(n, r) = C(n, n − r).
          </p>
        </header>

        <Card className="border-primary/20 shadow-[var(--shadow-elegant)]">
          <CardHeader>
            <CardTitle>Calculator</CardTitle>
            <CardDescription>Enter n and r to compute the binomial coefficient.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="n">n (row)</Label>
                <Input
                  id="n"
                  type="number"
                  min={0}
                  max={100000}
                  value={n}
                  onChange={(e) => setN(parseInt(e.target.value || "0", 10))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="r">r (column)</Label>
                <Input
                  id="r"
                  type="number"
                  min={0}
                  max={100000}
                  value={r}
                  onChange={(e) => setR(parseInt(e.target.value || "0", 10))}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Button key={p.label} variant="secondary" size="sm" onClick={() => handlePreset(p.n, p.r)}>
                  {p.label}
                </Button>
              ))}
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  C({n}, {r}) =
                </div>
                {result && (
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    Copy
                  </Button>
                )}
              </div>
              {result ? (
                <>
                  <div className="font-mono text-sm sm:text-base break-all leading-relaxed">
                    {formatBigInt(result.value)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.value.toString().length} digits · computed in {result.elapsed.toFixed(2)} ms
                  </div>
                </>
              ) : (
                <div className="text-sm text-destructive">
                  Invalid input. Ensure 0 ≤ r ≤ n.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualize the Triangle</CardTitle>
            <CardDescription>
              Render rows 0 to {Math.min(triangleRows, 20)} of Pascal's Triangle. The selected
              C(n, r) is highlighted when n ≤ 20.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Label htmlFor="rows" className="whitespace-nowrap">
                Rows: {Math.min(triangleRows, 20)}
              </Label>
              <Input
                id="rows"
                type="range"
                min={1}
                max={20}
                value={Math.min(triangleRows, 20)}
                onChange={(e) => setTriangleRows(parseInt(e.target.value, 10))}
                className="flex-1"
              />
            </div>
            <PascalTriangle rows={triangleRows} highlightN={n} highlightR={r} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="formula">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="formula">Formula</TabsTrigger>
                <TabsTrigger value="opt">Optimizations</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
              </TabsList>
              <TabsContent value="formula" className="space-y-2 text-sm pt-4">
                <p>
                  The binomial coefficient C(n, r) = n! / (r! · (n − r)!) counts ways to choose r
                  items from n.
                </p>
                <p>
                  Computing factorials directly overflows quickly. We instead use the
                  multiplicative formula:
                </p>
                <pre className="bg-muted p-3 rounded-md font-mono text-xs overflow-x-auto">
{`C(n, r) = ∏ (n - i + 1) / i  for i = 1..r`}
                </pre>
              </TabsContent>
              <TabsContent value="opt" className="space-y-2 text-sm pt-4">
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>BigInt</strong>: arbitrary-precision integers — no overflow.</li>
                  <li><strong>Symmetry</strong>: C(n, r) = C(n, n − r); we always loop the smaller side.</li>
                  <li><strong>No full triangle</strong>: only r multiplications, not O(n²) memory.</li>
                  <li><strong>Visualization only</strong>: triangle rows capped at 20 for display.</li>
                </ul>
              </TabsContent>
              <TabsContent value="tests" className="space-y-2 text-sm pt-4">
                <p>Try the preset buttons to verify large values:</p>
                <ul className="list-disc pl-5 space-y-1 font-mono text-xs">
                  <li>C(50, 25) = 126,410,606,437,752</li>
                  <li>C(100, 50) ≈ 1.0089 × 10²⁹</li>
                  <li>C(1000, 500) has 299 digits</li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="text-center text-xs text-muted-foreground pb-4">
          Built with React + BigInt · Client-side only
        </footer>
      </div>
    </main>
  );
};

export default Index;
