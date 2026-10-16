import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StoreOwnerRatings({ ownerEmail }) {
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [sort, setSort] = useState({ field: "name", direction: "asc" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadRatings() {
      try {
        const query = new URLSearchParams({ ownerEmail });
        const response = await fetch(
          `http://localhost:5000/api/store-owner/ratings?${query}`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Unable to load ratings");
        }
        setStore(result.store);
        setRatings(result.ratings);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      }
    }

    if (ownerEmail) loadRatings();
    return () => controller.abort();
  }, [ownerEmail]);

  const sortedRatings = useMemo(() => [...ratings].sort((left, right) => {
    const first = String(left[sort.field] ?? "");
    const second = String(right[sort.field] ?? "");
    return sort.direction === "asc"
      ? first.localeCompare(second, undefined, { numeric: true })
      : second.localeCompare(first, undefined, { numeric: true });
  }), [ratings, sort]);

  function toggleSort(field) {
    setSort((current) => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <Card className="ml-4 mt-8">
      <CardHeader>
        <CardTitle>
          {store?.name || "Store"} - Average rating:{" "}
          {store?.averageRating ?? "--"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              {[
                ["name", "Name"],
                ["email", "Email"],
                ["address", "Address"],
                ["rating", "Rating"],
              ].map(([field, label]) => (
                <TableHead key={field}>
                  <button type="button" onClick={() => toggleSort(field)}>
                    {label} {sort.field === field ? (sort.direction === "asc" ? "↑" : "↓") : ""}
                  </button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.length ? (
              sortedRatings.map((rating) => (
                <TableRow key={`${rating.email}-${rating.rating}`}>
                  <TableCell>{rating.name}</TableCell>
                  <TableCell>{rating.email}</TableCell>
                  <TableCell>{rating.address}</TableCell>
                  <TableCell>{rating.rating}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users have submitted ratings yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
