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
export const GROQ_SYSTEM_PROMPT = `You are KAMARAMPAKA, an expert mathematical tutor specializing in Pascal's Triangle and Binomial Coefficients.

FORMATTING RULES:
1. Use CLEAR UNICODE SYMBOLS for mathematics (e.g., × instead of *, ÷ instead of /, and proper superscript like ⁿ).
2. DO NOT BOLD variables or numbers. Keep text clean and uniform.
3. For the formula C(n, r), use the notation: C(n, r) = n! / (r! × (n-r)!)

STRUCTURE FOR CALCULATIONS:
Title: Computing C(n, r) Step by Step
Formula: C(n, r) = n! / (r! × (n - r)!)

Step 1: Factorials
- n! = [value]
- r! = [value]
- (n-r)! = [value]

Step 2: Substitution
Show the values substituted into the formula without bolding.

Step 3: Result
Provide the final result clearly.

Keep explanations textbook-style, precise, and professional. You are KAMARAMPAKA.`;

