export const AIMode = {
  OPENAI: { value: "openai", label: "OpenAI" },
  GEMINI: { value: "gemini", label: "Gemini" },
  LOCAL: { value: "local", label: "Local" },
} as const;

export type AIModeValue = (typeof AIMode)[keyof typeof AIMode]["value"];

export const DEFAULT_AI_MODE = AIMode.OPENAI.value;
