import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { PeriodicalPublication } from "@/types/periodical-publication";
import Header from "@/components/Header";
import LoadingOverlay from "@/components/search/LoadingOverlay";
import ActionToolbar from "@/components/search/ActionToolbar";
import BookSearchTable, {
  BasicColumn,
  MetaColumn,
} from "@/components/search/BookSearchTable";
import { FormField } from "@/components/search/SingleAddDialog";
import { PreviewData } from "@/components/search/ExcelUploadDialog";

const initialData: PeriodicalPublication[] = [
  {
    id: "1",
    signature: "간행-001",
    workTitle: "현대문학",
    authorName: "김문학",
    publisherName: "문학사",
    publicationYear: "2020",
    copyrightCategory: "간행물",
  },
  {
    id: "2",
    signature: "간행-002",
    workTitle: "과학저널",
    authorName: "이과학",
    publisherName: "과학출판사",
    publicationYear: "2021",
    copyrightCategory: "학술지",
  },
];

const basicColumns: BasicColumn[] = [
  { key: "signature", label: "서명", width: "w-24" },
  { key: "workTitle", label: "저작물명", width: "w-32" },
  { key: "authorName", label: "저작자명", width: "w-24" },
  { key: "publisherName", label: "출판사명", width: "w-28" },
  { key: "publicationYear", label: "발행년도", width: "w-20" },
  { key: "copyrightCategory", label: "저작권 구분", width: "w-24" },
];

const metaColumns: MetaColumn[] = [
  { key: "birthYear", label: "생년", width: "w-16" },
  { key: "deathYear", label: "몰년", width: "w-16" },
  { key: "kac", label: "KAC", width: "w-20" },
  { key: "isni", label: "ISNI", width: "w-40" },
  { key: "nationality", label: "국적", width: "w-16" },
  { key: "roleDescription", label: "역할어", width: "w-20" },
  { key: "residenceInfo", label: "거소 및 단체정보", width: "w-32" },
  { key: "rightsHolderUnknown", label: "권리자 불명여부", width: "w-28" },
  { key: "copyrightStatus", label: "저작권 여부", width: "w-20" },
];

const formFields: FormField[] = [
  { key: "signature", label: "서명", type: "text", required: true },
  { key: "workTitle", label: "저작물명", type: "text", required: true },
  { key: "authorName", label: "저작자명", type: "text", required: true },
  { key: "publisherName", label: "출판사명", type: "text", required: true },
  { key: "publicationYear", label: "발행년도", type: "text", required: true },
  {
    key: "copyrightCategory",
    label: "저작권 구분",
    type: "select",
    required: true,
    options: [
      { value: "간행물", label: "간행물" },
      { value: "학술지", label: "학술지" },
      { value: "잡지", label: "잡지" },
    ],
  },
];

const previewData: PreviewData[] = [
  {
    signature: "간행-003",
    workTitle: "디자인 매거진",
    authorName: "박디자인",
    publisherName: "디자인출판",
    publicationYear: "2022",
    copyrightCategory: "잡지",
  },
  {
    signature: "간행-004",
    workTitle: "건축 리뷰",
    authorName: "최건축",
    publisherName: "건축사",
    publicationYear: "2023",
    copyrightCategory: "학술지",
  },
  {
    signature: "간행-005",
    workTitle: "문화 소식",
    authorName: "한문화",
    publisherName: "문화출판",
    publicationYear: "2024",
    copyrightCategory: "간행물",
  },
];

export default function Home() {
  const [data, setData] = useState<PeriodicalPublication[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 체크박스 관련 상태 계산
  const allSelected = data.length > 0 && selectedItems.length === data.length;

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(data.map((item) => item.id));
    }
  };

  // 개별 아이템 선택/해제
  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  // 검색하기 (메타정보 채우기 시뮬레이션)
  const handleSearch = async () => {
    setIsSearching(true);
    setTimeout(() => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          birthYear: "1970",
          deathYear: "2030",
          kac: `KAC${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
          isni: `${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          nationality: "한국",
          roleDescription: "저작자",
          residenceInfo: "서울특별시",
          rightsHolderUnknown: "아니오",
          copyrightStatus: "예",
        })),
      );
      setIsSearching(false);
      toast.success("메타정보 검색이 완료되었습니다.");
    }, 1000);
  };

  // 단건 추가하기
  const handleSingleAdd = (formData: FormData) => {
    const newItem: PeriodicalPublication = {
      id: Date.now().toString(),
      signature: formData.get("signature") as string,
      workTitle: formData.get("workTitle") as string,
      authorName: formData.get("authorName") as string,
      publisherName: formData.get("publisherName") as string,
      publicationYear: formData.get("publicationYear") as string,
      copyrightCategory: formData.get("copyrightCategory") as string,
    };

    setData((prev) => [...prev, newItem]);
    toast.success(
      "새 항목이 추가되었습니다. '검색하기'를 눌러 메타정보를 채우세요.",
    );
  };

  // 엑셀 업로드
  const handleExcelUpload = () => {
    toast.success(
      "엑셀 파일이 업로드되었습니다. '검색하기'를 눌러 메타정보를 채우세요.",
    );
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    toast.success("엑셀 파일 다운로드가 시작되었습니다.");
  };

  // 초기화
  const handleReset = () => {
    setData(initialData);
    setSelectedItems([]);
    toast.success("데이터가 초기화되었습니다.");
  };

  // 선택 제거
  const handleRemoveSelected = () => {
    setData((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    toast.success(`${selectedItems.length}개 항목이 삭제되었습니다.`);
  };

  return (
    <div className="bg-background relative min-h-screen">
      <LoadingOverlay
        isLoading={isSearching}
        message="메타정보를 검색하는 중..."
      />

      <Header />

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">연속간행물</CardTitle>
                <CardDescription>
                  연속간행물 저작정보를 검색합니다.
                </CardDescription>
              </div>

              <ActionToolbar
                onSingleAdd={handleSingleAdd}
                onExcelUpload={handleExcelUpload}
                onSearch={handleSearch}
                onExcelDownload={handleExcelDownload}
                onReset={handleReset}
                onRemoveSelected={handleRemoveSelected}
                isSearching={isSearching}
                selectedItemsCount={selectedItems.length}
                formFields={formFields}
                previewData={previewData}
                basicColumns={basicColumns}
              />
            </div>
          </CardHeader>

          <CardContent>
            <BookSearchTable
              data={data}
              selectedItems={selectedItems}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              basicColumns={basicColumns}
              metaColumns={metaColumns}
              allSelected={allSelected}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
