import { useEffect, useState } from "react";

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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ratings.length ? (
              ratings.map((rating) => (
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
