import { AIMode, DEFAULT_AI_MODE } from "@/types/ai-mode";

const AI_MODE_KEY = "ai-mode";

// AI 모드 관리 유틸리티
export const aiModeUtils = {
  // 세션 스토리지에서 AI 모드 조회
  get: (): AIMode => {
    if (typeof window === "undefined") return DEFAULT_AI_MODE;
    const stored = sessionStorage.getItem(AI_MODE_KEY);
    return (stored as AIMode) || DEFAULT_AI_MODE;
  },

  // 세션 스토리지에 AI 모드 저장
  set: (mode: AIMode): void => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(AI_MODE_KEY, mode);
  },

  // 세션 스토리지에서 AI 모드 제거 (기본값으로 리셋)
  remove: (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(AI_MODE_KEY);
  },
};
