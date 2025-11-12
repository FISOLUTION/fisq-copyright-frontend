// 인증 헤더 관리 유틸리티
export const authUtils = {
  // 세션 스토리지에서 인증 헤더 조회
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("auth-header");
  },

  // 세션 스토리지에 인증 헤더 저장
  set: (header: string): void => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("auth-header", header);
  },

  // 세션 스토리지에서 인증 헤더 제거
  remove: (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("auth-header");
  },
};
