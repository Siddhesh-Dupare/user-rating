import { useEffect, useState } from "react";
import { Star, Users } from "lucide-react";
import { useSelector } from "react-redux";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DirectoryTable from "../admin/DirectoryTable";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  {
    key: "rating",
    label: "Rating",
    render: (value) => (
      <span className="inline-flex items-center gap-1.5 font-medium text-[#1824ff]">
        <Star className="h-4 w-4 fill-current" />
        {value}
      </span>
    ),
  },
];

export default function StoreOwnerRatings() {
  const ownerEmail = useSelector((state) => state.auth.user?.email);
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ownerEmail) {
      return undefined;
    }

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
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadRatings();
    return () => controller.abort();
  }, [ownerEmail]);

  return (
    <>
      <Card className="mt-8 border-[#e1e5ec] bg-white text-[#172033] shadow-[0_8px_24px_rgba(31,43,68,0.06)]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#e1e5ec] bg-[#fbfcfe] px-5 py-5">
          <div>
            <CardTitle className="text-lg text-[#172033]">
              {store?.name || "Your store"}
            </CardTitle>
            <p className="mt-1 text-sm text-[#7b8494]">
              Average rating from submitted reviews
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[#1824ff]/10 px-4 py-3 text-[#1824ff]">
            <Star className="h-5 w-5 fill-current" />
            <span className="text-2xl font-bold">
              {store?.averageRating ?? "—"}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-2 px-5 py-4 text-sm text-[#6f788a]">
          <Users className="h-4 w-4 text-[#1824ff]" />
          {ratings.length} submitted rating{ratings.length === 1 ? "" : "s"}
        </CardContent>
      </Card>

      <DirectoryTable
        rows={ratings}
        columns={columns}
        title="Rating submissions"
        description="Users who submitted ratings for your store"
        icon={Users}
        searchPlaceholder="Search reviewers..."
        emptyMessage="No users have submitted ratings yet."
        error={error}
        isLoading={isLoading}
      />
    </>
  );
}
