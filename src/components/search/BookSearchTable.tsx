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

export interface BookSearchData {
  id: string;
  [key: string]: string | boolean | undefined;
}

interface BookSearchTableProps<T extends BookSearchData> {
  data: T[];
  selectedItems: string[];
  onSelectAll: () => void;
  onSelectItem: (id: string) => void;
  basicColumns: BasicColumn[];
  metaColumns: MetaColumn[];
  allSelected: boolean;
}

export default function BookSearchTable<T extends BookSearchData>({
  data,
  selectedItems,
  onSelectAll,
  onSelectItem,
  basicColumns,
  metaColumns,
  allSelected,
}: BookSearchTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <Table style={{ minWidth: "1400px" }}>
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow className="hover:bg-transparent">
            <TableHead
              rowSpan={2}
              className="hover:bg-muted/50 relative cursor-pointer p-0 text-center transition-colors"
            >
              <div className="flex h-full w-full items-center justify-center px-2">
                <Checkbox checked={allSelected} onCheckedChange={onSelectAll} />
              </div>
            </TableHead>
            <TableHead
              colSpan={basicColumns.length}
              className="hover:bg-muted/50 cursor-default border-b-0 text-left font-semibold transition-colors"
            >
              기본정보
            </TableHead>
            <TableHead
              colSpan={metaColumns.length}
              className="hover:bg-muted/50 cursor-default border-b-0 text-left font-semibold transition-colors"
            >
              메타정보
            </TableHead>
          </TableRow>
          <TableRow className="hover:bg-transparent">
            {basicColumns.map((column) => (
              <TableHead
                key={column.key}
                className={`${column.width} hover:bg-muted/50 cursor-default transition-colors`}
              >
                {column.label}
              </TableHead>
            ))}
            {metaColumns.map((column) => (
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
              <TableCell className="p-0 text-center">
                <div className="flex h-full w-full items-center justify-center px-2">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => onSelectItem(item.id)}
                  />
                </div>
              </TableCell>

              {basicColumns.map((column) => (
                <TableCell key={column.key}>{item[column.key] || ""}</TableCell>
              ))}

              {metaColumns.map((column) => (
                <TableCell key={column.key}>{item[column.key] || ""}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
