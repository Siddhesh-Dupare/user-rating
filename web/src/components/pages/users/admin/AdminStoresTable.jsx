import { useEffect, useState } from "react";
import { Store, Star } from "lucide-react";

import DirectoryTable from "./DirectoryTable";

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
        {value ?? "0"}
      </span>
    ),
  },
];

export default function AdminStoresTable() {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStores() {
      try {
        const response = await fetch("http://localhost:5000/api/admin/stores", {
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
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadStores();
    return () => controller.abort();
  }, []);

  return (
    <DirectoryTable
      rows={stores}
      columns={columns}
      title="Store owners"
      description="Monitor registered stores and ratings"
      icon={Store}
      searchPlaceholder="Search stores..."
      emptyMessage="No store owners found."
      error={error}
      isLoading={isLoading}
    />
  );
}
