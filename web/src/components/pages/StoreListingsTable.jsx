import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  { accessorKey: "name", header: "Store Name" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "overallRating", header: "Overall Rating" },
];

export default function StoreListingsTable({ userEmail }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingValues, setRatingValues] = useState({});
  const [ratingError, setRatingError] = useState({});
  const [error, setError] = useState("");
  const [sort, setSort] = useState({ field: "name", direction: "asc" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadStores() {
      try {
        const query = new URLSearchParams({ search, userEmail });
        const response = await fetch(
          `http://localhost:5000/api/store?${query}`,
          {
            signal: controller.signal,
          },
        );
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
  }, [search, userEmail]);

  async function submitRating(storeId) {
    const rating = Number(ratingValues[storeId]);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setRatingError((current) => ({
        ...current,
        [storeId]: "Choose a whole-number rating from 1 to 5.",
      }));
      return;
    }

    const sortedStores = useMemo(
      () =>
        [...stores].sort((left, right) => {
          const first = String(left[sort.field] ?? "");
          const second = String(right[sort.field] ?? "");
          return sort.direction === "asc"
            ? first.localeCompare(second, undefined, { numeric: true })
            : second.localeCompare(first, undefined, { numeric: true });
        }),
      [stores, sort],
    );

    function toggleSort(field) {
      setSort((current) => ({
        field,
        direction:
          current.field === field && current.direction === "asc"
            ? "desc"
            : "asc",
      }));
    }
    setRatingError((current) => ({ ...current, [storeId]: "" }));

    const response = await fetch("http://localhost:5000/api/store/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, userEmail, rating }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.message || "Unable to submit rating");
      return;
    }
    setStores((current) =>
      current.map((store) =>
        store.id === storeId ? { ...store, userRating: result.rating } : store,
      ),
    );
  }

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
                <TableHead key={column.accessorKey}>
                  <button
                    type="button"
                    onClick={() => toggleSort(column.accessorKey)}
                  >
                    {column.header}{" "}
                    {sort.field === column.accessorKey
                      ? sort.direction === "asc"
                        ? "↑"
                        : "↓"
                      : ""}
                  </button>
                </TableHead>
              ))}
              <TableHead>User&apos;s Submitted Rating</TableHead>
              <TableHead>Rating Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.length ? (
              sortedStores.map((store) => (
                <TableRow key={store.id}>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      {column.accessorKey === "overallRating"
                        ? store.overallRating || "Not rated"
                        : (store[column.accessorKey] ?? "")}
                    </TableCell>
                  ))}
                  <TableCell>{store.userRating ?? "Not rated"}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Input
                          className="w-20"
                          type="number"
                          min="1"
                          max="5"
                          step="1"
                          value={
                            ratingValues[store.id] ?? store.userRating ?? ""
                          }
                          onChange={(event) =>
                            setRatingValues((current) => ({
                              ...current,
                              [store.id]: event.target.value,
                            }))
                          }
                          aria-label={`Rating for ${store.name}`}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => submitRating(store.id)}
                        >
                          {store.userRating ? "Modify" : "Submit"}
                        </Button>
                      </div>
                      {ratingError[store.id] && (
                        <p className="mt-1 text-xs text-destructive">
                          {ratingError[store.id]}
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 2}
                  className="h-24 text-center"
                >
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
