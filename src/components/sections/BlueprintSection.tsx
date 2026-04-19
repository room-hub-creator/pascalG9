import { Cpu, GitBranch, Scaling, Sigma } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const BlueprintSection = () => {
  return (
    <div className="space-y-10 pt-8 sm:pt-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium">
          <Cpu className="h-3.5 w-3.5" />
          BLUEPRINT
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          How it <span className="text-gradient">works</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          The algorithm, the optimizations, and why we never build the full triangle.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Pillar
          icon={<Sigma className="h-5 w-5" />}
          title="Multiplicative formula"
          body={
            <>
              Instead of computing factorials (which overflow fast), we accumulate{" "}
              <code className="font-mono text-primary">C(n, r) = ∏ (n − i + 1) ÷ i</code> for{" "}
              i = 1..r. Only r multiplications and r divisions.
            </>
          }
        />
        <Pillar
          icon={<GitBranch className="h-5 w-5" />}
          title="Symmetry"
          body={
            <>
              <code className="font-mono text-primary">C(n, r) = C(n, n − r)</code>. We always loop
              the smaller of <em>r</em> and <em>n − r</em>, halving work for r near n/2.
            </>
          }
        />
        <Pillar
          icon={<Scaling className="h-5 w-5" />}
          title="BigInt precision"
          body={
            <>
              JavaScript <code className="font-mono text-primary">BigInt</code> gives arbitrary
              precision. C(1000, 500) has 299 digits and computes in &lt; 1 ms.
            </>
          }
        />
        <Pillar
          icon={<Cpu className="h-5 w-5" />}
          title="No full triangle"
          body={
            <>
              We never store O(n²) cells. The visualizer caps at row 20 for legibility, while the
              calculator uses only the multiplicative loop.
            </>
          }
        />
      </div>

      <Card className="border-border/60 bg-card/80 backdrop-blur">
        <CardContent className="p-6 sm:p-8 space-y-4">
          <h3 className="text-xl font-bold">Reference implementation</h3>
          <pre className="bg-secondary/60 border border-border rounded-lg p-4 overflow-x-auto text-xs font-mono leading-relaxed">
{`function binomial(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  if (r === 0 || r === n) return 1n;
  const k = r > n - r ? n - r : r;   // symmetry
  let result = 1n;
  const N = BigInt(n);
  for (let i = 1; i <= k; i++) {
    result = (result * (N - BigInt(i) + 1n)) / BigInt(i);
  }
  return result;
}`}
          </pre>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Bench label="C(50, 25)" value="126,410,606,437,752" />
            <Bench label="C(100, 50)" value="≈ 1.0089 × 10²⁹" />
            <Bench label="C(1000, 500)" value="299 digits, < 1 ms" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Pillar = ({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) => (
  <Card className="border-border/60 bg-card/80 backdrop-blur hover:border-primary/40 transition-[var(--transition-smooth)]">
    <CardContent className="p-6 space-y-3">
      <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
    </CardContent>
  </Card>
);

const Bench = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-border bg-secondary/40 p-3">
    <div className="text-[10px] tracking-widest text-muted-foreground uppercase">{label}</div>
    <div className="font-mono text-xs text-accent mt-1">{value}</div>
  </div>
);
