# CLAUDE.md

## 개발 명령어

- **개발 서버**: `pnpm dev`
- **린트**: `pnpm lint`
- **shadcn 컴포넌트 추가**: `pnpm dlx shadcn@latest add <component-name>`

## 아키텍처 및 구조

- TypeScript + Next.js 15 Pages Router + Tailwind CSS 4 + shadcn/ui
- 전체 코드베이스는 TypeScript로 작성
- **페이지**:
    - `/` - 각 검색 페이지로 이동 가능한 랜딩 페이지
    - `/serial` - 연속간행물 검색
    - `/monograph` - 단행본 검색

### 기능

- **데이터 관리**:
    - `src/lib/excel.ts`를 통한 Excel 업로드/다운로드 기능
    - 선택 기능이 있는 테이블 기반 데이터 표시
    - 일괄 작업 (검색, 삭제, 초기화)
- **API**:
    - `src/lib/api.ts`를 통한 저작정보 검색 API
    - `src/utils/api-key.ts`를 통한 API 키 관리
    - API 키 구성에 대한 오류 처리

### 컴포넌트

- **shadcn/ui 컴포넌트**: `src/components/ui/**`
- **도서 검색 컴포넌트**: `src/components/search/**`
    - `BookSearchTable` - 도서 테이블 컴포넌트
    - `ActionToolbar` - 검색, 업로드, 다운로드 버튼
    - `SingleAddDialog` - 수동 항목 추가
    - `ExcelUploadDialog` - Excel 파일 처리
- **그 외**: header, settings-modal 등 

### 타입

- **API DTOs**: `src/types/dtos/**`
- **도메인 타입**: `src/types/**`
- 연속간행물과 단행본은 기본 구조를 공유. 연속간행물은 추가로 저작물제목(`articleTitle`)을 가짐

### 흐름

1. 사용자가 단건 입력(수동) 또는 다건 입력(Excel 업로드)하여 테이블에 기본정보 필드 추가
2. SWR 사용한 검색 API로 각 행에 대응되는 메타정보 필드 채우기 (authorType, birthYear 등)
3. Excel로 내보내기

## 기타

- 모든 텍스트는 한국어로 작성
- `@/*`는 imports에서 `src/*`로 매핑