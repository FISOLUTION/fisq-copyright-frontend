import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { AppLayout } from "@/components/layout"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { FlaskConical } from "lucide-react"

export default function Home() {
  return (
    <AuthGuard>
      <AppLayout>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FlaskConical />
            </EmptyMedia>
            <EmptyTitle>아직 지원되지 않는 기능입니다.</EmptyTitle>
            <EmptyDescription>
              베타 서비스에서는 저작권 조사만 이용 가능합니다.<br/>
              아래에서 바로 시작해보세요.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-4">
              <Link href="/serial">
                <Button>연속간행물 검색</Button>
              </Link>
              <Link href="/monograph">
                <Button>단행본 검색</Button>
              </Link>
            </div>
          </EmptyContent>
        </Empty>
      </AppLayout>
    </AuthGuard>
  )
}
