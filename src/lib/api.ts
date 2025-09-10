import { PeriodicalSearchRequest } from "@/types/dtos/bookSearch";
import { BookSearchResponse } from "@/types/dtos/bookSearch";

export async function searchPeriodicalApi(
  url: string,
  { arg }: { arg: PeriodicalSearchRequest },
): Promise<BookSearchResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log("Base URL:", baseUrl);
  
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const fullUrl = `${baseUrl}${url}`;
  console.log("Full URL:", fullUrl);

  const res = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
    },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
