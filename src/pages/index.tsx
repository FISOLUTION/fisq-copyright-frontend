import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
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
import { searchPeriodicalApi } from "@/lib/api";
import { PeriodicalSearchRequest } from "@/types/dtos/bookSearch";
import { ApiKeyNotConfiguredError } from "@/lib/errors";
import { excel } from "@/lib/excel";

const initialData: PeriodicalPublication[] = [
  {
    id: "1",
    author: "박목월",
    bookTitle: "광양만권 사람들",
    publisher: "광양만권 사람들",
    publishYear: "20080401",
    imageInfo: null,
    articleTitle: "좋은 생각 : 4월의 노래",
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

export default function Home() {
  const [data, setData] = useState<PeriodicalPublication[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const { trigger: searchMeta, isMutating: isSearching } = useSWRMutation(
    "/search-copyright/periodical",
    searchPeriodicalApi,
  );

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

  // 검색하기 (SWR을 사용한 API 검색)
  const handleSearch = async () => {
    try {
      // 현재 데이터를 API 요청 형태로 변환
      const request: PeriodicalSearchRequest = {
        items: data.map((item) => ({
          author: item.author,
          bookTitle: item.bookTitle,
          publisher: item.publisher,
          publishYear: item.publishYear,
          imageInfo: item.imageInfo,
          articleTitle: item.articleTitle,
        })),
      };

      const response = await searchMeta(request);

      // 성공한 항목들로 메타정보 업데이트
      setData((prev) =>
        prev.map((item, index) => {
          const successItem = response.successItems.find(
            (success) => success.index === index,
          );
          if (successItem) {
            return {
              ...item,
              authorType: successItem.authorType,
              birthYear: successItem.birthYear,
              deathYear: successItem.deathYear,
              controlNumber: successItem.controlNumber,
              isni: successItem.isni,
              lastAffiliation: successItem.lastAffiliation,
              remark: successItem.remark,
            };
          }
          return item;
        }),
      );

      // 실패한 항목들 토스트로 알림
      if (response.failedIndices.length > 0) {
        const failedCount = response.failedIndices.length;
        toast.error(
          `${failedCount}개 항목의 메타정보 검색에 실패했습니다. (인덱스: ${response.failedIndices.join(", ")})`,
        );
      }

      const successCount = response.successItems.length;
      toast.success(`${successCount}개 항목의 메타정보 검색이 완료되었습니다.`);
    } catch (error) {
      console.error("Search error:", error);

      // API 키가 설정되지 않은 경우
      if (error instanceof ApiKeyNotConfiguredError) {
        toast.error("API 키가 설정되지 않았습니다", {
          description:
            "우측 상단의 설정 버튼을 클릭하여 API 키를 설정해주세요.",
          action: {
            label: "설정",
            onClick: () => {
              const event = new CustomEvent("openSettings");
              window.dispatchEvent(event);
            },
          },
        });
        return;
      }

      // 기타 오류
      toast.error("메타정보 검색 중 오류가 발생했습니다.");
    }
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
  const handleExcelUpload = (uploadedData: { [key: string]: string }[]) => {
    // PreviewData를 PeriodicalPublication 형태로 변환
    const newItems: PeriodicalPublication[] = uploadedData.map(
      (item, index) => ({
        id: (Date.now() + index).toString(),
        author: item.author || "",
        bookTitle: item.bookTitle || "",
        publisher: item.publisher || "",
        publishYear: item.publishYear || "",
        imageInfo: item.imageInfo || null,
        articleTitle: item.articleTitle || "",
        // 메타정보는 빈 상태로 초기화 (검색을 통해 채울 예정)
        authorType: null,
        birthYear: null,
        deathYear: null,
        controlNumber: null,
        isni: null,
        lastAffiliation: null,
        remark: null,
      }),
    );

    // 기존 데이터에 새 항목들 추가
    setData((prev) => [...prev, ...newItems]);
    toast.success(
      `${newItems.length}개 항목이 추가되었습니다. '검색하기'를 눌러 메타정보를 채우세요.`,
    );
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    if (data.length === 0) {
      toast.error("다운로드할 데이터가 없습니다.");
      return;
    }

    try {
      const filename = `연속간행물_검색결과_${new Date().toISOString().split("T")[0]}`;
      excel(data, basicColumns, metaColumns, filename);
      toast.success("엑셀 파일 다운로드가 시작되었습니다.");
    } catch (error) {
      console.error("Excel download error:", error);
      toast.error("엑셀 파일 다운로드 중 오류가 발생했습니다.");
    }
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
