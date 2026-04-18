import { useEffect, useState } from "react";
import { History as HistoryIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { clearHistory, getHistory, type HistoryItem } from "@/lib/history";
import { toast } from "sonner";

export const HistorySection = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setItems([]);
    toast.success("History cleared");
  };

  return (
    <div className="space-y-8 pt-8 sm:pt-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium">
          <HistoryIcon className="h-3.5 w-3.5" />
          LOCAL HISTORY
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Your <span className="text-gradient">computations</span>
          </h2>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          )}
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Stored in your browser. Last {items.length} of 30 entries.
        </p>
      </header>

      {items.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-card/40">
          <CardContent className="p-12 text-center text-muted-foreground">
            No computations yet. Open the Calculator and start exploring.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <Card key={it.at} className="border-border/60 bg-card/80 backdrop-blur">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="font-mono text-base text-primary">
                    C({it.n}, {it.r})
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(it.at).toLocaleString()}
                  </div>
                </div>
                <div className="font-mono text-xs break-all text-muted-foreground line-clamp-3">
                  {it.value}
                </div>
                <div className="text-[10px] text-accent">{it.value.length} digits</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
