import {
  BookSearchResponseItem,
  MonographRequestItem,
  SerialRequestItem,
} from "@/types/dtos/book-search";
import { apiKeyUtils } from "@/utils/api-key";
import { ApiKeyNotConfiguredError } from "./errors";

export async function searchSerialItemApi(
  url: string,
  item: SerialRequestItem,
  index: number,
): Promise<BookSearchResponseItem & { index: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;

  const apiKey = apiKeyUtils.get();

  if (!apiKey) {
    throw new ApiKeyNotConfiguredError();
  }

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
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
): Promise<BookSearchResponseItem & { index: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fullUrl = `${baseUrl}${url}`;

  const apiKey = apiKeyUtils.get();

  if (!apiKey) {
    throw new ApiKeyNotConfiguredError();
  }

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const response: BookSearchResponseItem = await res.json();

  return { ...response, index } as BookSearchResponseItem & { index: number };
}
