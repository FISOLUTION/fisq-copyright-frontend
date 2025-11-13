import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Download, Plus, RotateCcw, Search, Upload, X } from "lucide-react";
import SingleAddDialog, { FormField } from "./single-add-dialog";
import ExcelUploadDialog from "./excel-upload-dialog";
import { BasicColumn } from "./book-search-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { aiModeUtils } from "@/utils/ai-mode";
import { AIMode, AIModeValue, DEFAULT_AI_MODE } from "@/types/ai-mode";

interface ActionToolbarProps {
  onSingleAdd: (formData: FormData) => void;
  onExcelUpload: (data: { [key: string]: string }[]) => void;
  onSearch: () => void;
  onExcelDownload: () => void;
  onReset: () => void;
  onRemoveSelected: () => void;
  isSearching: boolean;
  selectedItemsCount: number;
  formFields: FormField[];
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
  basicColumns,
}: ActionToolbarProps) {
  const [singleAddOpen, setSingleAddOpen] = useState(false);
  const [excelUploadOpen, setExcelUploadOpen] = useState(false);
  const [aiMode, setAiMode] = useState<AIModeValue>(DEFAULT_AI_MODE);

  useEffect(() => {
    const savedAiMode = aiModeUtils.get();
    setAiMode(savedAiMode);
  }, []);

  const handleAiModeChange = (value: AIModeValue) => {
    setAiMode(value);
    aiModeUtils.set(value);
  };

  const handleSingleAdd = (formData: FormData) => {
    onSingleAdd(formData);
    setSingleAddOpen(false);
  };

  const handleExcelUpload = (data: { [key: string]: string }[]) => {
    onExcelUpload(data);
    setExcelUploadOpen(false);
  };

  return (
    <>
      <ButtonGroup className="flex-wrap !items-center">
        <Select value={aiMode} onValueChange={handleAiModeChange}>
          <SelectTrigger size="sm" className="w-[150px]">
            <SelectValue placeholder="AI 모드 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(AIMode).map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                {mode.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button size="sm" variant="outline" onClick={onSearch} disabled={isSearching}>
          <Search className="mr-2 h-4 w-4" />
          검색하기
        </Button>

        <ButtonGroup>
          <Button size="sm" variant="outline" onClick={() => setSingleAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            단건 추가하기
          </Button>

          <Button size="sm" variant="outline" onClick={() => setExcelUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            엑셀 업로드
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button size="sm" variant="outline" onClick={onExcelDownload}>
            <Download className="mr-2 h-4 w-4" />
            엑셀 다운로드
          </Button>

          <Button size="sm" variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            초기화
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            size="sm"
            variant="destructive"
            onClick={onRemoveSelected}
            disabled={selectedItemsCount === 0}
          >
            <X className="mr-2 h-4 w-4" />
            선택 제거
          </Button>
        </ButtonGroup>
      </ButtonGroup>

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
        columns={basicColumns}
      />
    </>
  );
}
