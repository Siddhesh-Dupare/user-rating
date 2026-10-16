import { useEffect, useState } from "react";
import { Star, Store } from "lucide-react";
import { useSelector } from "react-redux";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DirectoryTable from "../admin/DirectoryTable";

export default function UserStoresTable() {
  const userEmail = useSelector((state) => state.auth.user?.email);
  const [stores, setStores] = useState([]);
  const [ratingValues, setRatingValues] = useState({});
  const [ratingErrors, setRatingErrors] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadStores() {
      try {
        setError("");
        const query = new URLSearchParams({ userEmail });
        const response = await fetch(
          `http://localhost:5000/api/store?${query}`,
          { signal: controller.signal },
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
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadStores();
    return () => controller.abort();
  }, [userEmail]);

  async function submitRating(storeId) {
    const rating = Number(ratingValues[storeId]);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setRatingErrors((current) => ({
        ...current,
        [storeId]: "Choose a whole-number rating from 1 to 5.",
      }));
      return;
    }

    try {
      setRatingErrors((current) => ({ ...current, [storeId]: "" }));
      const response = await fetch("http://localhost:5000/api/store/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, userEmail, rating }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit rating");
      }

      setStores((current) =>
        current.map((store) =>
          store.id === storeId
            ? { ...store, userRating: result.rating }
            : store,
        ),
      );
      setRatingValues((current) => ({ ...current, [storeId]: result.rating }));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const columns = [
    { key: "name", label: "Store name" },
    { key: "address", label: "Address" },
    {
      key: "overallRating",
      label: "Overall rating",
      render: (value) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-[#1824ff]">
          <Star className="h-4 w-4 fill-current" />
          {value || "Not rated"}
        </span>
      ),
    },
    {
      key: "userRating",
      label: "Your rating",
      render: (value) => (
        <span className="font-medium text-[#4f596b]">
          {value ?? "Not rated"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Rating action",
      render: (_, store) => (
        <div className="min-w-52">
          <div className="flex items-center gap-2">
            <Input
              className="h-9 w-20 border-[#dfe4ed] bg-white text-[#172033]"
              type="number"
              min="1"
              max="5"
              step="1"
              value={ratingValues[store.id] ?? store.userRating ?? ""}
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
              className="h-9 bg-[#1824ff] text-white hover:bg-[#101dcc]"
            >
              {store.userRating ? "Modify" : "Submit"}
            </Button>
          </div>
          {ratingErrors[store.id] && (
            <p className="mt-1 text-xs text-red-600">{ratingErrors[store.id]}</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <DirectoryTable
      rows={stores}
      columns={columns}
      title="Store listings"
      description="Find stores and share your experience"
      icon={Store}
      searchPlaceholder="Search stores by name or address..."
      emptyMessage="No stores found."
      error={error}
      isLoading={isLoading}
    />
  );
}
