// API 키 관리 유틸리티
export const apiKeyUtils = {
  // 세션 스토리지에서 API 키 조회
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("api-key");
  },

  // 세션 스토리지에 API 키 저장
  set: (apiKey: string): void => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("api-key", apiKey);
  },

  // 세션 스토리지에서 API 키 제거
  remove: (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("api-key");
  },

  // API 키 존재 여부 확인
  exists: (): boolean => {
    return !!apiKeyUtils.get();
  },
};
