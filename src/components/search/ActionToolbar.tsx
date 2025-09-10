import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Plus, RotateCcw, Search, Upload, X } from "lucide-react";
import SingleAddDialog, { FormField } from "./SingleAddDialog";
import ExcelUploadDialog, { PreviewData } from "./ExcelUploadDialog";
import { BasicColumn } from "./BookSearchTable";

interface ActionToolbarProps {
  onSingleAdd: (formData: FormData) => void;
  onExcelUpload: () => void;
  onSearch: () => void;
  onExcelDownload: () => void;
  onReset: () => void;
  onRemoveSelected: () => void;
  isSearching: boolean;
  selectedItemsCount: number;
  formFields: FormField[];
  previewData: PreviewData[];
  basicColumns: BasicColumn[];
}

export default function ActionToolbar({
  onSingleAdd,
  onExcelUpload,
  onSearch,
  onExcelDownload,
  onReset,
  onRemoveSelected,
  isSearching,
  selectedItemsCount,
  formFields,
  previewData,
  basicColumns,
}: ActionToolbarProps) {
  const [singleAddOpen, setSingleAddOpen] = useState(false);
  const [excelUploadOpen, setExcelUploadOpen] = useState(false);

  const handleSingleAdd = (formData: FormData) => {
    onSingleAdd(formData);
    setSingleAddOpen(false);
  };

  const handleExcelUpload = () => {
    onExcelUpload();
    setExcelUploadOpen(false);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => setSingleAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          단건 추가하기
        </Button>

        <Button size="sm" onClick={() => setExcelUploadOpen(true)}>
          <Upload className="mr-2 h-4 w-4" />
          엑셀 업로드
        </Button>

        <Button size="sm" onClick={onSearch} disabled={isSearching}>
          <Search className="mr-2 h-4 w-4" />
          검색하기
        </Button>

        <Button size="sm" onClick={onExcelDownload}>
          <Download className="mr-2 h-4 w-4" />
          엑셀 다운로드
        </Button>

        <Button size="sm" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          초기화
        </Button>

        <Button
          size="sm"
          onClick={onRemoveSelected}
          disabled={selectedItemsCount === 0}
        >
          <X className="mr-2 h-4 w-4" />
          선택 제거
        </Button>
      </div>

      <SingleAddDialog
        open={singleAddOpen}
        onOpenChange={setSingleAddOpen}
        onSubmit={handleSingleAdd}
        fields={formFields}
      />

      <ExcelUploadDialog
        open={excelUploadOpen}
        onOpenChange={setExcelUploadOpen}
        onUpload={handleExcelUpload}
        previewData={previewData}
        columns={basicColumns}
      />
    </>
  );
}
