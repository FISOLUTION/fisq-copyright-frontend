import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Download,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import { PeriodicalPublication } from "@/types/periodical-publication";
import Header from "@/components/Header";

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

export default function Home() {
  const [data, setData] = useState<PeriodicalPublication[]>(initialData);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [singleAddOpen, setSingleAddOpen] = useState(false);
  const [excelUploadOpen, setExcelUploadOpen] = useState(false);

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
    setSingleAddOpen(false);
    toast.success(
      "새 항목이 추가되었습니다. '검색하기'를 눌러 메타정보를 채우세요.",
    );
  };

  // 엑셀 업로드
  const handleExcelUpload = () => {
    setExcelUploadOpen(false);
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

  // 개별 행 삭제
  const handleDeleteRow = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    toast.success("항목이 삭제되었습니다.");
  };

  return (
    <div className="bg-background relative min-h-screen">
      {/* 로딩 오버레이 */}
      {isSearching && (
        <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-primary h-12 w-12 animate-spin" />
            <p className="text-lg font-medium">메타정보를 검색하는 중...</p>
          </div>
        </div>
      )}

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

              {/* 툴바 버튼들 */}
              <div className="flex flex-wrap gap-2">
                {/* 단건 추가하기 */}
                <Dialog open={singleAddOpen} onOpenChange={setSingleAddOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      단건 추가하기
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader className="mb-6">
                      <DialogTitle>단건 추가하기</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        handleSingleAdd(formData);
                      }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="signature">서명</Label>
                          <Input id="signature" name="signature" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="workTitle">저작물명</Label>
                          <Input id="workTitle" name="workTitle" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="authorName">저작자명</Label>
                          <Input id="authorName" name="authorName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="publisherName">출판사명</Label>
                          <Input
                            id="publisherName"
                            name="publisherName"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="publicationYear">발행년도</Label>
                          <Input
                            id="publicationYear"
                            name="publicationYear"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="copyrightCategory">저작권 구분</Label>
                          <Select name="copyrightCategory" required>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="구분 선택" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="간행물">간행물</SelectItem>
                              <SelectItem value="학술지">학술지</SelectItem>
                              <SelectItem value="잡지">잡지</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-6">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setSingleAddOpen(false)}
                        >
                          취소
                        </Button>
                        <Button type="submit">추가하기</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* 엑셀 업로드 */}
                <Dialog
                  open={excelUploadOpen}
                  onOpenChange={setExcelUploadOpen}
                >
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      엑셀 업로드
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>엑셀 업로드</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* 드롭존 */}
                      <div className="border-border rounded-lg border-2 border-dashed p-8 text-center">
                        <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                        <p className="text-foreground mb-2">
                          엑셀 파일을 드래그하거나 클릭하여 업로드
                        </p>
                        <p className="text-muted-foreground text-sm">
                          *.xlsx, *.xls 파일만 지원
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".xlsx,.xls"
                        />
                        <p className="mt-2 text-sm text-blue-600">
                          sample-data.xlsx
                        </p>
                      </div>

                      {/* 미리보기 테이블 */}
                      <div>
                        <h4 className="mb-2 font-medium">미리보기 (3행)</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>서명</TableHead>
                              <TableHead>저작물명</TableHead>
                              <TableHead>저작자명</TableHead>
                              <TableHead>출판사명</TableHead>
                              <TableHead>발행년도</TableHead>
                              <TableHead>저작권 구분</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>간행-003</TableCell>
                              <TableCell>디자인 매거진</TableCell>
                              <TableCell>박디자인</TableCell>
                              <TableCell>디자인출판</TableCell>
                              <TableCell>2022</TableCell>
                              <TableCell>잡지</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>간행-004</TableCell>
                              <TableCell>건축 리뷰</TableCell>
                              <TableCell>최건축</TableCell>
                              <TableCell>건축사</TableCell>
                              <TableCell>2023</TableCell>
                              <TableCell>학술지</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>간행-005</TableCell>
                              <TableCell>문화 소식</TableCell>
                              <TableCell>한문화</TableCell>
                              <TableCell>문화출판</TableCell>
                              <TableCell>2024</TableCell>
                              <TableCell>간행물</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => setExcelUploadOpen(false)}
                      >
                        취소
                      </Button>
                      <Button onClick={handleExcelUpload}>가져오기</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* 검색하기 */}
                <Button size="sm" onClick={handleSearch} disabled={isSearching}>
                  <Search className="mr-2 h-4 w-4" />
                  검색하기
                </Button>

                {/* 엑셀 다운로드 */}
                <Button size="sm" onClick={handleExcelDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  엑셀 다운로드
                </Button>

                {/* 초기화 */}
                <Button size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  초기화
                </Button>

                {/* 선택 제거 */}
                <Button
                  size="sm"
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.length === 0}
                >
                  <X className="mr-2 h-4 w-4" />
                  선택 제거
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* 테이블 */}
            <div className="overflow-x-auto">
              <Table style={{ minWidth: "1400px" }}>
                <TableHeader className="bg-background sticky top-0 z-10">
                  <TableRow>
                    <TableHead rowSpan={2} className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead
                      colSpan={6}
                      className="border-b-0 text-center font-semibold"
                    >
                      기본정보
                    </TableHead>
                    <TableHead
                      colSpan={9}
                      className="border-b-0 text-center font-semibold"
                    >
                      메타정보
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-24">서명</TableHead>
                    <TableHead className="w-32">저작물명</TableHead>
                    <TableHead className="w-24">저작자명</TableHead>
                    <TableHead className="w-28">출판사명</TableHead>
                    <TableHead className="w-20">발행년도</TableHead>
                    <TableHead className="w-24">저작권 구분</TableHead>
                    <TableHead className="w-16">생년</TableHead>
                    <TableHead className="w-16">몰년</TableHead>
                    <TableHead className="w-20">KAC</TableHead>
                    <TableHead className="w-40">ISNI</TableHead>
                    <TableHead className="w-16">국적</TableHead>
                    <TableHead className="w-20">역할어</TableHead>
                    <TableHead className="w-32">거소 및 단체정보</TableHead>
                    <TableHead className="w-28">권리자 불명여부</TableHead>
                    <TableHead className="w-20">저작권 여부</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                      </TableCell>
                      <TableCell>{item.signature}</TableCell>
                      <TableCell>{item.workTitle}</TableCell>
                      <TableCell>{item.authorName}</TableCell>
                      <TableCell>{item.publisherName}</TableCell>
                      <TableCell>{item.publicationYear}</TableCell>
                      <TableCell>{item.copyrightCategory}</TableCell>

                      {/* 메타정보 컬럼들 */}
                      <TableCell>{item.birthYear || ""}</TableCell>
                      <TableCell>{item.deathYear || ""}</TableCell>
                      <TableCell>{item.kac || ""}</TableCell>
                      <TableCell>{item.isni || ""}</TableCell>
                      <TableCell>{item.nationality || ""}</TableCell>
                      <TableCell>{item.roleDescription || ""}</TableCell>
                      <TableCell>{item.residenceInfo || ""}</TableCell>
                      <TableCell>{item.rightsHolderUnknown || ""}</TableCell>
                      <TableCell>{item.copyrightStatus || ""}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
