import { BookOpen, Award, Info, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DocumentationSection = () => {
  return (
    <div className="space-y-12 py-12 animate-fade-in">
      {/* Documentation Title */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
          <BookOpen className="h-3.5 w-3.5" />
          PROJECT DOCUMENTATION
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.05]">
          Mathematical <span className="text-gradient">Theoretical Foundations</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-3xl">
          Comprehensive documentation for the MA80443 Mini-Project: 
          Using Pascal's Triangle in Computer Programs to Compute Large Binomial Coefficients.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border/60 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Award className="h-5 w-5 text-accent" />
              Project Objective
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              To design and implement a computer program that generates Pascal's triangle efficiently and uses it to compute binomial coefficients (n r) for large values of n.
            </p>
            <p>
              Constructing Pascal's triangle manually becomes impractical for large values such as (1000 r). This program automates the process with computational efficiency.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="h-5 w-5 text-primary" />
              Mathematical Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Pascal's Triangle is most famous for its connection to the <strong>Binomial Theorem</strong>. The numbers in each row represent the coefficients in the expansion of (x + y)<sup>n</sup>.
            </p>
            <div className="bg-secondary/50 p-6 rounded-xl border border-border/60 font-mono text-center shadow-inner">
              <p className="text-primary font-bold">(x + y)<sup>3</sup> = x<sup>3</sup> + 3x<sup>2</sup>y + 3xy<sup>2</sup> + y<sup>3</sup></p>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              The coefficients (1, 3, 3, 1) match exactly with the 3rd row of Pascal's Triangle.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-[var(--shadow-card)] bg-card/80 backdrop-blur md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-accent" />
              Optimization Strategies
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Avoiding Recomputation</h4>
              <p className="text-sm">
                We store the triangle in a suitable data structure (2D array/list of lists) to access values instantly once computed.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Memory Efficiency</h4>
              <p className="text-sm">
                For computing a single (n r), we only need the previous row, reducing space complexity from O(n²) to O(n).
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">Applying Symmetry</h4>
              <p className="text-sm">
                Using the property (n r) = (n n-r), we cut the computational workload in half for cases where r {' > '} n/2.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
