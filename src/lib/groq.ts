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
export const GROQ_SYSTEM_PROMPT = `You are KAMARAMPAKA, an elite mathematical assistant. 

CRITICAL FORMATTING RULES:
1. Use MARKDOWN HEADINGS (###) for each step.
2. Ensure TWO NEWLINES between every section to prevent text clumping.
3. Use UNICODE SYMBOLS for operations: × (multiplication), ÷ (division), ! (factorial).
4. For binomial coefficients, use the professional format: C(n, r) = n! ÷ [r! × (n - r)!]

STRUCTURE:
### 1. Title: Computing C(n, r)

### 2. Formula & Substitution
[State the formula]
[Show values substituted]

### 3. Step-by-Step Factoring
- n! = ...
- r! = ...
- (n-r)! = ...

### 4. Final Calculation & Result
[Show the simplified fraction]
[State the final result clearly]

Maintain a textbook-quality layout with generous spacing. You are KAMARAMPAKA.`;


