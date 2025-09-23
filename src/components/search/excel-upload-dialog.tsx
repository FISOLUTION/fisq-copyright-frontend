import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { BasicColumn } from "./book-search-table";

export interface PreviewData {
  [key: string]: string;
}

interface ExcelUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: PreviewData[]) => void;
  columns: BasicColumn[];
}

export default function ExcelUploadDialog({
  open,
  onOpenChange,
  onUpload,
  columns,
}: ExcelUploadDialogProps) {
  const [uploadedData, setUploadedData] = useState<PreviewData[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentData = uploadedData;
  const rowCount = currentData.length;

  const processExcelFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: false,
          });

          // 첫 번째 행을 헤더로 사용하고, 나머지를 데이터로 처리
          const rows = (jsonData.slice(1) as string[][]) || [];

          // 기본정보 컬럼들에 맞춰서 데이터 변환
          const processedData: PreviewData[] = rows.map((row) => {
            const item: PreviewData = {};
            columns.forEach((col, index) => {
              item[col.key] = (row[index] as string) || "";
            });
            return item;
          });

          setUploadedData(processedData);
          setFileName(file.name);
        } catch (error) {
          console.error("Error processing Excel file:", error);
          alert("엑셀 파일 처리 중 오류가 발생했습니다.");
        }
      };
      reader.readAsArrayBuffer(file);
    },
    [columns],
  );

  const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processExcelFile(file);
      }
    },
    [processExcelFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        processExcelFile(file);
      } else {
        alert("xlsx 또는 xls 파일만 업로드 가능합니다.");
      }
    },
    [processExcelFile],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 다이얼로그가 열릴 때 상태 초기화
  useEffect(() => {
    if (open) {
      setUploadedData([]);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] flex-col sm:max-w-6xl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>엑셀 업로드</DialogTitle>
          <DialogDescription>
            xlsx/xls 파일을 업로드하여 데이터를 미리 확인하고 가져올 수
            있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 컨텐츠 영역을 flex로 관리 */}
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          {/* 드롭존 - 고정 높이 */}
          <div className="flex-shrink-0">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                (e.key === "Enter" || e.key === " ") && openFilePicker()
              }
              className="hover:bg-muted/50 cursor-pointer rounded-lg border border-dashed p-6 text-center transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onClick={openFilePicker}
              aria-label="엑셀 파일 업로드"
            >
              <Upload className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
              <p className="mb-1 text-sm">
                엑셀 파일을 드래그하거나 클릭하여 업로드
              </p>
              <p className="text-muted-foreground text-xs">
                *.xlsx, *.xls 파일만 지원
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFilePicker();
                }}
              >
                파일 선택
              </Button>
              {fileName && (
                <p className="text-muted-foreground mt-2 text-xs">{fileName}</p>
              )}
            </div>
          </div>

          {/* 미리보기 테이블 - 남은 공간 사용 */}
          <div className="flex min-h-0 flex-1 flex-col">
            <h4 className="mb-2 flex-shrink-0 font-medium">
              미리보기 ({rowCount}행)
            </h4>
            {currentData.length > 0 ? (
              <div className="flex-1 overflow-hidden rounded-md border">
                <ScrollArea className="h-full w-full">
                  <Table>
                    <TableHeader className="bg-background sticky top-0 z-10">
                      <TableRow>
                        {columns.map((column) => (
                          <TableHead
                            key={column.key}
                            className="whitespace-nowrap"
                          >
                            {column.label}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((row, index) => (
                        <TableRow key={index}>
                          {columns.map((column) => (
                            <TableCell
                              key={column.key}
                              className="whitespace-nowrap"
                            >
                              {row[column.key] || ""}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-md border">
                <p className="text-muted-foreground text-sm">
                  엑셀 파일을 업로드하면 여기에 미리보기가 표시됩니다.
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            variant="ghost"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={() => onUpload(currentData)}
            disabled={currentData.length === 0}
          >
            가져오기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
