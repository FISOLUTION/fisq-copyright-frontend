import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export interface BasicColumn {
  key: string;
  label: string;
  width: string;
}

export interface MetaColumn {
  key: string;
  label: string;
  width: string;
}

export interface CopyrightColumn {
  key: string;
  label: string;
  width: string;
}

export interface BookSearchData {
  id: string;
  [key: string]: string | boolean | number | null | undefined;
}

interface BookSearchTableProps<T extends BookSearchData> {
  data: T[];
  selectedItems: string[];
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  basicColumns: BasicColumn[];
  metaColumns: MetaColumn[];
  copyrightColumns: CopyrightColumn[];
  allSelected: boolean;
}

function renderValue(value: string | boolean | number | null | undefined) {
  if (typeof value === "boolean") {
    return value ? "O" : "X";
  }

  return value ?? "-";
}

export default function BookSearchTable<T extends BookSearchData>({
  data,
  selectedItems,
  onSelectAll,
  onSelectItem,
  basicColumns,
  metaColumns,
  copyrightColumns,
  allSelected,
}: BookSearchTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <Table style={{ minWidth: "1400px" }}>
        <TableHeader className="bg-background sticky top-0 z-[5]">
          <TableRow className="hover:bg-transparent">
            <TableHead
              rowSpan={2}
              className="w-12 hover:bg-muted/50 relative cursor-pointer border-r transition-colors"
            >
              <div className="flex h-full w-full items-center justify-center px-2">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
              </div>
            </TableHead>
            <TableHead
              colSpan={basicColumns.length}
              className={`hover:bg-muted/50 cursor-default border-b-0 transition-colors ${metaColumns.length > 0 ? "border-r" : ""}`}
            >
              기본정보
            </TableHead>
            <TableHead
              colSpan={metaColumns.length}
              className={`hover:bg-muted/50 cursor-default border-b-0 transition-colors ${copyrightColumns.length > 0 ? "border-r" : ""}`}
            >
              메타정보
            </TableHead>
            <TableHead
              colSpan={copyrightColumns.length}
              className="hover:bg-muted/50 cursor-default border-b-0 transition-colors"
            >
              저작권 결과
            </TableHead>
          </TableRow>
          <TableRow className="hover:bg-transparent">
            {basicColumns.map((column, idx) => (
              <TableHead
                key={column.key}
                className={`${column.width} hover:bg-muted/50 cursor-default transition-colors ${idx === basicColumns.length - 1 && metaColumns.length > 0 ? "border-r" : ""}`}
              >
                {column.label}
              </TableHead>
            ))}
            {metaColumns.map((column, idx) => (
              <TableHead
                key={column.key}
                className={`${column.width} hover:bg-muted/50 cursor-default transition-colors ${idx === metaColumns.length - 1 && copyrightColumns.length > 0 ? "border-r" : ""}`}
              >
                {column.label}
              </TableHead>
            ))}
            {copyrightColumns.map((column) => (
              <TableHead
                key={column.key}
                className={`${column.width} hover:bg-muted/50 cursor-default transition-colors`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="border-r text-center">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => onSelectItem(item.id)}
                  />
                </div>
              </TableCell>

              {basicColumns.map((column, idx) => (
                <TableCell
                  key={column.key}
                  className={
                    idx === basicColumns.length - 1 && metaColumns.length > 0
                      ? "border-r"
                      : ""
                  }
                >
                  {renderValue(item[column.key])}
                </TableCell>
              ))}

              {metaColumns.map((column, idx) => (
                <TableCell
                  key={column.key}
                  className={
                    idx === metaColumns.length - 1 &&
                    copyrightColumns.length > 0
                      ? "border-r"
                      : ""
                  }
                >
                  {renderValue(item[column.key])}
                </TableCell>
              ))}

              {copyrightColumns.map((column) => (
                <TableCell key={column.key}>
                  {renderValue(item[column.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
