import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="bg-background relative min-h-screen">
      <Header />

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold">저작권 정보 검색</h1>
            <p className="text-muted-foreground text-lg">
              연속간행물 또는 단행본의 저작권 정보를 검색할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">연속간행물</CardTitle>
                <CardDescription>
                  정기적으로 발간되는 간행물의 저작정보를 검색합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/serial">
                  <Button className="w-full" size="lg">
                    연속간행물 검색
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">단행본</CardTitle>
                <CardDescription>
                  단독으로 발간되는 도서의 저작정보를 검색합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/monograph">
                  <Button className="w-full" size="lg">
                    단행본 검색
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
