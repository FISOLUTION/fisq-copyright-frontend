import React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { AppLayout } from "@/components/layout"
import { BookOpen, FileText } from "lucide-react"

export default function Home() {
  return (
    <AuthGuard>
      <AppLayout>
        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>연속간행물</CardTitle>
              </div>
              <CardDescription>
                정기적으로 발간되는 간행물의 저작정보를 검색합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/serial">
                <Button className="w-full">검색 시작</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:bg-accent transition-colors">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <CardTitle>단행본</CardTitle>
              </div>
              <CardDescription>
                단독으로 발간되는 도서의 저작정보를 검색합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/monograph">
                <Button className="w-full">검색 시작</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </AppLayout>
    </AuthGuard>
  )
}
