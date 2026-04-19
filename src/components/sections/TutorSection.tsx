import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getGroqKey, GROQ_MODEL, GROQ_SYSTEM_PROMPT } from "@/lib/groq";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SUGGESTIONS = [
  "What is Pascal's triangle and how is it built?",
  "Why does C(n, r) = C(n, n − r)?",
  "Walk me through computing C(10, 4) step by step.",
  "How does the multiplicative formula avoid overflow?",
];

export const TutorSection = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Placeholder assistant message
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    try {
      const apiKey = getGroqKey();
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          stream: true,
          messages: [{ role: "system", content: GROQ_SYSTEM_PROMPT }, ...next],
        }),
      });

      if (!resp.ok || !resp.body) {
        const t = await resp.text().catch(() => "");
        throw new Error(t || `Request failed (${resp.status})`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr === "[DONE]") break;
            try {
              const json = JSON.parse(jsonStr);
              const delta = json.choices[0]?.delta?.content || "";
              acc += delta;
              setMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            } catch (e) {
              // Ignore partial JSON
            }
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Error: ${msg}`,
        };
        return copy;
      });
      toast.error("Tutor request failed");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setMessages([]);
    toast.success("Chat cleared");
  };

  return (
    <div className="space-y-8 pt-8 sm:pt-12">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest leading-none">
          KAMARAMPAKA
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ask KAMARAMPAKA
          </h2>
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={clear} className="h-7 text-xs px-2">
              Clear History
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Pascal's Triangle and Binomial Coefficient Expert.
        </p>
      </header>


      {/* Chat Area */}
      <Card className="border-border/60 bg-card/80 backdrop-blur shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div ref={scrollRef} className="h-[450px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-6">
                <div className="bg-secondary/40 p-4 rounded-xl border border-border">
                  <p className="text-sm leading-relaxed">
                    Welcome to Pascal's Triangle and Binomial Coefficients. I am KAMARAMPAKA. I can help with Understanding Pascal's Triangle, Calculating binomial coefficients C(n, r), and more. What topic would you like to explore?
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Select a topic:</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="text-left text-sm p-4 rounded-lg border border-border bg-secondary/40 hover:border-primary/40 hover:text-primary transition-all active:scale-95 text-foreground font-semibold"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground border border-primary/20"
                      : "bg-secondary text-foreground border border-border",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-2 prose-pre:bg-background/60 prose-pre:border prose-pre:border-border prose-code:text-primary dark:prose-invert font-normal">

                      {typeof ReactMarkdown === 'function' || typeof ReactMarkdown === 'object' ? (
                        <ReactMarkdown>{m.content || "..."}</ReactMarkdown>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{m.content || "..."}</p>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed font-normal">{m.content}</p>

                  )}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.content === "" && (
               <div className="flex justify-start">
                  <div className="bg-secondary px-6 py-4 rounded-2xl border border-border text-sm font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                    KAMARAMPAKA is thinking...
                  </div>
               </div>
            )}
          </div>

          <div className="border-t border-border p-4 flex gap-2 bg-secondary/10">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask KAMARAMPAKA anything..."
              disabled={loading}
              rows={1}
              className="resize-none bg-background border-border/60 focus-visible:ring-primary h-[60px] text-base p-3"
            />
            <Button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg px-6 font-black text-sm h-[60px]"
            >
              Send
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};
