import { useState, useRef, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getGroqKey, GROQ_MODEL, GROQ_SYSTEM_PROMPT } from "@/lib/groq";
import { getGeminiKey, GEMINI_MODEL, GEMINI_SYSTEM_PROMPT } from "@/lib/gemini";

interface Message {
  role: "bot" | "user";
  content: string;
}

type ModelType = "groq" | "gemini";

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<ModelType>("groq");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Greetings. I am KAMARAMPAKA, your mathematical tutor for Pascal's Triangle and Binomial Coefficients. \n\nI can assist you with: \n• Understanding the properties of Pascal's Triangle\n• Step-by-step C(n, r) calculations\n• Binomial expansions and theorem applications\n• Solving complex combinatorial problems\n\nWhat mathematical concept shall we explore together?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }, 100);
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    const nextForAi = [...messages.map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })), { role: 'user', content: input }];
    setInput("");
    setIsTyping(true);

    setMessages((prev) => [...prev, { role: "bot", content: "" }]);

    try {
      if (model === "groq") {
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
            messages: [{ role: "system", content: GROQ_SYSTEM_PROMPT }, ...nextForAi],
          }),
        });

        if (!resp.ok) throw new Error("Groq API Request Failed");

        const reader = resp.body?.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader!.read();
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
                  copy[copy.length - 1] = { role: "bot", content: acc };
                  return copy;
                });
              } catch (e) {}
            }
          }
        }
      } else {
        const apiKey = getGeminiKey();
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
              ...nextForAi.map(m => ({
                role: m.role === "assistant" ? "model" : "user",
                parts: [{ text: m.content }]
              }))
            ]
          }),
        });

        if (!resp.ok) throw new Error("Gemini API Request Failed");

        const reader = resp.body?.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const jsonStr = line.replace("data: ", "").trim();
                const json = JSON.parse(jsonStr);
                const delta = json.candidates[0]?.content?.parts[0]?.text || "";
                acc += delta;
                setMessages((p) => {
                  const copy = [...p];
                  copy[copy.length - 1] = { role: "bot", content: acc };
                  return copy;
                });
              } catch (e) {}
            }
          }
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = { role: "bot", content: "Sorry, I encountered an error connecting to the brain." };
        return copy;
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 bg-primary text-primary-foreground p-0 flex items-center justify-center"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-[85px] right-4 left-4 sm:left-auto sm:right-6 z-50 flex h-[calc(100dvh-120px)] sm:h-[460px] sm:w-[360px] flex-col border border-border/60 bg-card/98 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in slide-in-from-bottom-10 duration-500 overflow-hidden rounded-[1.5rem] sm:rounded-2xl">
          
          <div className="flex items-center justify-between border-b border-border/60 p-4 bg-primary/5">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-primary tracking-[0.2em] uppercase opacity-80">Brain Architecture</span>
              <div className="flex gap-1.5 p-1 bg-background/50 rounded-lg border border-border/40">
                <button 
                  onClick={() => setModel("groq")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] uppercase font-black transition-all rounded-md",
                    model === "groq" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Llama 3
                </button>
                <button 
                  onClick={() => setModel("gemini")}
                  className={cn(
                    "px-2 py-0.5 text-[9px] uppercase font-black transition-all rounded-md",
                    model === "gemini" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Gemini
                </button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-3 py-1" ref={scrollRef}>
            <div className="flex flex-col gap-4 py-3">
              {messages.map((m, i) => {
                const isMath = m.content.includes("Step-by-Step Solution") || m.content.includes("Formula") || m.content.includes("÷") || m.content.includes("×");
                const isCode = m.content.includes("Code Example") || m.content.includes("```");

                return (
                  <div
                    key={i}
                    className={cn(
                      "flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 duration-400",
                      m.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <span className="text-[8px] uppercase font-bold tracking-widest text-muted-foreground px-1.5">
                      {m.role === "user" ? "You" : "KAMARAMPAKA"}
                    </span>
                    <div
                      className={cn(
                        "max-w-[88%] rounded-[1.25rem] px-4 py-3 text-[13px] leading-relaxed shadow-sm transition-all duration-300",
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none shadow-primary/10"
                          : cn(
                              "bg-secondary/50 text-foreground border border-border/40 rounded-tl-none",
                              isMath && "bg-blue-500/5 border-blue-500/20 font-serif text-[15px] italic",
                              isCode && "bg-zinc-950 text-zinc-100 border-zinc-800 font-mono text-[12px]"
                            )
                      )}
                    >
                      {m.content || (
                        <div className="flex gap-1 py-1">
                          <span className="h-1 w-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-1 w-1 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-1 w-1 bg-primary/40 rounded-full animate-bounce" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="p-3 bg-background/80 border-t border-border/40">
            <div className="relative flex items-center">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Ask KAMARAMPAKA..."
                className="pr-10 bg-secondary/30 border-border/40 focus:border-primary/40 rounded-xl h-10 text-[13px]"
              />
              <Button 
                onClick={handleSend} 
                disabled={isTyping || !input.trim()} 
                size="icon"
                className="absolute right-1 h-8 w-8 rounded-lg shadow-lg shadow-primary/20"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 7-7 7 7" />
                  <path d="M12 19V5" />
                </svg>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
