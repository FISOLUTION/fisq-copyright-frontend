import {
  BookSearchResponse,
  MonographSearchRequest,
  SerialSearchRequest,
} from "@/types/dtos/book-search";
import { apiKeyUtils } from "@/utils/api-key";
import { ApiKeyNotConfiguredError } from "./errors";

export async function searchSerialApi(
  url: string,
  { arg }: { arg: SerialSearchRequest },
): Promise<BookSearchResponse> {
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
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export async function searchMonographApi(
  url: string,
  { arg }: { arg: MonographSearchRequest },
): Promise<BookSearchResponse> {
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
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
