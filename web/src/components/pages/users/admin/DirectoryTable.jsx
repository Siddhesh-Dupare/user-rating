import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Search,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function getInitials(name) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U"
  );
}

function getRoleStyles(role) {
  if (role === "ADMIN") {
    return "bg-[#1824ff]/10 text-[#1824ff] ring-[#1824ff]/20";
  }

  if (role === "STORE_OWNER") {
    return "bg-[#1824ff]/10 text-[#1824ff] ring-[#1824ff]/20";
  }

  return "bg-emerald-50 text-emerald-600 ring-emerald-200";
}

function renderCell(value, column, row) {
  if (column.render) {
    return column.render(value, row);
  }

  if (column.key === "name") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1824ff] text-xs font-bold text-white shadow-lg shadow-[#1824ff]/20">
          {getInitials(value)}
        </div>
        <span className="max-w-40 truncate font-medium text-[#172033] sm:max-w-none">
          {value}
        </span>
      </div>
    );
  }

  if (column.key === "role") {
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ring-1 ${getRoleStyles(value)}`}
      >
        {value}
      </span>
    );
  }

  return value ?? "";
}

export default function DirectoryTable({
  rows,
  columns,
  title,
  description,
  icon: Icon,
  searchPlaceholder = "Search...",
  emptyMessage = "No records found.",
  error = "",
  isLoading = false,
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ field: columns[0]?.key, direction: "asc" });

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matchingRows = rows.filter((row) =>
      query
        ? columns.some((column) =>
            String(row[column.key] ?? "").toLowerCase().includes(query),
          )
        : true,
    );

    return matchingRows.sort((left, right) => {
      const first = String(left[sort.field] ?? "");
      const second = String(right[sort.field] ?? "");
      const comparison = first.localeCompare(second, undefined, {
        numeric: true,
        sensitivity: "base",
      });

      return sort.direction === "asc" ? comparison : -comparison;
    });
  }, [columns, rows, search, sort]);

  function toggleSort(field) {
    setSort((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }

  return (
    <Card className="mt-8 overflow-hidden border-[#e1e5ec] bg-white text-[#172033] shadow-[0_8px_24px_rgba(31,43,68,0.06)]">
      <CardHeader className="gap-5 border-b border-[#e1e5ec] bg-[#fbfcfe] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#1824ff]/10 p-2.5 text-[#1824ff] ring-1 ring-[#1824ff]/15">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-[#172033]">{title}</CardTitle>
            <p className="mt-1 text-sm text-[#7b8494]">{description}</p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b94a5]" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-10 rounded-xl border-[#dfe4ed] bg-white pl-9 text-sm text-[#172033] placeholder:text-[#a1a9b7] shadow-sm focus:border-[#1824ff] focus:ring-[#1824ff]"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <p className="border-b border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="p-3 sm:p-5">
          <div className="overflow-x-auto rounded-xl border border-[#e1e5ec] bg-white">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-[#e1e5ec] bg-[#fbfcfe] hover:bg-[#fbfcfe]">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7b8494] sm:px-5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="group flex items-center gap-2 transition-colors hover:text-[#1824ff]"
                        aria-label={`Sort by ${column.label}`}
                      >
                        {column.label}
                        {sort.field === column.key ? (
                          sort.direction === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-[#1824ff]" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-[#1824ff]" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 text-[#c3c9d4] transition-colors group-hover:text-[#1824ff]" />
                        )}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-[#e1e5ec] hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="h-28 px-5 text-center text-[#8b94a5]"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length ? (
                  filteredRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-[#e1e5ec] transition-colors hover:bg-[#1824ff]/[0.04]"
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={`px-4 py-4 sm:px-5 ${
                            column.key === "address"
                              ? "max-w-40 truncate text-[#6f788a] sm:max-w-56"
                              : column.key === "email"
                                ? "text-[#4f596b]"
                                  : column.key === "role"
                                    ? "whitespace-nowrap"
                                    : ""
                          }`}
                        >
                          {renderCell(row[column.key], column, row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-[#e1e5ec] hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="h-28 px-5 text-center text-[#8b94a5]"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#e1e5ec] px-5 py-4">
          <p className="text-xs text-[#8b94a5] sm:text-sm">
            Showing{" "}
            <span             className="font-medium text-[#4f596b]">
              {filteredRows.length}
            </span>{" "}
            of{" "}
            <span             className="font-medium text-[#4f596b]">{rows.length}</span>{" "}
            records
          </p>
          <span className="rounded-full bg-[#f0f2f7] px-3 py-1 text-xs text-[#7b8494]">
            {search ? "Filtered results" : "All records"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
