import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setBasicAuthHeader, setUserName, isAuthenticated } = useAuth();

  // 이미 인증된 사용자는 홈으로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Basic 인증 헤더 생성
      const basicAuthString = btoa(`${username}:${password}`);
      const authHeader = `Basic ${basicAuthString}`;

      // 외부 API 서버의 /login 엔드포인트로 로그인 요청
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
      });

      if (response.ok) {
        // 인증 성공 - 응답에서 사용자 이름 추출
        const data = await response.json();
        const name = data.name || username; // name이 없으면 username 사용

        // 컨텍스트에 저장하고 홈으로 이동
        setBasicAuthHeader(authHeader);
        setUserName(name);
        router.push("/home");
      } else {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="FISQ Logo"
              width={180}
              height={45}
              className="h-12 w-auto"
              priority
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>로그인</CardTitle>
              <CardDescription>
                사전에 안내받은 아이디와 비밀번호를 입력하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="username">아이디</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Field>
                  {error && <FieldError>{error}</FieldError>}
                  <Field>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "로그인 중..." : "로그인"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
