import { PeriodicalSearchRequest } from "@/types/dtos/bookSearch";
import { BookSearchResponse } from "@/types/dtos/bookSearch";
import { apiKeyUtils } from "@/utils/api-key";
import { toast } from "sonner";

export async function searchPeriodicalApi(
  url: string,
  { arg }: { arg: PeriodicalSearchRequest },
): Promise<BookSearchResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;

  const apiKey = apiKeyUtils.get();

  if (!apiKey) {
    toast.error("API 키가 설정되지 않았습니다", {
      description: "우측 상단의 설정 버튼을 클릭하여 API 키를 설정해주세요.",
      action: {
        label: "설정",
        onClick: () => {
          const event = new CustomEvent('openSettings');
          window.dispatchEvent(event);
        },
      },
    });
    return Promise.reject({ message: "API key is not configured", silent: true });
  }

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
