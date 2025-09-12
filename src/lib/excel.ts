import {
  BasicColumn,
  BookSearchData,
  MetaColumn,
} from "@/components/search/book-search-table";
import * as XLSX from "xlsx";

export function excel<T extends BookSearchData>(
  data: T[],
  basicColumns: BasicColumn[],
  metaColumns: MetaColumn[],
  filename: string = "search-results",
) {
  if (data.length === 0) {
    return;
  }

  const allColumns = [...basicColumns, ...metaColumns];

  const headers = allColumns.map((col) => col.label);

  const worksheetData = [
    headers,
    ...data.map((row) => allColumns.map((col) => row[col.key] || "")),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "검색결과");

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
