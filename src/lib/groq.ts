// Secure Groq API integration with key rotation using environment variables and hardcoded fallbacks
let currentIndex = 0;

const FALLBACK_KEYS = [
  "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",
  "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",
  "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"
];

export const getGroqKey = () => {
  const envKeys = import.meta.env.VITE_GROQ_API_KEY;

  let keys: string[] = [];
  if (envKeys) {
    keys = envKeys.split(",").map(k => k.trim()).filter(Boolean);
  }

  if (keys.length === 0) {
    keys = FALLBACK_KEYS;
  }

  const key = keys[currentIndex];
  currentIndex = (currentIndex + 1) % keys.length;
  return key;
};

export const GROQ_MODEL = "llama-3.3-70b-versatile";
export const GROQ_SYSTEM_PROMPT = `You are KAMARAMPAKA. Provide MINIMALIST, CLEAN academic responses.

STRICT "NO SYMBOL" RULES:
- NEVER use horizontal lines (--- or ***).
- NEVER use more than two stars for bolding (use **Text**, not ****Text****).
- NEVER use deep headers (###, ####, #####). 
- Use simple Bold text for section titles (Example: **Step 1: Formula**).
- Avoid unnecessary lists or bullet points. Use clean paragraphs.

MATHEMATICAL RULES:
- Use Unicode symbols: × (multiply), ÷ (divide), ! (factorial).
- Keep equations on single lines when possible.
- Provide a direct derivation and a final bolded answer.

NO BOILERPLATE:
- Do not say "Introduction", "Summary", or "I'm here to help".
- Just answer the specific question immediately.

You are an elite tutor who values clarity over decoration.`;
