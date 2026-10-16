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
    return "bg-[#6842f5]/20 text-[#c4b5fd] ring-[#6842f5]/30";
  }

  if (role === "STORE_OWNER") {
    return "bg-sky-400/15 text-sky-300 ring-sky-400/25";
  }

  return "bg-emerald-400/15 text-emerald-300 ring-emerald-400/25";
}

function renderCell(value, column, row) {
  if (column.render) {
    return column.render(value, row);
  }

  if (column.key === "name") {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#6842f5] to-[#4779e9] text-xs font-bold text-white shadow-lg shadow-[#6842f5]/20">
          {getInitials(value)}
        </div>
        <span className="max-w-40 truncate font-medium text-white sm:max-w-none">
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
    <Card className="mt-8 overflow-hidden border-white/10 bg-[#17181c] text-zinc-100 shadow-2xl shadow-black/20">
      <CardHeader className="gap-5 border-b border-white/10 bg-gradient-to-r from-[#202126] to-[#17181c] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#6842f5]/15 p-2.5 text-[#a78bfa] ring-1 ring-[#6842f5]/20">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">{title}</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">{description}</p>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-10 rounded-xl border-white/10 bg-[#101114] pl-9 text-sm text-white placeholder:text-zinc-600 shadow-inner focus:border-[#6842f5] focus:ring-[#6842f5]"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {error && (
          <p className="border-b border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
            {error}
          </p>
        )}
        <div className="p-3 sm:p-5">
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#101114]/60">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-white/10 bg-white/[0.02] hover:bg-white/[0.02]">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className="h-12 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 sm:px-5"
                    >
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className="group flex items-center gap-2 transition-colors hover:text-zinc-200"
                        aria-label={`Sort by ${column.label}`}
                      >
                        {column.label}
                        {sort.field === column.key ? (
                          sort.direction === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-[#a78bfa]" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-[#a78bfa]" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-3.5 w-3.5 text-zinc-700 transition-colors group-hover:text-zinc-400" />
                        )}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="h-28 px-5 text-center text-zinc-500"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredRows.length ? (
                  filteredRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="border-white/10 transition-colors hover:bg-[#6842f5]/[0.08]"
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.key}
                          className={`px-4 py-4 sm:px-5 ${
                            column.key === "address"
                              ? "max-w-40 truncate text-zinc-400 sm:max-w-56"
                              : column.key === "email"
                                ? "text-zinc-300"
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
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableCell
                      colSpan={columns.length}
                      className="h-28 px-5 text-center text-zinc-500"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <p className="text-xs text-zinc-500 sm:text-sm">
            Showing{" "}
            <span className="font-medium text-zinc-300">
              {filteredRows.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-zinc-300">{rows.length}</span>{" "}
            records
          </p>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-500">
            {search ? "Filtered results" : "All records"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
