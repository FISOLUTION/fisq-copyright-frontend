import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { BasicColumn } from "./BookSearchTable";

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

  const processExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // 첫 번째 행을 헤더로 사용하고, 나머지를 데이터로 처리
        const rows = jsonData.slice(1) as string[][];
        
        // 기본정보 컬럼들에 맞춰서 데이터 변환
        const processedData: PreviewData[] = rows.map((row) => {
          const item: PreviewData = {};
          columns.forEach((col, index) => {
            item[col.key] = row[index] || "";
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
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processExcelFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      processExcelFile(file);
    } else {
      alert("xlsx 또는 xls 파일만 업로드 가능합니다.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 다이얼로그가 열릴 때 상태 초기화
  React.useEffect(() => {
    if (open) {
      setUploadedData([]);
      setFileName("");
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>엑셀 업로드</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-auto max-h-[60vh]">
          {/* 드롭존 */}
          <div 
            className="border-border rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <p className="text-foreground mb-2">
              엑셀 파일을 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-muted-foreground text-sm">
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
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              파일 선택
            </Button>
            {fileName && (
              <p className="mt-2 text-sm text-blue-600">{fileName}</p>
            )}
          </div>

          {/* 미리보기 테이블 */}
          <div>
            <h4 className="mb-2 font-medium">미리보기 ({rowCount}행)</h4>
            {currentData.length > 0 ? (
              <div className="overflow-x-auto border rounded-lg">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.key} className="whitespace-nowrap">{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentData.map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell key={column.key} className="whitespace-nowrap">
                            {row[column.key] || ""}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 border rounded-lg">
                엑셀 파일을 업로드하면 여기에 미리보기가 표시됩니다.
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button 
            onClick={() => onUpload(currentData)}
            disabled={currentData.length === 0}
          >
            가져오기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
