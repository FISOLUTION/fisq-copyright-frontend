import React from "react";
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
import { BasicColumn } from "./BookSearchTable";

export interface PreviewData {
  [key: string]: string;
}

interface ExcelUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: () => void;
  previewData: PreviewData[];
  columns: BasicColumn[];
}

export default function ExcelUploadDialog({
  open,
  onOpenChange,
  onUpload,
  previewData,
  columns,
}: ExcelUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <input type="file" className="hidden" accept=".xlsx,.xls" />
            <p className="mt-2 text-sm text-blue-600">sample-data.xlsx</p>
          </div>

          {/* 미리보기 테이블 */}
          <div>
            <h4 className="mb-2 font-medium">미리보기 (3행)</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {row[column.key] || ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={onUpload}>가져오기</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
