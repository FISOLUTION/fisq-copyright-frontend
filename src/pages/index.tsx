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
    author: "김문학",
    bookTitle: "현대문학",
    publisher: "문학사",
    publishYear: "2020",
    imageInfo: null,
    articleTitle: "현대문학 기사",
    authorType: null,
    birthYear: null,
    deathYear: null,
    controlNumber: null,
    isni: null,
    lastAffiliation: null,
    remark: null,
  },
  {
    id: "2",
    author: "이과학",
    bookTitle: "과학저널",
    publisher: "과학출판사",
    publishYear: "2021",
    imageInfo: null,
    articleTitle: "과학 연구 논문",
    authorType: null,
    birthYear: null,
    deathYear: null,
    controlNumber: null,
    isni: null,
    lastAffiliation: null,
    remark: null,
  },
];

const basicColumns: BasicColumn[] = [
  { key: "bookTitle", label: "서명", width: "w-24" },
  { key: "articleTitle", label: "저작물명", width: "w-32" },
  { key: "author", label: "저작자명", width: "w-24" },
  { key: "publisher", label: "출판사명", width: "w-28" },
  { key: "publishYear", label: "발행년도", width: "w-20" },
  { key: "imageInfo", label: "이미지 정보", width: "w-30" },
];

const metaColumns: MetaColumn[] = [
  { key: "authorType", label: "자료유형", width: "w-20" },
  { key: "birthYear", label: "생년", width: "w-16" },
  { key: "deathYear", label: "몰년", width: "w-16" },
  { key: "controlNumber", label: "제어번호", width: "w-30" },
  { key: "isni", label: "ISNI", width: "w-40" },
  { key: "lastAffiliation", label: "거소 및 단체정보", width: "w-32" },
  { key: "remark", label: "비고", width: "w-40" },
];

const formFields: FormField[] = [
  { key: "bookTitle", label: "서명", type: "text", required: true },
  { key: "articleTitle", label: "저작물명", type: "text", required: true },
  { key: "author", label: "저작자명", type: "text", required: true },
  { key: "publisher", label: "출판사명", type: "text", required: true },
  { key: "publishYear", label: "발행년도", type: "text", required: true },
  { key: "imageInfo", label: "이미지 정보", type: "text", required: false },
];

const previewData: PreviewData[] = [
  {
    bookTitle: "디자인 매거진",
    articleTitle: "디자인 트렌드",
    author: "박디자인",
    publisher: "디자인출판",
    publishYear: "2022",
    imageInfo: "",
  },
  {
    bookTitle: "건축 리뷰",
    articleTitle: "현대 건축론",
    author: "최건축",
    publisher: "건축사",
    publishYear: "2023",
    imageInfo: "",
  },
  {
    bookTitle: "문화 소식",
    articleTitle: "문화 동향",
    author: "한문화",
    publisher: "문화출판",
    publishYear: "2024",
    imageInfo: "",
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
          authorType: "연속간행물",
          birthYear: "1970",
          deathYear: "2030",
          controlNumber: `KAC${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(8, "0")}`,
          isni: `${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}-${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`,
          lastAffiliation: "서울특별시",
          remark: "저작권 확인됨",
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
      author: formData.get("author") as string,
      bookTitle: formData.get("bookTitle") as string,
      publisher: formData.get("publisher") as string,
      publishYear: formData.get("publishYear") as string,
      imageInfo: (formData.get("imageInfo") as string) || null,
      articleTitle: formData.get("articleTitle") as string,
      authorType: null,
      birthYear: null,
      deathYear: null,
      controlNumber: null,
      isni: null,
      lastAffiliation: null,
      remark: null,
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
