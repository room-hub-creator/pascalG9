import { useEffect, useRef, useState } from "react";
import { Bot, Send, Key, AlertTriangle, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const KEY_STORAGE = "groq_api_key_v1";
const MODEL = "llama-3.3-70b-versatile";

type Msg = { role: "user" | "assistant" | "system"; content: string };

const SYSTEM = `You are an expert math tutor specialized in Pascal's Triangle and binomial coefficients C(n, r). Explain clearly, step-by-step, with concrete examples. Use markdown. When showing formulas, use plain text or LaTeX-like notation. Keep answers focused and concise.`;

const SUGGESTIONS = [
  "What is Pascal's triangle and how is it built?",
  "Why does C(n, r) = C(n, n − r)?",
  "Walk me through computing C(10, 4) step by step.",
  "How does the multiplicative formula avoid overflow?",
];

export const TutorSection = () => {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORAGE);
    if (saved) {
      setApiKey(saved);
      setHasKey(true);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const saveKey = () => {
    if (!apiKey.trim()) {
      toast.error("Enter a Groq API key first");
      return;
    }
    localStorage.setItem(KEY_STORAGE, apiKey.trim());
    setHasKey(true);
    toast.success("Key saved locally");
  };

  const removeKey = () => {
    localStorage.removeItem(KEY_STORAGE);
    setApiKey("");
    setHasKey(false);
    toast.success("Key removed");
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    if (!hasKey) {
      toast.error("Save your Groq API key first");
      return;
    }
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Placeholder assistant message that we'll fill as tokens arrive
    setMessages((p) => [...p, { role: "assistant", content: "" }]);

    try {
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          stream: true,
          messages: [{ role: "system", content: SYSTEM }, ...next],
        }),
      });

      if (!resp.ok || !resp.body) {
        const t = await resp.text().catch(() => "");
        throw new Error(t || `Request failed (${resp.status})`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      let acc = "";

      while (!done) {
        const r = await reader.read();
        if (r.done) break;
        buffer += decoder.decode(r.value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              acc += delta;
              setMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setMessages((p) => {
        const copy = [...p];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `⚠️ Error from Groq: ${msg}`,
        };
        return copy;
      });
      toast.error("Tutor request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-8 sm:pt-12">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-medium">
          <Bot className="h-3.5 w-3.5" />
          AI TUTOR · GROQ
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
          Ask the <span className="text-gradient">tutor</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Powered by Groq (Llama 3.3 70B). Your API key is stored in your browser only — never sent
          to our servers.
        </p>
      </header>

      {/* Key card */}
      <Card className="border-border/60 bg-card/80 backdrop-blur">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Key className="h-4 w-4 text-primary" /> Groq API Key
            {hasKey && (
              <span className="text-[10px] tracking-widest text-accent uppercase ml-2">Saved</span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="password"
              placeholder="gsk_..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-secondary/60 font-mono text-xs"
            />
            <Button onClick={saveKey} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save key
            </Button>
            {hasKey && (
              <Button variant="outline" onClick={removeKey}>
                <Trash2 className="h-4 w-4" /> Remove
              </Button>
            )}
          </div>
          <div className="flex items-start gap-2 text-[11px] text-muted-foreground rounded-lg bg-destructive/10 border border-destructive/30 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <span>
              Browser storage only — anyone using this device or sharing the deployed URL on the
              same browser can read the key. For production, route through a backend.
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Get a key at{" "}
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              console.groq.com/keys
            </a>
            .
          </p>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="border-border/60 bg-card/80 backdrop-blur shadow-[var(--shadow-card)]">
        <CardContent className="p-0">
          <div ref={scrollRef} className="h-[420px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Try a prompt:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      disabled={!hasKey}
                      className="text-left text-sm p-3 rounded-lg border border-border bg-secondary/40 hover:border-primary/40 hover:text-primary transition-[var(--transition-smooth)] disabled:opacity-50"
                    >
                      {s}
                    </button>
                  ))}
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
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
                    m.role === "user"
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "bg-secondary/60 border border-border",
                  )}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-pre:bg-background/60 prose-pre:border prose-pre:border-border prose-code:text-primary">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4 flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={hasKey ? "Ask about Pascal's triangle…" : "Save your API key above to start"}
              disabled={!hasKey || loading}
              rows={2}
              className="resize-none bg-secondary/60"
            />
            <Button
              onClick={() => send()}
              disabled={!hasKey || loading || !input.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 self-stretch"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
