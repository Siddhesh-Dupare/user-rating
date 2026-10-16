import { useEffect, useState } from "react";

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
  { accessorKey: "rating", header: "Rating" },
];

export default function StoreListingsTable() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStores() {
      try {
        const query = new URLSearchParams({ search });
        const response = await fetch(`http://localhost:5000/api/store?${query}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Unable to load stores");
        }
        setStores(result.stores);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      }
    }

    loadStores();
    return () => controller.abort();
  }, [search]);

  return (
    <Card className="ml-4 mt-8">
      <CardHeader>
        <CardTitle>Stores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by store name or city (e.g. ganesh pune)"
          aria-label="Search stores"
        />
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>{column.header}</TableHead>
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
