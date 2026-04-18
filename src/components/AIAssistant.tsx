import { useState, useRef, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getGroqKey, GROQ_MODEL, GROQ_SYSTEM_PROMPT } from "@/lib/groq";

interface Message {
  role: "bot" | "user";
  content: string;
}

export const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Welcome to Pascal's Triangle and Binomial Coefficients. I can help with: Understanding Pascal's Triangle, Calculating binomial coefficients C(n, r), Applying formulas like C(n, r) = n! / (r! * (n-r)!), and Solving problems using these concepts. What topic would you like to explore?",
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

      if (!resp.ok) throw new Error("API Request Failed");

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
        <Card className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col border border-border/60 bg-card/95 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in slide-in-from-bottom-5 duration-300 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/60 p-4 bg-primary/5">
            <span className="text-sm font-bold text-primary tracking-widest uppercase">KAMARAMPAKA</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-4 py-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-2xl px-5 py-4 text-[1.1rem] leading-relaxed shadow-sm",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground border border-border"
                    )}
                  >
                    {m.content || "..."}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t border-border/60 p-4 bg-background/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type here..."
                className="bg-secondary/40 border-border/40 text-base h-11"
              />
              <Button onClick={handleSend} disabled={isTyping} className="font-bold text-base h-11">
                Send
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
