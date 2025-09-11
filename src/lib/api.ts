import { PeriodicalSearchRequest } from "@/types/dtos/bookSearch";
import { BookSearchResponse } from "@/types/dtos/bookSearch";
import { apiKeyUtils } from "@/utils/api-key";
import { ApiKeyNotConfiguredError } from "./errors";

export async function searchPeriodicalApi(
  url: string,
  { arg }: { arg: PeriodicalSearchRequest },
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
