import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "rating",
    header: "Rating",
  },
];

export default function StoresTable({ onBack }) {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [sort, setSort] = useState({ sortBy: "name", sortOrder: "asc" });

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ ...filters, ...sort });

    async function loadStores() {
      try {
        setError("");
        const response = await fetch(
          `http://localhost:5000/api/admin/stores?${query}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to load stores");
        setStores(result.stores);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      }
    }

    loadStores();
    return () => controller.abort();
  }, [filters, sort]);

  function toggleSort(sortBy) {
    setSort((current) => ({
      sortBy,
      sortOrder:
        current.sortBy === sortBy && current.sortOrder === "asc" ? "desc" : "asc",
    }));
  }

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Stores</CardTitle>
        <Button variant="outline" onClick={onBack}>Back to dashboard</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Filter by name" value={filters.name} onChange={(event) => updateFilter("name", event.target.value)} />
          <Input placeholder="Filter by email" value={filters.email} onChange={(event) => updateFilter("email", event.target.value)} />
          <Input placeholder="Filter by address" value={filters.address} onChange={(event) => updateFilter("address", event.target.value)} />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  <button type="button" onClick={() => toggleSort(column.accessorKey)}>
                    {column.header} {sort.sortBy === column.accessorKey ? (sort.sortOrder === "asc" ? "↑" : "↓") : ""}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length ? (
              stores.map((store) => (
                <TableRow key={store.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {store[column.accessorKey] ??
                        (column.accessorKey === "rating" ? "Not rated" : "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No stores found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
