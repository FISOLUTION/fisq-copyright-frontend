import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { MonographPublication } from "@/types/publication";
import Header from "@/components/header";
import LoadingOverlay from "@/components/search/loading-overlay";
import ActionToolbar from "@/components/search/action-toolbar";
import BookSearchTable, {
  BasicColumn,
  CopyrightColumn,
  MetaColumn,
} from "@/components/search/book-search-table";
import { FormField } from "@/components/search/single-add-dialog";
import { searchMonographItemApi } from "@/lib/api";
import { ApiKeyNotConfiguredError } from "@/lib/errors";
import { excel } from "@/lib/excel";

const initialData: MonographPublication[] = [
  {
    id: "1",
    author: "박목월",
    bookTitle: "광양만권 사람들",
    publisher: "광양만권 사람들",
    publishYear: "20080401",
    imageInfo: null,
    authorType: null,
    birthYear: null,
    deathYear: null,
    controlNumber: null,
    isni: null,
    lastAffiliation: null,
    remark: null,
    webSearchUtilized: null,
    isAuthorUnknown: null,
    hasCopyright: null,
  },
];

const basicColumns: BasicColumn[] = [
  { key: "bookTitle", label: "서명", width: "w-24" },
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
  { key: "remark", label: "비고", width: "w-72" },
  { key: "webSearchUtilized", label: "웹 활용 여부", width: "w-24" },
];

const copyrightColumns: CopyrightColumn[] = [
  { key: "isAuthorUnknown", label: "권리자 불명 여부", width: "w-28" },
  { key: "hasCopyright", label: "저작권 여부", width: "w-24" },
];

const formFields: FormField[] = [
  { key: "bookTitle", label: "서명", type: "text", required: true },
  { key: "author", label: "저작자명", type: "text", required: true },
  { key: "publisher", label: "출판사명", type: "text", required: true },
  { key: "publishYear", label: "발행년도", type: "text", required: true },
  { key: "imageInfo", label: "이미지 정보", type: "text", required: false },
];

export default function Monograph() {
  const [data, setData] = useState<MonographPublication[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({
    current: 0,
    total: 0,
  });

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

  // 검색하기 (개별 병렬 API 호출)
  const handleSearch = async () => {
    if (data.length === 0) {
      toast.error("검색할 데이터가 없습니다.");
      return;
    }

    setIsSearching(true);
    setSearchProgress({ current: 0, total: data.length });

    const startTime = Date.now();

    try {
      let completedCount = 0;
      let successCount = 0;
      const failedIndices: number[] = [];
      const updatedItems: MonographPublication[] = [...data];

      // 각 API 호출을 개별적으로 처리하여 실시간 진행률 업데이트
      const promises = data.map(async (item, index) => {
        try {
          const responseItem = await searchMonographItemApi(
            "/search-copyright/monograph/single",
            {
              author: item.author,
              bookTitle: item.bookTitle,
              publisher: item.publisher,
              publishYear: item.publishYear,
              imageInfo: item.imageInfo,
            },
            index,
          );

          // 성공한 경우 데이터 업데이트
          updatedItems[index] = {
            ...item,
            authorType: responseItem.authorType,
            birthYear: responseItem.birthYear,
            deathYear: responseItem.deathYear,
            controlNumber: responseItem.controlNumber,
            isni: responseItem.isni,
            lastAffiliation: responseItem.lastAffiliation,
            remark: responseItem.remark,
            webSearchUtilized: responseItem.webSearchUtilized,
            isAuthorUnknown: responseItem.isAuthorUnknown,
            hasCopyright: responseItem.hasCopyright,
          };
          successCount++;
        } catch (error) {
          // API 키 에러는 상위로 전파
          if (error instanceof ApiKeyNotConfiguredError) {
            throw error;
          }
          console.error(`Search failed for item ${index}:`, error);
          failedIndices.push(index);
          // 실패한 경우 저작권 여부는 null로 표시, 권리자 불명 여부는 알 수 없음(null)
          updatedItems[index] = {
            ...item,
            hasCopyright: null,
            isAuthorUnknown: null,
          };
        } finally {
          completedCount++;
          setSearchProgress({ current: completedCount, total: data.length });
        }
      });

      // 모든 API 호출 완료까지 대기
      await Promise.all(promises);

      // 최종 데이터 업데이트
      setData(updatedItems);

      // 진행률 바가 100%에 도달하는 것을 보여주기 위한 짧은 지연
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 결과 알림
      if (failedIndices.length > 0) {
        toast.error(
          `${failedIndices.length}개 항목의 메타정보 검색에 실패했습니다. (인덱스: ${failedIndices.join(", ")})`,
        );
      }

      if (successCount > 0) {
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        toast.success(
          `${successCount}개 항목의 메타정보 검색이 완료되었습니다. (소요시간: ${elapsedSeconds}초)`,
        );
      }
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
    } finally {
      setIsSearching(false);
      setSearchProgress({ current: 0, total: 0 });
    }
  };

  // 단건 추가하기
  const handleSingleAdd = (formData: FormData) => {
    const newItem: MonographPublication = {
      id: Date.now().toString(),
      author: formData.get("author") as string,
      bookTitle: formData.get("bookTitle") as string,
      publisher: formData.get("publisher") as string,
      publishYear: formData.get("publishYear") as string,
      imageInfo: (formData.get("imageInfo") as string) || null,
      authorType: null,
      birthYear: null,
      deathYear: null,
      controlNumber: null,
      isni: null,
      lastAffiliation: null,
      remark: null,
      webSearchUtilized: null,
      isAuthorUnknown: null,
      hasCopyright: null,
    };

    setData((prev) => [...prev, newItem]);
    toast.success(
      "새 항목이 추가되었습니다. '검색하기'를 눌러 메타정보를 채우세요.",
    );
  };

  // 엑셀 업로드
  const handleExcelUpload = (uploadedData: { [key: string]: string }[]) => {
    // PreviewData를 MonographPublication 형태로 변환
    const newItems: MonographPublication[] = uploadedData.map(
      (item, index) => ({
        id: (Date.now() + index).toString(),
        author: item.author || "",
        bookTitle: item.bookTitle || "",
        publisher: item.publisher || "",
        publishYear: item.publishYear || "",
        imageInfo: item.imageInfo || null,
        // 메타정보는 빈 상태로 초기화 (검색을 통해 채울 예정)
        authorType: null,
        birthYear: null,
        deathYear: null,
        controlNumber: null,
        isni: null,
        lastAffiliation: null,
        remark: null,
        webSearchUtilized: null,
        isAuthorUnknown: null,
        hasCopyright: null,
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
    const selectedData = data.filter((item) => selectedItems.includes(item.id));

    try {
      const filename = `단행본_검색결과_${new Date().toISOString().split("T")[0]}`;
      excel(
        selectedData,
        basicColumns,
        [...metaColumns, ...copyrightColumns],
        filename,
      );
      toast.success(
        `${selectedData.length}개 항목에 대한 엑셀 파일 다운로드가 시작되었습니다.`,
      );
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
        progress={searchProgress.total > 0 ? searchProgress : undefined}
      />

      <Header />

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">단행본</CardTitle>
                <CardDescription>단행본 저작정보를 검색합니다.</CardDescription>
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
              copyrightColumns={copyrightColumns}
              allSelected={allSelected}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
