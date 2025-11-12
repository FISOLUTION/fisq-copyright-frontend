import {
  BookSearchResponseItem,
  MonographRequestItem,
  SerialRequestItem,
} from "@/types/dtos/book-search";
import { aiModeUtils } from "@/utils/ai-mode";

export async function searchSerialItemApi(
  url: string,
  item: SerialRequestItem,
  index: number,
  basicAuthHeader: string,
): Promise<BookSearchResponseItem & { index: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const aiMode = aiModeUtils.get();
  const fullUrl = `${baseUrl}${url}?mode=${aiMode}`;

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader,
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const response: BookSearchResponseItem = await res.json();

  return { ...response, index } as BookSearchResponseItem & { index: number };
}

export async function searchMonographItemApi(
  url: string,
  item: MonographRequestItem,
  index: number,
  basicAuthHeader: string,
): Promise<BookSearchResponseItem & { index: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const aiMode = aiModeUtils.get();
  const fullUrl = `${baseUrl}${url}?mode=${aiMode}`;

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: basicAuthHeader,
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const response: BookSearchResponseItem = await res.json();

  return { ...response, index } as BookSearchResponseItem & { index: number };
}
